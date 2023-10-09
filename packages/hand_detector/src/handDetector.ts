import { InferenceSession, Tensor, env as ONNXEnv } from "onnxruntime-web";

import { Box, Params } from "./types";
import { download, preprocessing } from "./utils";

const netModelURL = new URL('../models/hand_detector.onnx', import.meta.url)
const nmsModelURL = new URL('../models/nms-hand_detector.onnx', import.meta.url)

const ortWasmSimdURL = new URL('../../../node_modules/onnxruntime-web/dist/ort-wasm-simd.wasm', import.meta.url)
const ortWasmURL = new URL('../../../node_modules/onnxruntime-web/dist/ort-wasm.wasm', import.meta.url)
ONNXEnv.wasm.wasmPaths = {
    'ort-wasm-simd.wasm': ortWasmSimdURL.toString(),
    'ort-wasm.wasm': ortWasmURL.toString(),
}

const modelInputShape = [1, 3, 416, 416];
const inputArray = new Float32Array(modelInputShape.reduce((a, b) => a * b))
const [modelWidth, modelHeight] = modelInputShape.slice(2);

export class HandDetector {
    public inited = false;

    private net!: InferenceSession;
    private nms!: InferenceSession;
    private readonly nmsConfig: Tensor;
    /**
     * Creates an instance of HandDetector.
     * @param {Number} params.topk Maximum number of boxes to be selected per class
     * @param {Number} params.iouThreshold Threshold for deciding whether boxes overlap too much with respect to IOU
     * @param {Number} params.scoreThreshold Threshold for deciding when to remove boxes based on score
     * @memberof HandDetector
     */
    constructor(private readonly params: Params) {
        this.nmsConfig = new Tensor(
            "float32",
            new Float32Array([
                this.params.topk,
                this.params.iouThreshold,
                this.params.scoreThreshold,
            ])
        );
    }
    /**
     * Download and warmup models
     *
     * @memberof HandDetector
     */
    async initialize() {
        const [netModel, nmsModel] = await this.downloadModels()


        //@ts-ignore
        this.net = await InferenceSession.create(netModel, {
            executionProviders: ["wasm"],
        });

        //@ts-ignore
        this.nms = await InferenceSession.create(nmsModel, {
            executionProviders: ["wasm"],
        });

        // Warmup main model
        const tensor = new Tensor(
            "float32",
            inputArray,
            modelInputShape
        );
        await this.net.run({ images: tensor })

        this.inited = true;
    }
    /**
     *
     *
     * @param {HTMLImageElement} image Source image
     * @return {*}  {Promise<Box[]>}
     * @memberof HandDetector
     */
    async detect(image: HTMLImageElement): Promise<Box[]> {
        const { image: prepImage, xRatio, yRatio } = preprocessing(image, modelWidth, modelHeight);

        const netTensor = new Tensor("float32", prepImage, modelInputShape);

        const { output0 } = await this.net.run({ images: netTensor }); // Get raw output
        const { selected } = await this.nms.run({ detection: output0, config: this.nmsConfig }); // Filter boxes

        const boxes = [];
        for (let idx = 0; idx < selected.dims[1]; idx++) {
            const data = selected.data.slice(idx * selected.dims[2], (idx + 1) * selected.dims[2]); // Get rows
            const box = data.slice(0, 4) as unknown as number[];

            // Upscale box
            const [x, y, w, h] = [
                (box[0] - 0.5 * box[2]) * xRatio,
                (box[1] - 0.5 * box[3]) * yRatio,
                box[2] * xRatio,
                box[3] * yRatio,
            ];

            boxes.push({ x, y, w, h });
        }

        return boxes;
    }

    private async downloadModels() {
        return Promise.all([
            await download(
                netModelURL.toString(),
            ),
            await download(
                nmsModelURL.toString(),
            )
        ])
    }
}
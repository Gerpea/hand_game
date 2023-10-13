import { InferenceSession, Tensor, env as ONNXEnv } from "onnxruntime-web";
import { download, preprocessing, labelProbs } from "./utils";

const modelURL = new URL('./models/gesture_classification.onnx', import.meta.url)

const ortWasmSimdURL = new URL('../../../node_modules/onnxruntime-web/dist/ort-wasm-simd.wasm', import.meta.url)
const ortWasmURL = new URL('../../../node_modules/onnxruntime-web/dist/ort-wasm.wasm', import.meta.url)

ONNXEnv.wasm.wasmPaths = {
    'ort-wasm-simd.wasm': ortWasmSimdURL.toString(),
    'ort-wasm.wasm': ortWasmURL.toString(),
}

const MODEL_INPUT_SHAPE = [1, 3, 416, 416];
const INPUT_ARRAY = new Float32Array(MODEL_INPUT_SHAPE.reduce((a, b) => a * b))
const [modelWidth, modelHeight] = MODEL_INPUT_SHAPE.slice(2);

export class GestureClassifier {
    model;

    /**
     * Download and warmup model
     *
     * @memberof GestureClassifier
     */
    async initialize() {
        const model = await this.downloadModel()

        this.model = await InferenceSession.create(model, {
            executionProviders: ["wasm"],
        });

        // Warmup main model
        const tensor = new Tensor(
            "float32",
            INPUT_ARRAY,
            MODEL_INPUT_SHAPE
        );
        await this.model.run({ images: tensor })
    }
    /**
     *
     *
     * @param {String} image Source image in base64 string
     * @param {Box} box Crop box
     * @return {Promise<GestureClass[]>} Array of labaeled gesture probabilities
     * @memberof GestureClassifier
     */
    async classify(image, box) {
        const { float32Data } = await preprocessing(image, modelWidth, modelHeight, box);

        const tensor = new Tensor("float32", float32Data, MODEL_INPUT_SHAPE);

        // Get raw output
        const { output0 } = await this.model.run({ images: tensor });
        const results = labelProbs(Array.from(output0.data))

        return results

    }

    async downloadModel() {
        return download(
            modelURL.toString(),
        )
    }
}
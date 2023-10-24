import { InferenceSession, Tensor, env as ONNXEnv } from "onnxruntime-web";
import { download, preprocessing } from "./utils";

const netModelURL = new URL("./models/hand_detector.onnx", import.meta.url);
const nmsModelURL = new URL("./models/nms-hand_detector.onnx", import.meta.url);

const ortWasmSimdURL = new URL("../../../node_modules/onnxruntime-web/dist/ort-wasm-simd.wasm", import.meta.url);
const ortWasmURL = new URL("../../../node_modules/onnxruntime-web/dist/ort-wasm.wasm", import.meta.url);

ONNXEnv.wasm.wasmPaths = {
  "ort-wasm-simd.wasm": ortWasmSimdURL.toString(),
  "ort-wasm.wasm": ortWasmURL.toString()
};

const MODEL_INPUT_SHAPE = [1, 3, 416, 416];
const INPUT_ARRAY = new Float32Array(MODEL_INPUT_SHAPE.reduce((a, b) => a * b));
const [modelWidth, modelHeight] = MODEL_INPUT_SHAPE.slice(2);

const IOU_THRESHOLD = 0.45;
const SCORE_THRESHOLD = 0.25;
const TOP_K = 1;

export class HandDetector {
  net;
  nms;
  nmsConfig;
  /**
   * Creates an instance of HandDetector.
   * @param {Number} params.topk Maximum number of boxes to be selected per class
   * @param {Number} params.iouThreshold Threshold for deciding whether boxes overlap too much with respect to IOU
   * @param {Number} params.scoreThreshold Threshold for deciding when to remove boxes based on score
   * @memberof HandDetector
   */
  constructor(params) {
    this.setParams(params || {});
  }
  /**
   * Set params for detector
   * @param {Number} params.topk Maximum number of boxes to be selected per class
   * @param {Number} params.iouThreshold Threshold for deciding whether boxes overlap too much with respect to IOU
   * @param {Number} params.scoreThreshold Threshold for deciding when to remove boxes based on score
   * @memberof HandDetector
   */
  setParams(params) {
    this.nmsConfig = new Tensor(
      "float32",
      new Float32Array([
        params.topk || TOP_K,
        params.iouThreshold || IOU_THRESHOLD,
        params.scoreThreshold || SCORE_THRESHOLD
      ])
    );
  }
  /**
   * Download and warmup models
   *
   * @memberof HandDetector
   */
  async initialize() {
    const [netModel, nmsModel] = await this.downloadModels();

    this.net = await InferenceSession.create(netModel, {
      executionProviders: ["wasm"]
    });

    this.nms = await InferenceSession.create(nmsModel, {
      executionProviders: ["wasm"]
    });

    // Warmup main model
    const tensor = new Tensor("float32", INPUT_ARRAY, MODEL_INPUT_SHAPE);
    await this.net.run({ images: tensor });
  }
  /**
   *
   *
   * @param {String} image Source image in base64 string
   * @return {Promsie<Box[]>}  {Promise<Box[]>}
   * @memberof HandDetector
   */
  async detect(image) {
    const { float32Data, xRatio, yRatio } = await preprocessing(image, modelWidth, modelHeight);

    const netTensor = new Tensor("float32", float32Data, MODEL_INPUT_SHAPE);

    // Get raw output
    const { output0 } = await this.net.run({ images: netTensor });
    // Filter boxes
    const { selected } = await this.nms.run({
      detection: output0,
      config: this.nmsConfig
    });

    const boxes = [];
    for (let idx = 0; idx < selected.dims[1]; idx++) {
      // Get rows
      const data = selected.data.slice(idx * selected.dims[2], (idx + 1) * selected.dims[2]);
      const box = data.slice(0, 4);

      // Upscale box
      const [x, y, w, h] = [
        (box[0] - 0.5 * box[2]) * xRatio,
        (box[1] - 0.5 * box[3]) * yRatio,
        box[2] * xRatio,
        box[3] * yRatio
      ];

      boxes.push({ x, y, w, h });
    }

    return boxes;
  }

  async downloadModels() {
    return Promise.all([await download(netModelURL.toString()), await download(nmsModelURL.toString())]);
  }
}

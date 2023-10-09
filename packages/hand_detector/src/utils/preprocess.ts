//@ts-ignore
import cv from "@techstark/opencv-js";

/**
 * Preprocessing image
 * @param {HTMLImageElement} source Image source
 * @param {Number} modelWidth Model input width
 * @param {Number} modelHeight Model input height
 * @return Preprocessed image and ratios
 */
export const preprocessing = (source: HTMLImageElement, modelWidth: number, modelHeight: number)
    : { image: number[], xRatio: number, yRatio: number } => {
    // Read from img tag
    const mat = cv.imread(source);
    // New image matrix
    const matC3 = new cv.Mat(mat.rows, mat.cols, cv.CV_8UC3);
    // RGBA to BGR
    cv.cvtColor(mat, matC3, cv.COLOR_RGBA2BGR);

    // Padding image to [n x n] dim
    // Get max size from width and height
    const maxSize = Math.max(matC3.rows, matC3.cols);
    const xPad = maxSize - matC3.cols, // Set xPadding
        xRatio = maxSize / matC3.cols; // Set xRatio
    const yPad = maxSize - matC3.rows, // Set yPadding
        yRatio = maxSize / matC3.rows; // Set yRatio
    // New mat for padded image
    const matPad = new cv.Mat();
    // Padding black
    cv.copyMakeBorder(matC3, matPad, 0, yPad, 0, xPad, cv.BORDER_CONSTANT);

    // Preprocessing image matrix
    const input = cv.blobFromImage(
        matPad,
        1 / 255.0, // Normalize
        new cv.Size(modelWidth, modelHeight), // Resize to model input size
        new cv.Scalar(0, 0, 0),
        true, // SwapRB
        false // Crop
    );

    const image = input.data32F;

    // Release mat opencv
    mat.delete();
    matC3.delete();
    matPad.delete();
    input.delete();

    return { image, xRatio, yRatio };
}
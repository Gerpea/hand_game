import jimp from "jimp/es";

/**
 * Preprocessing image
 * @param {String} source Image source in base64 string
 * @param {Number} modelWidth Model input width
 * @param {Number} modelHeight Model input height
 * @param {Box?} box Crop box
 * @return Preprocessed image and ratios
 */
export const preprocessing = async (source, modelWidth, modelHeight, box) => {
  // Read image from base64 string
  let image = await jimp.read(source.replace(new ArrayBuffer(/^data:image\/\w+;base64,/, "")));
  if (box) {
    image = image.crop(box.x - box.x / 10, box.y - box.y / 10, box.w + box.x / 10, box.h + box.y / 10);
  }

  image = image.resize(modelWidth, modelHeight);

  //  Get buffer data from image and create R, G, and B arrays
  const imageBufferData = image.bitmap.data;
  const [redArray, greenArray, blueArray] = [[], [], []];

  // Loop through the image buffer and extract the R, G, and B channels
  for (let i = 0; i < imageBufferData.length; i += 4) {
    redArray.push(imageBufferData[i]);
    greenArray.push(imageBufferData[i + 1]);
    blueArray.push(imageBufferData[i + 2]);
  }

  //  Concatenate RGB to transpose [modelWidth, modelHeight, 3] -> [3, modelWidth, modelHeight] to a number array
  const transposedData = redArray.concat(greenArray).concat(blueArray);

  const float32Data = new Float32Array(transposedData.length);
  for (let i = 0; i < transposedData.length; i++) {
    // Convert to float
    float32Data[i] = transposedData[i] / 255.0;
  }

  // Set ratios
  const maxSize = Math.max(image.getWidth(), image.getHeight());
  const xRatio = maxSize / image.getWidth();
  const yRatio = maxSize / image.getHeight();

  return { float32Data, xRatio, yRatio };
};

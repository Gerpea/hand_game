/**
 * Download a file to a buffer with progress callback
 *
 * @async
 * @param {String} url - The url to download from
 * @param {onProgressHandler} [onProgress] - Callback for download progress
 * @returns {Promise} A promise that fullfiled with ArrayBuffer and rejected with
 * {
 *  status: string;
 *  statusText: string;
 * }
 */
export const download = (url, onProgress) => {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    if (onProgress) {
      request.onprogress = (e) => {
        const progress = (e.loaded / e.total) * 100;
        onProgress(progress);
      };
    }

    request.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(request.response);
      } else {
        reject({
          status: this.status,
          statusText: request.statusText
        });
      }
      resolve(request.response);
    };

    request.onerror = function () {
      reject({
        status: this.status,
        statusText: request.statusText
      });
    };

    request.send();
  });
};

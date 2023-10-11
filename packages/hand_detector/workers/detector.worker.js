
import { HandDetector } from './handDetector'

const detector = new HandDetector()
detector.initialize()

globalThis.onmessage = async function ({ data: { type, data } }) {
    switch (type) {
        case 'params':
            detector.setParams(data)
            return
        case 'image':
            // const image = new Image()
            // image.src = data
            const boxes = await detector.detect(data)
            self.postMessage({ type: 'boxes', data: boxes })
            return
    }
}
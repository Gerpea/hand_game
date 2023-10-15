
import { HandDetector } from './handDetector'

const detector = new HandDetector()

globalThis.onmessage = async function ({ data: { type, data } }) {
    switch (type) {
        case 'init':
            await detector.initialize()
            self.postMessage({ type: 'init', data: true })
            return
        case 'params':
            detector.setParams(data)
            return
        case 'image':
            const boxes = await detector.detect(data)
            self.postMessage({ type: 'boxes', data: boxes })
            return
    }
}
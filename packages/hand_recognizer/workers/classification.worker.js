
import { GestureClassifier } from './gestureClassifier'

const classifier = new GestureClassifier()
classifier.initialize()

globalThis.onmessage = async function ({ data: { type, data } }) {
    switch (type) {
        case 'image':
            const classes = await classifier.classify(data.image, data.box)
            self.postMessage({ type: 'classes', data: classes })
            return
    }
}
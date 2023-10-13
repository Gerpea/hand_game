import { Box, GestureClass, Params } from "./common.types"

type DetectorWorkerImageMessage = {
    type: 'image',
    data: string
}
type DetectorWorkerBoxesMessage = {
    type: 'boxes',
    data: Box[]
}
type DetectorWorkerParamsMessage = {
    type: 'params',
    data: Partial<Params>
}

type ClassificationWorkerRequestMessage = {
    type: 'image',
    data: {
        image: string;
        box?: Box;
    }
}

type ClassificationWorkerResponseMessage = {
    type: 'classes',
    data: GestureClass[]
}

export type DetectorWorkerMessage = DetectorWorkerImageMessage | DetectorWorkerBoxesMessage | DetectorWorkerParamsMessage

export interface DetectorWorker extends Omit<Worker, 'postMessage'> {
    postMessage(command: DetectorWorkerMessage): void;
}

export type ClassificationWorkerMessage = ClassificationWorkerRequestMessage | ClassificationWorkerResponseMessage;

export interface ClassificationWorker extends Omit<Worker, 'postMessage'> {
    postMessage(command: ClassificationWorkerMessage): void;
}
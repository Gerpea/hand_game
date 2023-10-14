import { GestureClass } from "hand_recognizer";

export type Gesture = Pick<GestureClass, 'id' | 'label'>
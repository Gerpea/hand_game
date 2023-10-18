import { GestureClass } from "hand_recognizer";

export type Gesture = Pick<GestureClass, 'id' | 'label'>

export type Game = {
    id: string;
    users: {
        [userID: string]: boolean
    },
    scores: {
        [userID: string]: number;
    }
}
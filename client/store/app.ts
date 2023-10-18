import { JTWPayload, SocketWithActions, createGame, createSocketWithHandlers, joinGame } from '@/api'
import { Game } from '@/types'
import jwtDecode from 'jwt-decode'
import { toast } from 'react-toastify'
import { StateCreator, create } from 'zustand'

type State = {
    game: Game;
    userID: string;
    accessToken: string;
}

type Actions = {
    addScore: () => void;
    joinGame: (gameID: string) => void;
    createGame: () => void;
}
const initialState: State = {
    game: {
        id: '',
        scores: {},
        users: {}
    },
    userID: '',
    accessToken: ''
}

const state: StateCreator<State & Actions, [], []> = (set, get) => {
    let socket: SocketWithActions;

    const createSocket = (accessToken: string) => createSocketWithHandlers({
        accessToken,
        onScore(game, userID) {
            set({ game })
        },
        onUserConnected(game, userID) {
            if (userID !== get().userID) {
                toast(`User with id ${userID} connected`)
            }
            set({ game })
        },
        onUserDisconnected(game, userID) {
            toast(`User with id ${userID} diconnected`)
            set({ game })
        },
        onError(error) {
            toast.error(error)
        }
    })

    return {
        ...initialState,
        addScore() {
            if (!socket) {
                socket = createSocket(get().accessToken)
            }
            socket.addScore()
        },
        async joinGame(gameID: string) {
            const { data, error } = await joinGame(gameID)
            if (error) {
                toast.error(error.messages[0])
                return
            }

            set({ accessToken: data.accessToken, game: data.game, userID: jwtDecode<JTWPayload>(data.accessToken).sub })

        },
        async createGame() {
            const { data, error } = await createGame()
            if (error) {
                toast.error(error.messages[0])
                return
            }

            set({ accessToken: data.accessToken, game: data.game, userID: jwtDecode<JTWPayload>(data.accessToken).sub })

        }
    }
}

export const useStore = create<State & Actions>(state)
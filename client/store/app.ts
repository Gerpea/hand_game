import { JTWPayload, SocketWithActions, createGame, createSocketWithHandlers, joinGame } from '@/api'
import { Game } from '@/types'
import jwtDecode from 'jwt-decode'
import { toast } from 'react-toastify'
import { StateCreator, create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

type State = {
    game: Game;
    userID: string;
    accessToken: string;
}

type Actions = {
    addScore: () => void;
    joinGame: (gameID: string) => void;
    createGame: () => Promise<string | undefined>;
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
    let socket: SocketWithActions | undefined;

    const createSocket = (accessToken: string, gameID: string) => createSocketWithHandlers({
        accessToken,
        gameID,
        onScore(game) {
            set({ game })
        },
        onUserConnected(game, userID) {
            if (userID !== get().userID) {
                toast(`User with id ${userID} connected`)
            }
            set({ game })
        },
        onUserDisconnected(game, userID) {
            if (userID !== get().userID) {
                toast(`User with id ${userID} diconnected`)
            }
            set({ game })
        },
        onError(error) {
            toast.error(error)
        }
    })

    return {
        ...initialState,
        addScore() {
            if (Object.values(get().game.users).filter((active) => active).length > 1) {
                socket?.addScore()
            }
        },
        async joinGame(gameID: string) {
            if (get().accessToken) {
                socket?.disconnect()
                socket = createSocket(get().accessToken, gameID)
                return
            }

            const { data, error } = await joinGame(gameID)
            if (error) {
                toast.error(error.message)
                get().createGame()
                return
            }

            socket?.disconnect()
            socket = createSocket(data.accessToken, gameID)

            set({ accessToken: data.accessToken, game: data.game, userID: jwtDecode<JTWPayload>(data.accessToken).sub })

        },
        async createGame() {
            const { data, error } = await createGame()
            if (error) {
                toast.error(error.message)
                return
            }

            socket?.disconnect()
            socket = createSocket(data.accessToken, data.game.id)

            set({ accessToken: data.accessToken, game: data.game, userID: jwtDecode<JTWPayload>(data.accessToken).sub })

            return data.game.id
        },
    }
}

export const useStore = create<State & Actions>()(devtools(persist(state, { name: 'game-storage', partialize: (state) => ({ accessToken: state.accessToken, userID: state.userID }) })))
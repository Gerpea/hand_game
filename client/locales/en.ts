const map = {
    'optionsModal.title': 'Share this url with your friend',
    'scoreModal.title': 'Score Board',
    'scoreModal.you': 'You',
    'scoreModal.opponent': 'Opponent',
    'scoreModal.disconnect': 'Disconnect',
    'toast.error.gameNotFound': 'Game not found, new game was created instead',
    'toast.error.tokenExpired': 'Access token just expired, creating new and rejoin to the game',
    'toast.userConnected': 'Your opponent enter the gmae',
    'toast.userDisconnected': 'Your opponent leave the game',
    'mobile.notSupported': 'Sorry, but currently we do not support any of mobile devices, please open this page on desktop'
}

export type EnLocale = keyof typeof map;
export default map;
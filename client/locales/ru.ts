const map = {
    'optionsModal.title': 'Отправьте ссылку своему другу',
    'scoreModal.title': 'Счет',
    'scoreModal.you': 'Вы',
    'scoreModal.opponent': 'Соперник',
    'scoreModal.disconnect': 'Отключиться',
    'toast.error.gameNotFound': 'Игра не найдена, была создана новая игра',
    'toast.error.tokenExpired': 'Действие токена истекло, создан новый и выполненно переподключение к игре',
    'toast.userConnected': 'Ваш соперник подключился к игре',
    'toast.userDisconnected': 'Ваш соперник отключился от игры',
    'mobile.notSupported': 'Извините, сейчас мы не поддерживаем мобильные устройства, пожалуйста откройте эту страницу на компьютере'
}

export type RuLocale = keyof typeof map;
export default map
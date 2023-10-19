import { WsException } from '@nestjs/websockets';

type WsExceptionType = 'BadRequest' | 'Unathorized' | 'Unknown';

export class WsTypeException extends WsException {
  readonly type: WsExceptionType;

  constructor(type: WsExceptionType, message: string | unknown) {
    const error = {
      type,
      message,
    };

    super(error);
    this.type = type;
  }
}

export class WsUnknownException extends WsTypeException {
  constructor(message: string | unknown) {
    super('Unknown', message);
  }
}
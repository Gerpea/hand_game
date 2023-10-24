import { HttpStatus } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";

type WsExceptionType = "BadRequest" | "Unathorized" | "Unknown";

export class WsTypeException extends WsException {
  readonly type: WsExceptionType;

  constructor(type: WsExceptionType, message: string | unknown, statusCode: number) {
    const error = {
      type,
      message,
      statusCode
    };
    super(error);
    this.type = type;
  }
}

export class WsBadRequestException extends WsTypeException {
  constructor(message: string) {
    super("BadRequest", message, HttpStatus.BAD_REQUEST);
  }
}

export class WsUnathorizedException extends WsTypeException {
  constructor(message: string) {
    super("Unathorized", message, HttpStatus.UNAUTHORIZED);
  }
}
export class WsUnknownException extends WsTypeException {
  constructor(message: string) {
    super("Unknown", message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

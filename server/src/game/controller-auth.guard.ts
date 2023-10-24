import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { RequestWithAuth } from "./types";

@Injectable()
export class ControllerAuthGuard implements CanActivate {
  private readonly logger = new Logger(ControllerAuthGuard.name);

  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: RequestWithAuth = context.switchToHttp().getRequest();

    this.logger.debug(`Checking for auth token on header`, request.headers["authorization"]);

    const accessToken = request.headers["authorization"];

    try {
      const payload = this.jwtService.verify(accessToken);
      request.userID = payload.sub;
      return true;
    } catch {
      throw new ForbiddenException("Invalid authorization token");
    }
  }
}

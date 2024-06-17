import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/user/user.service';
import { AuthService } from 'src/modules/auth/auth.service';


@Injectable()
export class IsAdmin implements CanActivate {
    constructor(
        private readonly UserService: UserService,
        private readonly AuthService: AuthService,
        private readonly JwtService: JwtService
    ) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    async validateRequest(request) {
        const token = await this.AuthService.decodeToken(request.headers.authorization);
        const userExist = await this.UserService.findOneById(token['id']);
        return true
        // if (userExist.type == UserType.ADMIN) {
        //     return true;
        // } else {
        //     throw new UnauthorizedException("You don't have permission");
        // }

    }
}

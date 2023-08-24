import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthUserId = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const decodedToken = request.user;
        if (!decodedToken) {
            return null;
        }
        return decodedToken['userId'];
    },
);

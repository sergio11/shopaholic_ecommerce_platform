import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { jwtConstants } from "./jwt.constants";
import { JwtStrategy } from "./jwt.strategy";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { JwtRolesGuard } from "./jwt-roles.guard";


@Module({
  imports: [ 
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '2d' },
    }),
  ],
  providers: [JwtStrategy, JwtService, JwtAuthGuard, JwtRolesGuard],
  exports: [JwtStrategy, JwtService, JwtAuthGuard, JwtRolesGuard]
})
export class JwtAuthModule {}
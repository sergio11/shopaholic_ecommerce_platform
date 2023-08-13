import { Global, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./jwt.constants";
import { JwtStrategy } from "./jwt.strategy";


@Global()
@Module({
  imports: [ 
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '2d' },
    }),
  ],
  providers: [JwtStrategy],
  exports: [JwtStrategy]
})
export class JwtAuthModule {}
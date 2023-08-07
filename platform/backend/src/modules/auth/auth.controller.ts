import { Body, Controller, Post, Res, Version } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpAuthDto } from './dto/signup-auth.dto';
import { SignInAuthDto } from './dto/signin-auth.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @ApiOperation({ summary: 'Allow us to register new user' })
    @Version('1.0')
    @Post('signup')
    register(@Body() user: SignUpAuthDto) {
        return this.authService.register(user);
    }
    
    @ApiOperation({ summary: 'Allow us to sign in session into the platform' })
    @Version('1.0')
    @Post('signin')
    login(@Body() loginData: SignInAuthDto) {
        return this.authService.login(loginData);
    }

}

import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @ApiOperation({ summary: 'Allow us to register new user' })
    @Post('register')
    register(@Body() user: RegisterAuthDto) {
        return this.authService.register(user);
    }
    
    @ApiOperation({ summary: 'Allow us to sign in session into the platform' })
    @Post('login')
    login(@Body() loginData: LoginAuthDto) {
        return this.authService.login(loginData);
    }

}

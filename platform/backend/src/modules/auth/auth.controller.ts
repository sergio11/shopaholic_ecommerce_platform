import { Body, Controller, Post, Version } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpAuthDto } from './dto/signup-auth.dto';
import { SignInAuthDto } from './dto/signin-auth.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @ApiOperation({ summary: 'Allow us to register new user' })
    @Version('1.0')
    @Post('signup')
    signup(@Body() signUpData: SignUpAuthDto) {
        return this.authService.signup(signUpData);
    }
    
    @ApiOperation({ summary: 'Allow us to sign in session into the platform' })
    @Version('1.0')
    @Post('signin')
    signin(@Body() signInData: SignInAuthDto) {
        return this.authService.signin(signInData);
    }

}

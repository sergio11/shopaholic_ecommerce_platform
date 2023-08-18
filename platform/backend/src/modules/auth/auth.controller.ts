import { Body, Controller, Post, Version } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpAuthDto } from './dto/signup-auth.dto';
import { SignInAuthDto } from './dto/signin-auth.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthResponseDto } from './dto/auth-response.dto';

/**
 * Controller for authentication-related endpoints.
 */
@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {

    /**
     * Constructor for the AuthController class.
     * @param {AuthService} authService - The authentication service.
     */
    constructor(private authService: AuthService) {}

    /**
     * Endpoint for user registration.
     * @param {SignUpAuthDto} signUpData - The data for user signup.
     * @returns {Promise<AuthResponseDto>} - The response from the signup operation.
     */
    @ApiOperation({ summary: 'Allow us to register new user' })
    @Version('1.0')
    @Post('signup')
    @ApiResponse({
        status: 200,
        description: 'Successfully registered and authenticated',
        type: AuthResponseDto,
    })
    async signup(@Body() signUpData: SignUpAuthDto): Promise<AuthResponseDto> {
        return this.authService.signup(signUpData);
    }
    
    /**
     * Endpoint for user signin.
     * @param {SignInAuthDto} signInData - The data for user signin.
     * @returns {Promise<AuthResponseDto>} - The response from the signin operation.
     */
    @ApiOperation({ summary: 'Allow us to sign in session into the platform' })
    @Version('1.0')
    @Post('signin')
    @ApiResponse({
        status: 200,
        description: 'Successfully authenticated',
        type: AuthResponseDto,
    })
    async signin(@Body() signInData: SignInAuthDto): Promise<AuthResponseDto> {
        return this.authService.signin(signInData);
    }
}

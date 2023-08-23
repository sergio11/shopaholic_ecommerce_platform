import { Body, Post, Version } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpAuthDto } from './dto/signup-auth.dto';
import { SignInAuthDto } from './dto/signin-auth.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ApiController } from 'src/core/decorator/default-api.decorator';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';

/**
 * Controller for authentication-related endpoints.
 */
@ApiController('auth')
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

  /**
   * Request password reset.
   * Generates a reset token and sends it via email.
   * @param {RequestResetPasswordDto} requestResetPasswordDto - Email of the user requesting password reset.
   * @returns {Promise<string>} - The response from the request reset password operation.
   */
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({
    status: 200,
    description: 'Password reset requested successfully',
  })
  @Post('request-reset-password')
  async requestResetPassword(
    @Body() requestResetPasswordDto: RequestResetPasswordDto,
  ): Promise<string> {
    return await this.authService.requestResetPassword(
      requestResetPasswordDto.email,
    );
  }

  /**
   * Reset user password.
   * @param {ResetPasswordDto} resetPasswordData - The data for resetting user password.
   * @returns {Promise<string>} - The response from the password reset operation.
   */
  @ApiOperation({ summary: 'Reset user password' })
  @Version('1.0')
  @Post('reset-password')
  @ApiResponse({
    status: 200,
    description: 'Password reset successful',
    type: AuthResponseDto,
  })
  async resetPassword(
    @Body() resetPasswordData: ResetPasswordDto,
  ): Promise<string> {
    return this.authService.resetPassword(resetPasswordData);
  }
}

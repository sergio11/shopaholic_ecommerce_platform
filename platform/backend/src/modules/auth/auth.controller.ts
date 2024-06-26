import { Body, Param, Post, Req, Version } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpAuthDto } from './dto/signup-auth.dto';
import { SignInAuthDto } from './dto/signin-auth.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ApiController } from 'src/core/decorator/default-api.decorator';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { AdminSignUpAuthDto } from './dto/admin-signup-auth.dto';
import { JwtRole } from './jwt/jwt-role';
import { Auth } from './decorator/auth.decorator';

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
  async signup(
    @Body() signUpData: SignUpAuthDto,
    @Req() request: Request,
  ): Promise<AuthResponseDto> {
    // If language is not specified, determine the default value based on the request headers
    if (signUpData.language === undefined) {
      signUpData.language = this.determineDefaultLanguage(request);
    }
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
   * Allow us to register new admin.
   * @param {AdminSignUpAuthDto} adminSignUpData - The data for admin signup.
   * @returns {Promise<AuthResponseDto>} - The response from the admin signup operation.
   */
  @ApiOperation({ summary: 'Allow us to register new admin' })
  @Version('1.0')
  @Post('admin/signup')
  @ApiResponse({
    status: 200,
    description: 'Successfully registered and authenticated as admin',
    type: AuthResponseDto,
  })
  async adminSignup(
    @Body() adminSignUpData: AdminSignUpAuthDto,
    @Req() request: Request,
  ): Promise<AuthResponseDto> {
    // If language is not specified, determine the default value based on the request headers
    if (adminSignUpData.language === undefined) {
      adminSignUpData.language = this.determineDefaultLanguage(request);
    }
    return this.authService.signupAdmin(adminSignUpData);
  }

  /**
   * Allow us to sign in as admin.
   * @param {SignInAuthDto} adminSignInData - The data for admin signin.
   * @returns {Promise<AuthResponseDto>} - The response from the admin signin operation.
   */
  @ApiOperation({ summary: 'Allow us to sign in as admin' })
  @Version('1.0')
  @Post('admin/signin')
  @ApiResponse({
    status: 200,
    description: 'Successfully authenticated as admin',
    type: AuthResponseDto,
  })
  async adminSignin(
    @Body() adminSignInData: SignInAuthDto,
  ): Promise<AuthResponseDto> {
    return this.authService.signinAdmin(adminSignInData);
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

  /**
   * Revoke tokens of a user.
   * @param {string} userId - The ID of the user to revoke tokens for.
   * @returns {Promise<string>} - A promise that resolves when the tokens are revoked.
   */
  @Auth(JwtRole.ADMIN)
  @Version('1.0')
  @Post('revoke-tokens/:userId')
  @ApiOperation({ summary: 'Revoke tokens of a user' })
  @ApiResponse({ status: 200, description: 'Tokens revoked successfully' })
  async revokeToken(@Param('userId') userId: string): Promise<string> {
    return await this.authService.revokeUserTokens(userId);
  }

  private determineDefaultLanguage(request: Request): string {
    // Access the request headers from the Request object
    const acceptLanguageHeader = request.headers['accept-language'];
    // Check if the Accept-Language header is present
    if (acceptLanguageHeader) {
      // Extract the language code 'es-ES' from the Accept-Language header
      const languageCode = acceptLanguageHeader.split(',')[0].split(';')[0].trim();
      // Return the extracted language code
      return languageCode;
    } else {
      // If Accept-Language header is not present or cannot be parsed, return a default value
      return 'en-US';
    }
  }
}

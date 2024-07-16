import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { VerificationDto } from './dto/verify.dto';
import { ForgotPasswordDto } from './dto/forgotPassword';
import { ResetPasswordDto } from './dto/resetPassword';
import { EmailService } from 'src/email/email.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private emailService: EmailService,
  ) {}

  /**
   * @description Signup controller
   * @route `/api/v1/auth/signup`
   * @access Public
   * @type POST
   */
  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() signUpDto: SignUpDto): Promise<any> {
    try {
      const { user, token } = await this.authService.signUp(signUpDto);

      const otp = await this.authService.generateAndSaveOTP(user.email);

      await this.emailService.sendEmail(
        user.email,
        `Welcome ${user.fullname}!`,
        otp,
      );

      user.otp = otp;

      return {
        status: HttpStatus.CREATED,
        success: true,
        token,
        user,
      };
    } catch (error) {
      // Rollback user creation on error
      if (error.statusCode === HttpStatus.CREATED && error.user) {
        await this.authService.deleteUser(error.user.id);
      }
      return {
        status: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: error.message || 'Something went wrong',
      };
    }
  }

  /**
   * @description Verify otp controller
   * @route `/api/v1/auth/verify`
   * @access Public
   * @type POST
   */
  @Post('/verify')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() verificationDto: VerificationDto): Promise<any> {
    const { otp } = verificationDto;
    try {
      const user = await this.authService.verifyOtp(otp);

      return {
        status: HttpStatus.OK,
        message: 'Otp verified successfully',
        success: true,
        user,
      };
    } catch (error) {
      return {
        status: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: error.message || 'Something went wrong',
      };
    }
  }

  /**
   * @description Login controller
   * @route `/api/v1/auth/login`
   * @access Public
   * @type POST
   */
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<any> {
    try {
      const { user, token } = await this.authService.login(loginDto);

      return {
        status: HttpStatus.OK,
        success: true,
        token,
        user,
      };
    } catch (error) {
      return {
        status: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: error.message || 'Something went wrong',
      };
    }
  }

  /**
   * @description Forgotpassword  controller
   * @route `/api/v1/auth/forgotpassword`
   * @access Public
   * @type POST
   */
  @Post('/forgotpassword')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotDto: ForgotPasswordDto): Promise<any> {
    const { email } = forgotDto;

    try {
      const user = await this.authService.forgotPassword(email);

      const otp = await this.authService.generateAndSaveOTP(email);

      await this.emailService.sendEmail(
        user.email,
        'Password Reset Request',
        otp,
      );

      return {
        status: HttpStatus.OK,
        message:
          'Password reset email sent successfully. Please check your email inbox.',
      };
    } catch (error) {
      return {
        status: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: error.message || 'Something went wrong',
      };
    }
  }

  /**
   * @description Resetpassword  controller
   * @route `/api/v1/auth/resetpassword`
   * @access Public
   * @type POST
   */
  @Post('/resetpassword')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<any> {
    try {
      await this.authService.resetPassword(resetPasswordDto);

      return {
        status: HttpStatus.OK,
        message: 'Password reset successful',
      };
    } catch (error) {
      return {
        status: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: error.message || 'Something went wrong',
      };
    }
  }
}

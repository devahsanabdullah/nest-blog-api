import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() SignUpDto: SignUpDto) {
    let newUser: any = await this.authService.signup(SignUpDto);

    var sent = await this.authService.sendEmailVerification(newUser.email);
    return sent;
  }

  @Post('verify/otp')
  async verifyEmail(@Body() otp: any) {
    return await this.authService.verifyEmail(otp.otp);
  }

  @Get('/resend-verification/:email')
  public async sendEmailVerification(@Param() params): Promise<any> {
    try {
      await this.authService.createEmailToken(params.email);
      let isEmailSent = await this.authService.sendEmailVerification(
        params.email,
      );
      if (isEmailSent) {
        return 'suucessful send ';
      } else {
        return 'failed to send';
      }
    } catch (error) {
      // return new ResponseError("LOGIN.ERROR.SEND_EMAIL", error);
    }
  }
  @Post('forgot-password/verify-otp')
  async forgotPassordOtp(@Body() otp: any) {
    return await this.authService.forgotPassordOtp(otp.otp);
  }
  @Post('/reset-password')
  async resetPassword(@Body() reset: any) {
    console.log(reset);
    if (reset.newPassword != reset.confirmPassword) {
      return 'password not matched';
    } else {
      return await this.authService.resetPassword(reset);
    }
  }

  @Post('/login')
  login(@Body() LoginDto: LoginDto) {
    return this.authService.login(LoginDto);
  }
}

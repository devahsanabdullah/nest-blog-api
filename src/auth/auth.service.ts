import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as nodemailer from 'nodemailer';
import { SignUpDto } from './dto/signup.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import {default as config} from '../config';
@Injectable()
export class AuthService {
 
constructor(@InjectRepository(User) private usersRepository:Repository<User>,
private jwtService:JwtService){}

  async signup(SignUpDto: SignUpDto) {
    const {name,email,password} = SignUpDto;
    const emailToken = (Math.floor(Math.random() * 9000000) + 1000000).toString();
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if(existingUser){
      throw new Error("Email already exists");
    }
    const hashedPassword= await bcrypt.hash(password,10);
  const user = await this.usersRepository.create({
    name,
    email,
    password: hashedPassword,
    emailToken,
    create_at: new Date(),
  });

  await this.usersRepository.save(user);
  // const token =this.jwtService.sign({id:user.id});
    return {...user}
  }
async login(loginDto:LoginDto){

  const {email,password} = loginDto;
  const user = await this.usersRepository.findOne({where:{email}});
  if(!user){
    throw new Error("User not found");
  }
  const isPasswordCorrect = await bcrypt.compare(password,user.password);
  if(!isPasswordCorrect){
    throw new Error("Password incorrect");
  }
 if(user.verify){

return {token:this.jwtService.sign({id:user.id}),user};
 }else{
    
throw new Error("Email not verified");
 }


}




async verifyEmail(token: string): Promise<boolean> {
  const emailVerify = await this.usersRepository.findOne({ where: { emailToken: token } });

  if (emailVerify && emailVerify.email) {
    emailVerify.verify = true;
    emailVerify.emailToken = null;
    // Save the updated user with the 'verify' field set to true
    const savedUser = await this.usersRepository.save(emailVerify);
    
    return !!savedUser;
  } else {
    // throw new HttpException('LOGIN.EMAIL_CODE_NOT_VALID', HttpStatus.FORBIDDEN);
  }
}

async forgotPassordOtp(token: string): Promise<any> {
  const emailVerify = await this.usersRepository.findOne({ where: { emailToken: token } });

  if (emailVerify && emailVerify.email) {
    emailVerify.verify = true;
    emailVerify.emailToken = null;
    emailVerify.newPasswordToken = (Math.floor(Math.random() * 9000000) + 1000000).toString();
    const savedUser = await this.usersRepository.save(emailVerify);
    
    return savedUser;
  } else {
    // throw new HttpException('LOGIN.EMAIL_CODE_NOT_VALID', HttpStatus.FORBIDDEN);
  }
}


async createEmailToken(email: string): Promise<any> {
  console.log(email);
  const user= await this.usersRepository.findOne({ where: { email} });
  const emailToken = (Math.floor(Math.random() * 9000000) + 1000000).toString();
  if (user) {
    user.emailToken = emailToken;
    user.verify = false;
    console.log(user);
    return await this.usersRepository.save(user);
  } else {
    // throw new HttpException('REGISTER.USER_NOT_REGISTERED', HttpStatus.FORBIDDEN);
    return 'not save'
  }

}

async resetPassword(reset: any): Promise<any> {
  const user= await this.usersRepository.findOne({ where: { newPasswordToken:reset.newPasswordToken} });

  const hashedPassword= await bcrypt.hash(reset.newPassword,10);


  if (user) {
    user.password = hashedPassword;
    user.newPasswordToken = null;
    console.log(user);
    return await this.usersRepository.save(user);
  } else {
    // throw new HttpException('REGISTER.USER_NOT_REGISTERED', HttpStatus.FORBIDDEN);
    return 'not save'
  }
}

async sendEmailVerification(email: string): Promise<boolean> {   
  var model =await this.usersRepository.findOne({ where: { email } });


  if(model && model.emailToken){
      let transporter = nodemailer.createTransport({
          host: config.mail.host,
          port: config.mail.port,
          secure: config.mail.secure, // true for 465, false for other ports
          auth: {
              user: config.mail.user,
              pass: config.mail.pass
          }
      });
  
      let mailOptions = {
        from: '"Company" <' + config.mail.user + '>', 
        to: email, // list of receivers (separated by ,)
        subject: 'Verify Email', 
        text: 'Verify Email', 
        html: 'Hi! <br><br> Thanks for your registration<br><br>'+" otp is :"+ model.emailToken 
        // '<a href='+ config.host.url + ':' + config.host.port +'/auth/email/verify/'+ model.emailToken + '>Click here to activate your account</a>'  // html body
      };
  
      var sent = await new Promise<boolean>(async function(resolve, reject) {
        return await transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {      
              console.log('Message sent: %s', error);
              return reject(false);
            }
            console.log('Message sent: %s', info.messageId);
            resolve(true);
        });      
      })

      return sent;
  } else {
    // throw new HttpException('REGISTER.USER_NOT_REGISTERED', HttpStatus.FORBIDDEN);
  }
}
}


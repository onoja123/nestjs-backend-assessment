import { HttpStatus, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/models/user.entity';
import { Repository } from 'typeorm';
import AppError from 'src/utils/appError';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/resetPassword';
import { InjectRepository } from '@nestjs/typeorm';
import { generateOTP } from 'src/utils/otpGenerator';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{
    user: User;
    token: string;
  }> {
    const { fullname, email, password } = signUpDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.create({
      fullname,
      email,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);
    const token = jwt.sign({ id: savedUser.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return { user: savedUser, token };
  }

  async login(loginDto: LoginDto): Promise<{
    user: User;
    token: string;
  }> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new AppError('User does not exist', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError(
        'Incorrect email or password.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = jwt.sign({ id: user.id }, 'secretKey', { expiresIn: '1h' });

    return { user, token };
  }

  async generateAndSaveOTP(email: string): Promise<string> {
    const otp = generateOTP();
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new AppError(`User ${email} not found`, HttpStatus.NOT_FOUND);
    }

    user.otp = otp;
    user.otpCreatedAt = new Date();
    await this.userRepository.save(user);

    return otp;
  }

  async verifyOtp(otp: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { otp } });

    if (!user) {
      throw new AppError(
        'Invalid OTP or OTP has expired',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const otpExpirationTime = new Date(
      user.otpCreatedAt.getTime() + 10 * 60 * 1000,
    );

    if (new Date() > otpExpirationTime) {
      throw new AppError('OTP has expired', HttpStatus.UNAUTHORIZED);
    }

    if (user.isActive) {
      throw new AppError('User is already verified', HttpStatus.UNAUTHORIZED);
    }

    user.isActive = true;
    user.otp = null;
    await this.userRepository.save(user);

    return user;
  }

  async forgotPassword(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new AppError(
        `There is no user with this email address`,
        HttpStatus.NOT_FOUND,
      );
    }

    // Generate and send OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpCreatedAt = new Date();
    await this.userRepository.save(user);

    return user;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { otp, newPassword, confirmPassword } = resetPasswordDto;

    // Check if the passwords match
    if (newPassword !== confirmPassword) {
      throw new AppError('Passwords do not match', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userRepository.findOne({ where: { otp } });

    if (!user) {
      throw new AppError('Invalid OTP', HttpStatus.UNAUTHORIZED);
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.otp = null;
    await this.userRepository.save(user);
  }

  async verifyToken(token: string): Promise<any> {
    try {
      const decoded = jwt.verify(token, 'secretKey');
      return decoded;
    } catch (error) {
      throw new AppError('Invalid or expired token', HttpStatus.UNAUTHORIZED);
    }
  }

  async deleteUser(userId: number): Promise<void> {
    await this.userRepository.delete(userId);
  }
}

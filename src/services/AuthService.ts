import { User } from '../models/User';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { EmailService } from './EmailService'; // Update path as necessary
import { Op } from 'sequelize';

const emailService = new EmailService();

export class AuthService {
  public async registerUser(email: string, password: string): Promise<User> {
    let user = await User.findOne({ where: { email } });
    if (user) throw new Error('User already exists');

    user = await User.create({ email, password, role: 'user' });

    // Generate OTP
    const otp = crypto.randomBytes(3).toString('hex');
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await user.save();
    return user;
  }

  public async verifyOtp(email: string, otp: string): Promise<User> {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error('Invalid email');

    // Check if otpExpires is defined and not expired
    if (!user.otpExpires || user.otpExpires < new Date()) {
      throw new Error('Invalid or expired OTP');
    }

    if (user.otp !== otp) {
      throw new Error('Invalid OTP');
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return user;
  }

  public async loginUser(email: string, password: string): Promise<User | null> {
    const user = await User.findOne({ where: { email } });
    if (!user) return null;

    const isMatch = await user.comparePassword(password);

    if (!isMatch) return null;

    return user;
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await User.findOne({ where: { email } });
    if (user) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
      user.resetPasswordToken = token;
      user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
      await user.save();
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
          
      // Create email content
      const html = `
        <h2>Password Reset</h2>
        <p>To reset your password, please click on the link below:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
      `;

      await emailService.sendEmail(user.email, 'Password Reset', html);
    }
  }

  public async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: new Date() },
      },
    });

    if (user) {
      user.password = await User.hashPassword(newPassword);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      return true;
    }
    return false;
  }

  public async updatePassword(userId: string, oldPassword: string, newPassword: string): Promise<boolean> {
    const user = await User.findByPk(userId);
    if (user && await user.comparePassword(oldPassword)) {
      user.password = await User.hashPassword(newPassword);
      await user.save();
      return true;
    }
    return false;
  }
}

import User, { IUser } from '../models/User';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { EmailService } from '../services/EmailService';
import bcrypt from 'bcryptjs';

const emailService = new EmailService();

export class AuthService {
  public async registerUser(email: string, password: string): Promise<IUser> {
    let user = await User.findOne({ email });
    if (user) throw new Error('User already exists');

    user = new User({ email, password });
    
    // Generate OTP
    const otp = crypto.randomBytes(3).toString('hex');
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await user.save();
    return user;
  }

  public async verifyOtp(email: string, otp: string): Promise<IUser> {
    const user = await User.findOne({ email });
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

  public async loginUser(email: string, password: string): Promise<IUser | null> {
    const user = await User.findOne({ email });
    console.log(user);
    
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch){
      console.log('hello');
      
      return null;
    } 
    
    console.log(user);
    
    return user;
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await User.findOne({ email });
    if (user) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
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
    console.log(token,newPassword);
    
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() },
    });
    console.log(user);
    

    if (user) {
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        return true;
    }
    return false;
}

  public async updatePassword(userId: string, oldPassword: string, newPassword: string): Promise<boolean> {
    const user = await User.findById(userId);
    console.log(user);
    
    if (user && await bcrypt.compare(oldPassword, user.password)) {
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        return true;
    }
    return false;
}
}

import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { EmailService } from '../services/EmailService';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { AuthRequest } from '../types/types';

const authService = new AuthService();
const emailService = new EmailService();

export class AuthController {
  public async register(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    try {
      const user = await authService.registerUser(email, password);
      // await emailService.sendOtpEmail(user.email, user.otp!);
      return res.status(200).json({ message: 'User registered successfully', user });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      return res.status(400).json({ msg: errorMessage });
    }
  }

  public async verifyOtp(req: Request, res: Response): Promise<Response> {
    const { email, otp } = req.body;

    try {
      const user = await authService.verifyOtp(email, otp);

      const payload = { id: user.id , role: user.role} ;
      const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });

      return res.status(200).json({ token });
    } catch (err) {

      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      return res.status(400).json({ msg: errorMessage });
    }
  }

  public async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    try {
      const user = await authService.loginUser(email, password);
      if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

      if (user.role === 'admin') {
        const otp = crypto.randomBytes(3).toString('hex');
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await user.save();
      await emailService.sendOtpEmail(user.email, otp);
      return res.status(200).json({ msg: 'OTP sent to email' });
    }
      const payload =  { id: user.id, role: user.role } ;
      const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });

      return res.status(200).json({ token });
    } catch (err) {
      return res.status(500).json({ msg: 'Server error' });
    }
  } 
  async forgotPassword(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    try {
        await authService.forgotPassword(email);
        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        res.status(400).json({ message: 'Failed to send reset email', error });
    }
}

async resetPassword(req: Request, res: Response): Promise<void> {
    const { newPassword } = req.body;
    const {token} = req.params;
    try {
        const success = await authService.resetPassword(token, newPassword);
        if (success) {
            res.status(200).json({ message: 'Password reset successfully' });
        } else {
            res.status(400).json({ message: 'Password reset failed' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error resetting password', error });
    }
}

async updatePassword(req: AuthRequest, res: Response): Promise<void> {
    const { oldPassword, newPassword } = req.body;
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
   }
    try {
        const success = await authService.updatePassword(req.user.id, oldPassword, newPassword);
        if (success) {
            res.status(200).json({ message: 'Password updated successfully' });
        } else {
            res.status(400).json({ message: 'Update failed' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error updating password', error });
    }
}
}

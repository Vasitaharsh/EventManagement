import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import  verifyTokenAndRole from '../middlewares/authMiddleware';

const router = Router();
const authController = new AuthController();

router.post('/register', authController.register);
router.post('/verify-otp', authController.verifyOtp);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.post('/update-password', verifyTokenAndRole(['user']), authController.updatePassword); // Middleware added here
// router.post('/logout', authenticateJWT, authController.logout)

export default router;

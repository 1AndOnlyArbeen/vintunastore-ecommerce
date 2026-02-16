import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.js';
import { registerUser, verifyEmailController, loginController, logoutController} from '../controllers/user.controller.js';

const userRouter = Router();

userRouter.post('/register', registerUser);
userRouter.post('/verify-email', verifyEmailController)
userRouter.post('/login', loginController)
userRouter.post('/logout',verifyJWT, logoutController)

export { userRouter };

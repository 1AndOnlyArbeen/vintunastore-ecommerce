import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.js';
import { upload } from '../middlewares/multer.middleware.js';
import { registerUser, verifyEmailController, loginController, logoutController, uploadAvatarController} from '../controllers/user.controller.js';

const userRouter = Router();

userRouter.post('/register', registerUser);
userRouter.post('/verify-email', verifyEmailController)
userRouter.post('/login', loginController)
userRouter.post('/logout',verifyJWT, logoutController)
userRouter.post('/upload-avatar', verifyJWT,upload.single ('avatar'), uploadAvatarController)

export { userRouter };

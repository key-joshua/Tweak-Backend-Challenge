import Router from 'express';
import busboyBodyParser from 'busboy-body-parser';
import authController from '../controllers/authController';
import { verifyLogin, verifySesion } from '../middlewares/verifyMiddlewares';
import { validateRegisterUser, validateUploadImage, validateLoginUser, validateResend } from '../middlewares/schemaMiddleware';

const busboyBodyParse = busboyBodyParser({ multi: true });
const router = Router();
router
  .get('/logout-user', verifySesion, authController.logoutUser)
  .get('/verify-user-account/:session', authController.verifyAccount)
  .post('/login-user', validateLoginUser, verifyLogin, authController.loginUser)
  .post('/resend-verification-link', validateResend, authController.sendVerificationLink)

  .post('/register-user', validateRegisterUser, authController.registerUser)
  .patch('/upload-image', verifySesion, busboyBodyParse, validateUploadImage, authController.uploadImage);

export default router;

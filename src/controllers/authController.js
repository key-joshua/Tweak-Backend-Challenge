import AWS from 'aws-sdk';
import Busboy from 'busboy';
import dotenv from 'dotenv';
import { INTERNAL_SERVER_ERROR, UNAUTHORIZED, BAD_REQUEST, CONFLICT, NOT_FOUND, CREATED, OK } from 'http-status';

import userHelper from '../helpers/userHelper';
import sessionHelper from '../helpers/sessionHelper';
import passwordHelper from '../helpers/passwordHelper';
import responseHelper from '../helpers/responseHelper';
import emailService from '../services/emailServices.js';

dotenv.config();

const s3bucket = new AWS.S3({
  Bucket: 'rivopets',
  accessKeyId: 'AKIAVPPMXB5IOX5XGBXV',
  secretAccessKey: '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',
});

const uploadToS3 = (file, user, res) => {
  try {
    s3bucket.createBucket(() => {
      const params = {
        Bucket: 'rivopets',
        Key: `${new Date().toGMTString()}-${file.name}`,
        Body: file.data,
      };

      s3bucket.upload(params, async (err, result) => {
        if (err) {
          responseHelper.handleSuccess(BAD_REQUEST, err);
          return responseHelper.response(res);
        }

        const data = await userHelper.updateProfile(user, result.Location);
        responseHelper.handleSuccess(OK, 'Image uploaded successfully', data);
        return responseHelper.response(res);
      });
    });

    return;
  } catch (error) {
    responseHelper.handleError(INTERNAL_SERVER_ERROR, error.toString());
    return responseHelper.response(res);
  }
};

/**
* This class contains all methods (functions) required to handle
* registerUser function.
* verifyAccount function.
* resentVerificationLink function.
* loginUser function.
*/
class AuthController {
  /**
     * Handle registerUser.
     * @param {object} req user request.
     * @param {object} res data response.
     * @returns {object} response.
     */
  static async registerUser(req, res) {
    try {
      const data = await userHelper.userExist('email', req.body.email);
      if (data) {
        responseHelper.handleError(CONFLICT, `User with ${req.body.email} already exist`);
        return responseHelper.response(res);
      }

      const user = await userHelper.saveUser(req.body);
      const session = await sessionHelper.generateSession(user.id, user.email, user.isVerified);

      const url = `${process.env.BACKEND_URL}/api/auth/verify-user-account/${session}`;
      emailService.sendVerifyAccountEmail(url, 'Sir/Madam', user.email);

      responseHelper.handleSuccess(CREATED, 'User account created successfully, Please Check email !! we have emailed you a link to verify your account.', user);
      return responseHelper.response(res);
    } catch (error) {
      responseHelper.handleError(INTERNAL_SERVER_ERROR, error.toString());
      return responseHelper.response(res);
    }
  }

  /**
     * Handle uploadImage.
     * @param {object} req user request.
     * @param {object} res data response.
     * @returns {object} response.
     */
  static async uploadImage(req, res) {
    if (!req.files) {
      responseHelper.handleError(BAD_REQUEST, `image is required`);
      return responseHelper.response(res);
    }

    if (req.files) {
      if (req.files.image) {
        const busboy = new Busboy({ headers: req.headers });
        busboy.on('finish', () => { req.files.image.map((element) => uploadToS3(element, req.user, res)); });
        req.pipe(busboy);
      }
    }
  }

  /**
     * Handle verifyAccount.
     * @param {object} req user request.
     * @param {object} res data response.
     * @returns {object} response.
     */
  static async verifyAccount(req, res) {
    try {
      const data = await sessionHelper.sessionExist('session', req.params.session);
      if (!data) {
        responseHelper.handleError(NOT_FOUND, 'Invalid/Expired verification link.');
        return responseHelper.response(res);
      }

      const user = await userHelper.verifyUserProfile(data.userId, true);
      await sessionHelper.destroySession('userId', data.userId);

      const url = `${process.env.BACKEND_URL}/api/auth/login`;
      await emailService.sendSuccessEmail(url, 'Sir/Madam', user.email);

      responseHelper.handleSuccess(OK, 'User account has been verified successfully. You can login now.');
      return responseHelper.response(res);
    } catch (error) {
      return res.status(500).json({
        status: 500,
        data: error.toString()
      });
    }
  }

  /**
     * Handle resentVerificationLink.
     * @param {object} req user request.
     * @param {object} res data response.
     * @returns {object} response.
     */
  static async sendVerificationLink(req, res) {
    try {
      const user = await userHelper.userExist('email', req.body.email);
      if (!user) {
        responseHelper.handleError(BAD_REQUEST, 'Email not found, Check well your email.');
        return responseHelper.response(res);
      }

      if (user.isVerified === true) {
        responseHelper.handleError(BAD_REQUEST, 'User account already verified.');
        return responseHelper.response(res);
      }

      const session = await sessionHelper.generateSession(user.id, user.email, user.isVerified);
      const url = `${process.env.BACKEND_URL}/api/auth/verify-user-account/${session}`;
      await emailService.sendVerifyAccountEmail(url, 'Sir/Madam', user.email);

      responseHelper.handleSuccess(OK, 'Email sent successfully, Please Check email !! we have emailed you a link to verify your account. If you dont get an email, Please click to resend a verification email.');
      return responseHelper.response(res);
    } catch (error) {
      responseHelper.handleError(INTERNAL_SERVER_ERROR, error.toString());
      return responseHelper.response(res);
    }
  }

  /**
     * Handle loginUser.
     * @param {object} req user request.
     * @param {object} res data response.
     * @returns {object} response.
     */
  static async loginUser(req, res) {
    try {
      const passwordExist = await passwordHelper.checkPassword(req.body.password, req.user.password);
      if (!passwordExist) {
        responseHelper.handleError(UNAUTHORIZED, 'Email or password incorrect');
        return responseHelper.response(res);
      }

      const data = { session: await sessionHelper.generateSession(req.user.id, req.user.email, req.user.isVerified), user: req.user };
      responseHelper.handleSuccess(OK, 'User logged in successfully', data);
      return responseHelper.response(res);
    } catch (error) {
      responseHelper.handleError(INTERNAL_SERVER_ERROR, error.toString());
      return responseHelper.response(res);
    }
  }

  /**
     * Handle logoutUser.
     * @param {object} req user request.
     * @param {object} res data response.
     * @returns {object} response.
     */
  static async logoutUser(req, res) {
    try {
      await sessionHelper.destroySession('userId', req.user.id);
      responseHelper.handleSuccess(OK, 'User logged out successfully');
      return responseHelper.response(res);
    } catch (error) {
      return res.status(500).json({
        status: 500,
        data: error.toString(),
      });
    }
  }
}

export default AuthController;

import Joi from 'joi';
import validateSchema from './validateSchema';

/**
   * Handle validateRegisterUser.
   * @param {object} req user request.
   * @param {object} res data response.
   * @param {object} next move.
   * @returns {object} response.
   */
const validateRegisterUser = (req, res, next) => {
  const dataSchema = Joi.object()
    .keys({
      userName: Joi.string().min(3).max(50).required()
        .messages({
          'any.required': 'userName is required',
          'string.empty': 'userName is not allowed to be empty',
        }),
      email: Joi.string().email().required().messages({
        'any.required': 'email is required',
        'string.empty': 'email is not allowed to be empty',
        'string.email': 'email must be a valid email',
      }),
      password: Joi.string().required()
        .regex(
          /^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,30}$/,
        )
        .messages({
          'any.required': 'password is a required field',
          'string.pattern.base': 'password must be at least 8 characters long with a number, Upper and lower cases, and a special character',
        }),
      confirmPassword: Joi.string().required().valid(Joi.ref('password')),
    })
    .options({ abortEarly: false });

  return validateSchema(dataSchema, req.body, res, next);
};

/**
   * Handle validateRegisterUser.
   * @param {object} req user request.
   * @param {object} res data response.
   * @param {object} next move.
   * @returns {object} response.
   */
const validateUploadImage = (req, res, next) => {
  const dataSchema = Joi.object()
    .keys({
      image: Joi.string()
        .messages({
          'any.required': 'image is required',
          'string.empty': 'image is not allowed to be empty',
        }),
    })
    .options({ abortEarly: false });

  return validateSchema(dataSchema, req.body, res, next);
};

/**
   * Handle validateLoginUser.
   * @param {object} req user request.
   * @param {object} res data response.
   * @param {object} next move.
   * @returns {object} response.
   */
const validateLoginUser = (req, res, next) => {
  const dataSchema = Joi.object()
    .keys({
      email: Joi.string().email().required().messages({
        'any.required': 'Email is required',
        'string.empty': 'Email is not allowed to be empty',
        'string.email': 'Email must be a valid email',
      }),
      password: Joi.string()
        .required()
        .regex(
          /^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,30}$/,
        )
        .messages({
          'any.required': 'password is a required field',
          'string.pattern.base': 'password must be at least 8 characters long with a number, Upper and lower cases, and a special character',
        }),
    })
    .options({ abortEarly: false });

  return validateSchema(dataSchema, req.body, res, next);
};

/**
   * Handle validateResend.
   * @param {object} req user request.
   * @param {object} res data response.
   * @param {object} next move.
   * @returns {object} response.
   */
const validateResend = (req, res, next) => {
  const dataSchema = Joi.object()
    .keys({
      email: Joi.string().email().required().messages({
        'any.required': 'email is required',
        'string.empty': 'email is not allowed to be empty',
        'string.email': 'email must be a valid email',
      }),
    })
    .options({ abortEarly: false });

  return validateSchema(dataSchema, req.body, res, next);
};

export { validateRegisterUser, validateUploadImage, validateLoginUser, validateResend };

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/config/validation.schema.ts
import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  MYSQL_HOST: Joi.string().required(),
  MYSQL_PORT: Joi.number().default(3306),
  MYSQL_USER: Joi.string().required(),
  MYSQL_PASSWORD: Joi.string().allow('').required(),
  MYSQL_DATABASE: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  RATE_LIMIT_WINDOW_MS: Joi.number().default(60000),
  RATE_LIMIT_MAX: Joi.number().default(100),
});

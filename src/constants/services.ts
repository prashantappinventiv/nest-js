export const AUTH_SERVICE = 'auth';
/**
 * @file response
 * @description defines response for entity
 */

import { HttpStatus } from '@nestjs/common';

export const RESPONSE_MSG = {
  SUCCESS: 'Success.',
  ERROR: 'Something went wrong.',
};

export const RESPONSE_DATA = {
  SUCCESS: {
    statusCode: HttpStatus.OK,
    message: RESPONSE_MSG.SUCCESS,
  },
  ERROR: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: RESPONSE_MSG.ERROR,
  },
};
export const LOGGER_NAME={
    LOGGER :'LOGGER'
}
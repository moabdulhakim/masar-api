import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { ApiResponseUtil } from '../utils/api-response.util';

@Catch(QueryFailedError)
export class PostgresErrorFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const errorCode = (exception as any).code;

    let message;
    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    switch (errorCode) {
      case '23505': // unique_violation
        status = HttpStatus.CONFLICT;
        message = 'Resource already exists';
        break;

      case '23503': // foreign_key_violation
        status = HttpStatus.BAD_REQUEST;
        message = 'Invalid reference';
        break;

      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Unexpected database error';
    }

    response.status(status).json(
      ApiResponseUtil.error(message)
    );
  }
}

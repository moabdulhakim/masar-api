// Written By AI

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponseUtil } from '../utils/api-response.util';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message: string;
    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else {
      const resp: any = exceptionResponse;
      const respMessage = resp?.message;
      if (Array.isArray(respMessage)) {
        message = respMessage.join(', ');
      } else if (typeof respMessage === 'string') {
        message = respMessage;
      } else if (respMessage != null) {
        message = String(respMessage);
      } else {
        message =
          typeof exceptionResponse === 'object'
            ? JSON.stringify(exceptionResponse)
            : String(exceptionResponse);
      }
    }

    response.status(status).json(
        ApiResponseUtil.error(message)
    );
  }
}

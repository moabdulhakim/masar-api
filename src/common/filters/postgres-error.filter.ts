import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class PostgresErrorFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const errorCode = (exception as any).code;
    const errorMessage = (exception as any).detail;
    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    console.log(exception);

    if (errorCode === '23505') {
      status = HttpStatus.CONFLICT;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    response.status(status).json({
      statusCode: status,
      message: errorMessage,
    });
  }
}

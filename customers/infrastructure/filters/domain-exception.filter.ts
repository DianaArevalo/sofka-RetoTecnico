import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { EmailAlreadyExistsException } from '../../domain/exceptions/email-already-exists.exception';
import { CustomerNotFoundException } from '../../domain/exceptions/customer.exceptions';

@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno del servidor';

    if (exception instanceof EmailAlreadyExistsException) {
      status = HttpStatus.CONFLICT;
      message = exception.message;
    } else if (exception instanceof CustomerNotFoundException) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse() as string;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      message,
      error: exception instanceof Error ? exception.name : 'Error',
    });
  }
}
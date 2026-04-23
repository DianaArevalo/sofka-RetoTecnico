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
    const err = exception as Error;

    if (err) {
      message = err.message;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse() as string;
    }

    response.status(status).json({
      statusCode: status,
      message,
      error: exception instanceof Error ? exception.name : 'Error',
    });
  }
}
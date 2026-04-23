import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { EmailAlreadyExistsException } from '../../customers/domain/exceptions/email-already-exists.exception';
import { CustomerNotFoundException } from '../../customers/domain/exceptions/customer.exceptions';
import { InvalidShipmentException } from '../../shipments/domain/exceptions/shipment.exceptions';
import { ShipmentNotFoundException, CustomerNotActiveException, CustomerNotFoundShipmentException } from '../../shipments/domain/exceptions/shipment.exceptions';

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
    } else if (exception instanceof InvalidShipmentException) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
    } else if (exception instanceof ShipmentNotFoundException) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
    } else if (exception instanceof CustomerNotActiveException) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
    } else if (exception instanceof CustomerNotFoundShipmentException) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
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
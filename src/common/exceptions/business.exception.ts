import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
  constructor(message: string, errors?: any) {
    super(
      {
        message,
        errors,
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}

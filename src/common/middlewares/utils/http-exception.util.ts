import { HttpException, HttpStatus } from '@nestjs/common';

export const createHttpException = (
  error: any,
  status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
) => {
  const errorMessage = error.response
    ? error.response.error
    : 'Internal Server Error';
  const message = error.message || 'An error occurred';
  const cause = error;

  throw new HttpException(
    {
      status,
      error: errorMessage,
      message,
    },
    status,
    { cause },
  );
};

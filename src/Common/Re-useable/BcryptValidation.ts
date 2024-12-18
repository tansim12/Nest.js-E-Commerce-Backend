import { HttpException, HttpStatus } from '@nestjs/common';
import bcrypt from 'bcrypt';

export const validateLoginPassword = async (
  plainTextPassword: string,
  hashPass: string,
): Promise<boolean> => {
  try {
    const result = await bcrypt.compare(plainTextPassword, hashPass);
    return result;
  } catch (err) {
    throw new HttpException(
      err.message || 'Something went wrong!',
      HttpStatus.BAD_REQUEST,
    );
  }
};

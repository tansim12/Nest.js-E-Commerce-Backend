export const successResponse = (
  result: any,
  statusCode: number,
  message: string,
): object => {
  return {
    success: true,
    statusCode: statusCode,
    message: message,
    data: result,
  };
};

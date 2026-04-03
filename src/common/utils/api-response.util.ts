// Written By AI

export class ApiResponseUtil {
  static success<T>(message?: string, data?: T) {
    return {
      success: true,
      message,
      data: data ?? null,
    };
  }

  static error(message?: string) {
    return {
      success: false,
      message,
    };
  }
}
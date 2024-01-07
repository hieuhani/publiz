import { JwtDecodeError } from "@fiboup/hono-firebase-auth";
import { ErrorHandler } from "hono";
import { AppEnv } from "../global";
import { ZodError } from "zod";
import { AppError } from "@publiz/core";

export const globalErrorHandler: ErrorHandler<AppEnv> = (err, c) => {
  if (err instanceof JwtDecodeError) {
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          message: err.message,
        },
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } else if (err instanceof AppError) {
    return makeAppErrorResponse(err);
  } else if (err instanceof ZodError) {
    console.error(err);

    return new Response(
      JSON.stringify({
        issues: err.issues,
        code: 400999,
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  console.error(err);

  return makeAppErrorResponse(new AppError(500999, err.message));
};

const makeAppErrorResponse = (error: AppError) =>
  new Response(
    JSON.stringify({
      message: error.message,
      code: error.code,
    }),
    {
      status: error.code / 1000,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

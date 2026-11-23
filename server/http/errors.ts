export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export function toErrorResponse(error: unknown) {
  if (error instanceof HttpError) {
    return {
      status: error.status,
      body: {
        error: error.message,
        ...(error.details ?? {}),
      },
    };
  }

  console.error("Unhandled API error", error);

  return {
    status: 500,
    body: { error: "Something went wrong." },
  };
}

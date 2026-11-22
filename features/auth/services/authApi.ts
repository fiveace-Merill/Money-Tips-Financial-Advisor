import type {
  AuthResponse,
  LoginInput,
  MeResponse,
  RegisterInput,
} from "@/types/auth";

export class AuthApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string>;

  constructor(
    message: string,
    status: number,
    fieldErrors?: Record<string, string>
  ) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

async function post<T>(path: string, body?: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api/auth/${path}`, {
      method: "POST",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new AuthApiError(
      "Unable to reach the server. Check your connection and try again.",
      0
    );
  }

  const data = (await response.json().catch(() => ({}))) as {
    error?: string;
    fieldErrors?: Record<string, string>;
  } & T;

  if (!response.ok) {
    throw new AuthApiError(
      data.error ?? "Something went wrong. Please try again.",
      response.status,
      data.fieldErrors
    );
  }

  return data;
}

export const authApi = {
  register: (input: RegisterInput) => post<AuthResponse>("register", input),
  login: (input: LoginInput) => post<AuthResponse>("login", input),
  logout: () => post<{ ok: boolean }>("logout"),
  me: async (): Promise<MeResponse> => {
    const response = await fetch("/api/auth/me", { cache: "no-store" });
    const data = (await response.json().catch(() => ({ user: null }))) as MeResponse;
    if (!response.ok) return { user: null };
    return data;
  },
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  initials: string;
};

export type AuthResponse = {
  user: AuthUser;
};

export type MeResponse = {
  user: AuthUser | null;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
};

export type AuthFieldErrors = Partial<
  Record<"name" | "email" | "password" | "confirmPassword" | "terms", string>
>;

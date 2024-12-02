export const LOGIN = "/login";
export const ROOT = "/";

export const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/api/auth/session",
  "/api/auth/providers",
  "/api/auth/signin/github",
  "/api/auth/callback/github",
];
export const PROTECTED_SUBROUTES = ["/courses", "/dashboard"];

import client from "./internal/httpClient";

export function login(
  email: string,
  password: string,
  captchaKey: string,
  captchaVal: string
) {
  return client.post("/api/v1/auth/login/password", {
    email: email,
    password: password,
    captcha_key: captchaKey,
    captcha_val: captchaVal,
  });
}

export function logout() {
  return client.post("/api/v1/auth/logout", {});
}

export interface LoginInfo {
  studentId: string;
  password: string;
}

export interface LoginCredentials extends LoginInfo {
  captcha: string;
}

export interface LoginTickets {
  lt: string;
  execution: string;
}

export interface RSAResponse {
  publicKey: string;
}

export type PhoneCodeCallback = () => Promise<string>;

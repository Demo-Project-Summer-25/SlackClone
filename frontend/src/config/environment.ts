export const config = {
  API_BASE_URL: 'http://localhost:8080/api',
  WS_BASE_URL: 'http://localhost:8080/ws',
  APP_NAME: 'SlackClone',
  VERSION: '1.0.0',
} as const;

export type Config = typeof config;
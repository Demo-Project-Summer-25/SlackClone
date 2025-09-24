export const config = {
  API_BASE_URL: 'https://pingandpong.up.railway.app',
  WS_BASE_URL: "wss://pingandpong.up.railway.app/ws",
  APP_NAME: 'SlackClone',
  VERSION: '1.0.0',
} as const;

export type Config = typeof config;
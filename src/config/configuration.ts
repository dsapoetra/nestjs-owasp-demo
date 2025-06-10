// src/config/configuration.ts
export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  mysql: {
    host: process.env.MYSQL_HOST ?? 'localhost',
    port: parseInt(process.env.MYSQL_PORT ?? '3306', 10),
    user: process.env.MYSQL_USER ?? 'root',
    password: process.env.MYSQL_PASSWORD ?? '',
    database: process.env.MYSQL_DATABASE ?? 'test',
  },
  jwtSecret: process.env.JWT_SECRET ?? 'default-secret',
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS ?? '60000', 10),
    max: parseInt(process.env.RATE_LIMIT_MAX ?? '100', 10),
  },
});

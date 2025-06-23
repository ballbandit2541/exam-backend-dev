import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// import { ConfigService } from '@nestjs/config';

// export const getTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
//   type: 'mysql',
//   host: configService.get('DB_HOST'),
//   port: parseInt(configService.get('DB_PORT', '3306')),
//   username: configService.get('DB_USERNAME'),
//   password: configService.get('DB_PASSWORD'),
//   database: configService.get('DB_DATABASE'),
//   autoLoadEntities: true,
//   synchronize: true,
// });
// database/config/typeorm.config.ts

export async function getMainDbConfig(): Promise<TypeOrmModuleOptions> {
  return {
    name: 'main', // important - specify connection name
    type: 'mysql' as const,
    host: process.env.MAIN_DB_HOST ?? 'localhost',
    port: +(process.env.MAIN_DB_PORT ?? '3306'),
    username: process.env.MAIN_DB_USER ?? 'exam-backend-user',
    password: process.env.MAIN_DB_PASS ?? 'exam-backend-password',
    database: process.env.MAIN_DB_NAME ?? 'exam-backend-db',
    autoLoadEntities: true,
    synchronize: true,
  };
}

export async function getLogDbConfig(): Promise<TypeOrmModuleOptions> {
  return {
    name: 'log', // important
    type: 'mysql' as const,
    host: process.env.LOG_DB_HOST ?? 'localhost',
    port: +(process.env.LOG_DB_PORT ?? '3306'),
    username: process.env.LOG_DB_USER ?? 'exam-backend-user',
    password: process.env.LOG_DB_PASS ?? 'exam-backend-password',
    database: process.env.LOG_DB_NAME ?? 'exam-backend-log',
    autoLoadEntities: true,
    synchronize: true,
  };
}

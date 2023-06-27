import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST || "localhost",
      port: parseInt(process.env.MYSQL_PORT) || 3306,
      username: process.env.MYSQL_USER || "dev",
      password: process.env.MYSQL_PASSWORD || "dev",
      database: process.env.MYSQL_DATABASE || "ecommerce_db",
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    RolesModule
  ],
})
export class AppModule {}

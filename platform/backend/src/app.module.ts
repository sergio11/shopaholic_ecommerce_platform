import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      replication: {
        master: {
        host: process.env.MYSQL_MASTER_HOST || "localhost",
        port: parseInt(process.env.MYSQL_MASTER_PORT) || 3306,
        username: process.env.MYSQL_MASTER_USER || "dreamsoftware",
        password: process.env.MYSQL_MASTER_PASSWORD || "dreamsoftware00",
        database: process.env.MYSQL_DATABASE || "ecommerce",
        },
        slaves: [{
          host: process.env.MYSQL_SLAVE_HOST || "localhost",
          port: parseInt(process.env.MYSQL_SLAVE_PORT) || 3307,
          username: process.env.MYSQL_MASTER_USER || "dreamsoftware",
          password: process.env.MYSQL_MASTER_PASSWORD || "dreamsoftware00",
          database: process.env.MYSQL_DATABASE || "ecommerce",
        }]
      },
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true
    }),
    UsersModule,
    AuthModule,
    RolesModule
  ],
})
export class AppModule {}

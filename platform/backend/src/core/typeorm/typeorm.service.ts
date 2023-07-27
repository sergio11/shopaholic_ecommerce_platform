import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      replication: {
        master: {
          host: "192.168.1.39",
          port: 3307,
          username: "dreamsoftware",
          password: "dreamsoftware00",
          database: "ecommerce"
        },
        slaves: [{
          host: "192.168.1.39",
          port: 3307,
          username: "dreamsoftware",
          password: "dreamsoftware00",
          database: "ecommerce"
        }]
      },
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true
    };
  }
}
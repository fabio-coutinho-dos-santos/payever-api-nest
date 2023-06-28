import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtMiddleware } from 'src/midlewares/JwtMiddleware';

@Module({
  imports:[
    ConfigModule.forRoot(),
    PassportModule, 
    UsersModule,
    JwtModule.register({
      privateKey: process.env.JWT_SECRET_KEY,
      signOptions:{expiresIn:'6000s'}
    })
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

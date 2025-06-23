import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async validateUser(userEmail: string, password: string) {
    const user = await this.userService.findByEmail(userEmail);
    // console.log('password',password);
    // console.log('user', user);
    if (user && await bcrypt.compare(password, user.userPassword)) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: User) {
    const basePayload = {
      sub: user.userId,
      email: user.userEmail,
      firstName: user.userFirstName,
      lastName: user.userLastName,
      role: user.userRole
    };
    const accessSecret = this.configService.get('JWT_SECRET');
    const accessTokenExpires = parseInt(this.configService.get('JWT_EXPIRES_IN') || '900', 10);
    const refreshSecret = this.configService.get('JWT_REFRESH_SECRET');
    const refreshTokenExpires = parseInt(this.configService.get('JWT_REFRESH_EXPIRES_IN') || '604800', 10);
    
    const accessToken = this.jwtService.sign(
      { ...basePayload, type: 'access' }, 
      { 
        expiresIn: accessTokenExpires,
        secret: accessSecret
      }
    );
    
    const refreshToken = this.jwtService.sign(
      { ...basePayload, type: 'refresh' }, 
      { 
        expiresIn: refreshTokenExpires,
        secret: refreshSecret
      }
    );

    await this.userService.updateRefreshToken(user.userId, refreshToken);

    return {
      accessToken,
      refreshToken,
      tokenType: "Bearer",
      expiresIn: accessTokenExpires
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const refreshSecret = this.configService.get('JWT_REFRESH_SECRET');
      const payload = this.jwtService.verify(refreshToken, {
        secret: refreshSecret
      });

      if (payload.type !== 'refresh') {
        throw new ForbiddenException('Invalid token type');
      }

      const user = await this.userService.findOne(payload.sub);
      if (!user) {
        throw new ForbiddenException('User not found');
      }
      
      if (!user.refreshToken) {
        throw new ForbiddenException('Refresh token not found');
      }
  
      const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!refreshTokenMatches) {
        throw new ForbiddenException('Invalid refresh token');
      }
      
      const basePayload = {
        sub: user.userId,
        email: user.userEmail,
        firstName: user.userFirstName,
        lastName: user.userLastName,
        role: user.userRole
      };
      
      const accessTokenExpires = parseInt(this.configService.get('JWT_EXPIRES_IN') || '900', 10);
      const accessSecret = this.configService.get('JWT_SECRET');
      const refreshTokenExpires = parseInt(this.configService.get('JWT_REFRESH_EXPIRES_IN') || '604800', 10);

      const newAccessToken = this.jwtService.sign(
        { ...basePayload, type: 'access' }, 
        { 
          expiresIn: accessTokenExpires,
          secret: accessSecret
        }
      );
      
      const newRefreshToken = this.jwtService.sign(
        { ...basePayload, type: 'refresh' }, 
        { 
          expiresIn: refreshTokenExpires,
          secret: refreshSecret
        }
      );
      
      await this.userService.updateRefreshToken(user.userId, newRefreshToken);
      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        tokenType: "Bearer",
        expiresIn: accessTokenExpires
      };
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new ForbiddenException('Token expired or invalid');
    }
  }

  async logout(userId: number) {
    await this.userService.updateRefreshToken(userId, null);
    return { message: 'Logged out successfully' };
  }

}

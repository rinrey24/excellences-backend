import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtServerice: JwtService, 
    ){}

    async login(username: string, password: string){
        const user = await this.usersService.findOneByUsername(username);
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new UnauthorizedException('Invalid credentials');

        const payload = {
            sub: user.id,
            username: user.username,
            role:user.role,
        };

        return {
            access_token: this.jwtServerice.sign(payload),
        }

    }
}

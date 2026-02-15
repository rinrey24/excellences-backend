import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { BusinessException } from 'src/common/exceptions/business.exception';
import { RESPONSE_MESSAGE } from 'src/common/constants/reponse-message';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
    ) {}

    async create(dto: CreateUserDto){
        const hashPassword = await bcrypt.hash(dto.password, 10)
        const user = this.userRepo.create({
            ...dto,
            password: hashPassword,
        });
        return this.userRepo.save(user);
    }

    async findAll(){
        const user = await this.userRepo.find({
            select: ['id','username','name','role','created_at']
        });
        return {
            message: RESPONSE_MESSAGE.USER.FETCHED,
            data: user,
        };
    }

    async findOne(id: string){
        const user = await this.userRepo.findOne({ where: { id}});
        if (!user) throw new BusinessException(RESPONSE_MESSAGE.USER.NOT_FOUND);
        return user;
    }
    
    async findOneByUsername(username: string){
        const user = await this.userRepo.findOne({ where: { username}});
        if (!user) throw new BusinessException(RESPONSE_MESSAGE.USER.NOT_FOUND);
        return user;
    }

    async update(id: string,dto: UpdateUserDto){
        const user = await this.findOne(id);
        Object.assign(user,dto);
        return this.userRepo.save(user);
    }
    

}

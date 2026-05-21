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

    async findAll(pageNum: number, limitNum: number, search?: string): Promise<[User[], number]> {
        const queryBuilder = this.userRepo.createQueryBuilder('user');
        if (search) {
            queryBuilder.where('user.username LIKE :search OR user.name LIKE :search', { search: `%${search}%` });
        }
        const users = await queryBuilder
            .select(['user.id', 'user.username', 'user.name', 'user.role', 'user.created_at'])
            .skip((pageNum - 1) * limitNum)
            .take(limitNum)
            .getMany();
        const total = await queryBuilder.getCount();
        return [users, total];
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
        await this.userRepo.update(id, dto);
        return user;
    }
    

}

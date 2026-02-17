import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RESPONSE_MESSAGE } from 'src/common/constants/reponse-message';
import { format } from 'path';
import { formatPaginatedResponse } from 'src/common/utils/pagination.util';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    async create(@Body() dto: CreateUserDto){
        const user = await this.usersService.create(dto);
        return {
            message: RESPONSE_MESSAGE.USER.CREATED,
            data: user,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '100',
        @Query('search') search: string = '',
    ) {
        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.min(1000, Math.max(1, parseInt(limit) || 100));
        const [users, total] = await this.usersService.findAll(pageNum, limitNum, search);
        return formatPaginatedResponse(
            RESPONSE_MESSAGE.USER.FETCHED,
            users,
            total,
            pageNum,
            limitNum,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Param('id') id: string) {
        const user = await this.usersService.findOne(id);
        return {
            message: RESPONSE_MESSAGE.USER.FETCHED,
            data: user,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get('username/:username')
    async findOneByUsername(@Param('username') username: string) {
        const user = await this.usersService.findOneByUsername(username);
        return {
            message: RESPONSE_MESSAGE.USER.FETCHED,
            data: user,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        const user = await this.usersService.update(id,dto);
        return {
            message: RESPONSE_MESSAGE.USER.UPDATED,
            data: user,
        };
    }
}

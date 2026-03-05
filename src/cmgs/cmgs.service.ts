import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RESPONSE_MESSAGE } from 'src/common/constants/reponse-message';
import { BusinessException } from 'src/common/exceptions/business.exception';
import { Repository } from 'typeorm';
import { CreateCmgDto } from './dto/create-cmg.dto';
import { UpdateCmgDto } from './dto/update-cmg.dto';
import { Cmg } from './entities/cmg.entity';

@Injectable()
export class CmgsService {
  constructor(
    @InjectRepository(Cmg)
    private cmgRepo: Repository<Cmg>,
  ) {}

  async create(createCmgDto: CreateCmgDto) {
    const getCodeCmg = await this.findOneByCodeCMG(createCmgDto.code_cmg);
      if (getCodeCmg){
        throw new BusinessException(RESPONSE_MESSAGE.CMG.EXIST);
      }
    const cmg = this.cmgRepo.create(createCmgDto);
    return this.cmgRepo.save(cmg);
  }

  async findAll(
    page: number,
    limit: number,
    search?: string,
  ): Promise<[Cmg[], number]> {
    const queryBuilder = this.cmgRepo.createQueryBuilder('cmg');

    if (search) {
      queryBuilder.where('cmg.description LIKE :search', {
        search: `%${search}%`,
      });
    }

    const cmgs = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
    const total = await queryBuilder.getCount();

    return [cmgs, total];
  }

  async findOne(id: string) {
    const cmg = await this.cmgRepo.findOneBy({ id });
    if (!cmg) {
      throw new BusinessException(RESPONSE_MESSAGE.CMG.NOT_FOUND);
    }
    return cmg;
  }

  async update(id: string, updateCmgDto: UpdateCmgDto) {
    const cmg = await this.findOne(id);
    if (cmg.code_cmg != updateCmgDto.code_cmg){
      const getCodeCmg = await this.findOneByCodeCMG(updateCmgDto.code_cmg as any);
        if (getCodeCmg){
          throw new BusinessException(RESPONSE_MESSAGE.CMG.EXIST);
        }
    }
    await this.cmgRepo.update(id, updateCmgDto);
    return cmg;
  }

  async remove(id: string) {
    const cmg = await this.findOne(id);
    await this.cmgRepo.delete(id);
    return cmg;
  }

    async findOneByCodeCMG(code_cmg: string) {
    const cmg = await this.cmgRepo.findOne({where: {code_cmg:code_cmg}});
    return cmg;
  }
}

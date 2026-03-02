import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RESPONSE_MESSAGE } from 'src/common/constants/reponse-message';
import { BusinessException } from 'src/common/exceptions/business.exception';
import { Repository } from 'typeorm';
import { CreateCaseTypeDto } from './dto/create-case-type.dto';
import { UpdateCaseTypeDto } from './dto/update-case-type.dto';
import { CaseType } from './entities/case-type.entity';

@Injectable()
export class CaseTypesService {
  constructor(
    @InjectRepository(CaseType)
    private caseTypeRepo: Repository<CaseType>,
  ) {}

  async create(createCaseTypeDto: CreateCaseTypeDto) {
    const caseType = this.caseTypeRepo.create(createCaseTypeDto);
    return this.caseTypeRepo.save(caseType);
  }

  async findAll(
    page: number,
    limit: number,
    search?: string,
  ): Promise<[CaseType[], number]> {
    const queryBuilder = this.caseTypeRepo.createQueryBuilder('case_type');

    if (search) {
      queryBuilder.where('case_type.description LIKE :search', {
        search: `%${search}%`,
      });
    }

    const caseTypes = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
    const total = await queryBuilder.getCount();

    return [caseTypes, total];
  }

  async findOne(id: string) {
    const caseType = await this.caseTypeRepo.findOneBy({ id });
    if (!caseType) {
      throw new BusinessException(RESPONSE_MESSAGE.CASE_TYPE.NOT_FOUND);
    }
    return caseType;
  }

  async update(id: string, updateCaseTypeDto: UpdateCaseTypeDto) {
    const caseType = await this.findOne(id);
    await this.caseTypeRepo.update(id, updateCaseTypeDto);
    return caseType;
  }

  async remove(id: string) {
    const caseType = await this.findOne(id);
    await this.caseTypeRepo.delete(id);
    return caseType;
  }
}

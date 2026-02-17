import { Injectable } from '@nestjs/common';
import { CreateDiagnosisDto } from './dto/create-diagnosis.dto';
import { UpdateDiagnosisDto } from './dto/update-diagnosis.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RESPONSE_MESSAGE } from 'src/common/constants/reponse-message';
import { Diagnosis } from './entities/diagnosis.entity';
import { BusinessException } from 'src/common/exceptions/business.exception';

@Injectable()
export class DiagnosesService {
  constructor(
    @InjectRepository(Diagnosis)
    private diagnoseRepo: Repository<Diagnosis>,
  ) {}

  async create(createDiagnosisDto: CreateDiagnosisDto) {
    const diagnosis = this.diagnoseRepo.create(createDiagnosisDto);
    return await this.diagnoseRepo.save(diagnosis);
   
  }

  async findAll(page: number, limit: number, search?: string): Promise<[Diagnosis[], number]> {
    const queryBuilder = this.diagnoseRepo.createQueryBuilder('diagnosis');
    if (search) {
      queryBuilder.where('diagnosis.description LIKE :search', { search: `%${search}%` });
    }
    const diagnoses = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
    const total = await queryBuilder.getCount();
    return [diagnoses, total];
  }

  async findOne(id: string) {
     const diagnosis = await this.diagnoseRepo.findOneBy({ id });
     if (!diagnosis) {
       throw new BusinessException(RESPONSE_MESSAGE.DIAGNOSE.NOT_FOUND);
     }
     return diagnosis;
  }

  async update(id: string, updateDiagnosisDto: UpdateDiagnosisDto) {
    const diagnosis = await this.findOne(id);
    await this.diagnoseRepo.update(id, updateDiagnosisDto);
    return diagnosis
  }

  async remove(id: string) {
    const diagnosis = await this.findOne(id);
    await this.diagnoseRepo.delete(id);
    return diagnosis;
  }
}

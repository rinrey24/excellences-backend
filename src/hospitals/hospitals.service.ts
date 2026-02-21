import { Injectable } from '@nestjs/common';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { Hospital } from './entities/hospital.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RESPONSE_MESSAGE } from 'src/common/constants/reponse-message';
import { BusinessException } from 'src/common/exceptions/business.exception';
@Injectable()
export class HospitalsService {
  constructor(
    @InjectRepository(Hospital)
    private hospitalRepo: Repository<Hospital>,
  ) {}

  async create(createHospitalDto: CreateHospitalDto) {
      const hospital = this.hospitalRepo.create(createHospitalDto);
      await this.findOne(hospital.code);
      await this.hospitalRepo.save(hospital);
      return hospital;
  }

  async findAll(page: number, limit: number, search?: string): Promise<[Hospital[], number]> {
    const queryBuilder = this.hospitalRepo.createQueryBuilder('hospital');
    if (search) {
      queryBuilder.where('hospital.name LIKE :search', { search: `%${search}%` });
    }
    const hospitals = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
    const total = await queryBuilder.getCount();
    return [hospitals, total];
  }

  async findOne(code: string) {
    const hospital = await this.hospitalRepo.findOneBy({ code });
    if (!hospital) {
      throw new BusinessException(RESPONSE_MESSAGE.HOSPITAL.NOT_FOUND);
    }
    return hospital;
  }

  async update(code: string, dto: UpdateHospitalDto) {
    const hospital = await this.findOne(code);
    await this.hospitalRepo.update(code, dto);
    return hospital;
  }
  
}

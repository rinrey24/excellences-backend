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
    await this.hospitalRepo.save(hospital);

    return {
      message: RESPONSE_MESSAGE.HOSPITAL.CREATED,
      data: hospital,
    };
  }

  async findAll() {
    const hospitals = await this.hospitalRepo.find();
    return {
      message: RESPONSE_MESSAGE.HOSPITAL.FETCHED,
      data: hospitals,
    };
  }

  /** 🔹 INTERNAL – RETURN ENTITY ONLY */
  async findOneEntity(id: number): Promise<Hospital> {
    const hospital = await this.hospitalRepo.findOne({
      where: { kode_rs: id },
    });

    if (!hospital) {
      throw new BusinessException(RESPONSE_MESSAGE.HOSPITAL.NOT_FOUND);
    }

    return hospital;
  }

  /** 🔹 API RESPONSE */
  async findOne(id: number) {
    const hospital = await this.findOneEntity(id);

    return {
      message: RESPONSE_MESSAGE.HOSPITAL.FETCHED,
      data: hospital,
    };
  }

  async update(id: number, dto: UpdateHospitalDto) {
    const hospital = await this.findOneEntity(id);

    Object.assign(hospital, dto);
    await this.hospitalRepo.save(hospital);

    return {
      message: RESPONSE_MESSAGE.HOSPITAL.UPDATED,
      data: hospital,
    };
  }
}

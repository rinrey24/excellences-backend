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
    try{
      const hospital = this.hospitalRepo.create(createHospitalDto);

      const getHospitalFromDB = await this.hospitalRepo.findOne({
        where: { kode_rs: hospital.kode_rs },
      });

      if (getHospitalFromDB){
          throw new BusinessException(RESPONSE_MESSAGE.HOSPITAL.EXIST);
      }

      await this.hospitalRepo.save(hospital);
  
      return {
        message: RESPONSE_MESSAGE.HOSPITAL.CREATED,
        data: hospital,
      };
    }catch (err){
      console.error(err)
      throw err
    }
    
  }

  async findAll() {
    const hospitals = await this.hospitalRepo.find();
    return {
      message: RESPONSE_MESSAGE.HOSPITAL.FETCHED,
      data: hospitals,
    };
  }

  /** 🔹 INTERNAL – RETURN ENTITY ONLY */
  async findOneEntity(kode_rs: string): Promise<Hospital> {
    const hospital = await this.hospitalRepo.findOne({
      where: { kode_rs: kode_rs },
    });

    if (!hospital) {
      throw new BusinessException(RESPONSE_MESSAGE.HOSPITAL.NOT_FOUND);
    }

    return hospital;
  }

  /** 🔹 API RESPONSE */
  async findOne(kode_rs: string) {
    const hospital = await this.findOneEntity(kode_rs);

    return {
      message: RESPONSE_MESSAGE.HOSPITAL.FETCHED,
      data: hospital,
    };
  }

  async update(kode_rs: string, dto: UpdateHospitalDto) {
    try{
    const hospital = await this.findOneEntity(kode_rs);

    Object.assign(hospital, dto);
    await this.hospitalRepo.save(hospital);

    return {
      message: RESPONSE_MESSAGE.HOSPITAL.UPDATED,
      data: hospital,
    };
    } catch (err){
      console.error(err)
      throw err
    }
  }
  
}

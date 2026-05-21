import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RESPONSE_MESSAGE } from 'src/common/constants/reponse-message';
import { BusinessException } from 'src/common/exceptions/business.exception';
import { Repository } from 'typeorm';
import { CreateDischargeDto } from './dto/create-discharge.dto';
import { UpdateDischargeDto } from './dto/update-discharge.dto';
import { Discharge } from './entities/discharge.entity';

@Injectable()
export class DischargesService {
  private readonly logger = new Logger(DischargesService.name);

  constructor(
    @InjectRepository(Discharge)
    private dischargeRepo: Repository<Discharge>,
  ) {}

  async create(createDischargeDto: CreateDischargeDto) {
    this.logger.log(
      `Creating discharge with status=${createDischargeDto.discharge_status}`,
    );
    const getDischarge = await this.findOneByCode(createDischargeDto.discharge_status);
    if (getDischarge){
      this.logger.warn(`Discharge already exist id=${getDischarge.discharge_status}`);
      throw new BusinessException(RESPONSE_MESSAGE.DISCHARGE.EXIST);
    }
    const discharge = this.dischargeRepo.create(createDischargeDto);
    return this.dischargeRepo.save(discharge);
  }

  async findAll(
    page: number,
    limit: number,
    search?: string,
  ): Promise<[Discharge[], number]> {
    this.logger.log(
      `Fetching discharges page=${page} limit=${limit} search=${search || ''}`,
    );
    const queryBuilder = this.dischargeRepo.createQueryBuilder('discharge');

    if (search) {
      queryBuilder.where('discharge.description LIKE :search', {
        search: `%${search}%`,
      });
    }

    const discharges = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
    const total = await queryBuilder.getCount();

    return [discharges, total];
  }

  async findOne(id: string) {
    this.logger.log(`Fetching discharge id=${id}`);
    const discharge = await this.dischargeRepo.findOneBy({ id });
    if (!discharge) {
      this.logger.warn(`Discharge not found id=${id}`);
      throw new BusinessException(RESPONSE_MESSAGE.DISCHARGE.NOT_FOUND);
    }
    return discharge;
  }

  async update(id: string, updateDischargeDto: UpdateDischargeDto) {
    this.logger.log(`Updating discharge id=${id}`);
    const discharge = await this.findOne(id);
    if (discharge.discharge_status != updateDischargeDto.discharge_status){
        const getDischarge = await this.findOneByCode(updateDischargeDto.discharge_status as any);
        if (getDischarge){
          this.logger.warn(`Discharge already exist id=${getDischarge.discharge_status}`);
          throw new BusinessException(RESPONSE_MESSAGE.DISCHARGE.EXIST);
        }
    }
    await this.dischargeRepo.update(id, updateDischargeDto);
    return discharge;
  }

  async remove(id: string) {
    this.logger.log(`Deleting discharge id=${id}`);
    const discharge = await this.findOne(id);
    await this.dischargeRepo.delete(id);
    return discharge;
  }

  async findOneByCode(code: string){
    const discharge = await this.dischargeRepo.findOne({where: {discharge_status:code}});
    return discharge;
  }
}

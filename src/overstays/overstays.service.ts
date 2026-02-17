import { Injectable } from '@nestjs/common';
import { CreateOverstayDto } from './dto/create-overstay.dto';
import { UpdateOverstayDto } from './dto/update-overstay.dto';
import { Overstay } from './entities/overstay.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RESPONSE_MESSAGE } from 'src/common/constants/reponse-message';
import { BusinessException } from 'src/common/exceptions/business.exception';

@Injectable()
export class OverstaysService {
  constructor(
    @InjectRepository(Overstay)
    private overstayRepo: Repository<Overstay>,
  ) {}

   async create(createOverstayDto: CreateOverstayDto) {
    const overstay = this.overstayRepo.create(createOverstayDto);
    return await this.overstayRepo.save(overstay);
  }

  async findAll(page: number, limit: number, search?: string): Promise<[Overstay[], number]> {
     const queryBuilder = this.overstayRepo.createQueryBuilder('overstay');
    if (search) {
      queryBuilder.where('overstay.description LIKE :search', { search: `%${search}%` });
    }
    const overstays = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
    const total = await queryBuilder.getCount();
    return [overstays, total];
  }

  async findOne(id: string) {
    const overstay = await this.overstayRepo.findOneBy({ id });
    if (!overstay) {
      throw new BusinessException(RESPONSE_MESSAGE.OVERSTAY.NOT_FOUND);
    }
    return overstay;
  }

  async update(id: string, updateOverstayDto: UpdateOverstayDto) {
    const overstay = await this.findOne(id);
    await this.overstayRepo.update(id, updateOverstayDto);
    return overstay;
  }
  
}

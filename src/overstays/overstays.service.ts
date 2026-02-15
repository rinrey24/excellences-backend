import { Injectable } from '@nestjs/common';
import { CreateOverstayDto } from './dto/create-overstay.dto';
import { UpdateOverstayDto } from './dto/update-overstay.dto';
import { Overstay } from './entities/overstay.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RESPONSE_MESSAGE } from 'src/common/constants/reponse-message';

@Injectable()
export class OverstaysService {
  constructor(
    @InjectRepository(Overstay)
    private overstayRepo: Repository<Overstay>,
  ) {}

   async create(createOverstayDto: CreateOverstayDto) {
    const overstay = this.overstayRepo.create(createOverstayDto);
    await this.overstayRepo.save(overstay);

    return {
      message: RESPONSE_MESSAGE.OVERSTAY.CREATED,
      data: overstay,
    };
  }

  async findAll() {
    const overstays = await this.overstayRepo.find();
    return {
      message: RESPONSE_MESSAGE.OVERSTAY.FETCHED,
      data: overstays,
    };
  }

  async findOne(id: string) {
    const overstay = await this.overstayRepo.findOneBy({ id });
    if (!overstay) {
      throw new Error(RESPONSE_MESSAGE.OVERSTAY.NOT_FOUND);
    }
    return {
      message: RESPONSE_MESSAGE.OVERSTAY.FETCHED,
      data: overstay,
    };
  }

  async update(id: string, updateOverstayDto: UpdateOverstayDto) {
    const overstay = await this.overstayRepo.preload({
      id,
      ...updateOverstayDto,
    });
    if (!overstay) {
      throw new Error(RESPONSE_MESSAGE.OVERSTAY.NOT_FOUND);
    }
    await this.overstayRepo.save(overstay);
    return {
      message: RESPONSE_MESSAGE.OVERSTAY.UPDATED,
      data: overstay,
    };
  }
  
}

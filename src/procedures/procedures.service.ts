import { Injectable, Logger } from '@nestjs/common';
import { CreateProcedureDto } from './dto/create-procedure.dto';
import { UpdateProcedureDto } from './dto/update-procedure.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Procedure } from './entities/procedure.entity';
import { Repository } from 'typeorm';
import { RESPONSE_MESSAGE } from 'src/common/constants/reponse-message';
import { BusinessException } from 'src/common/exceptions/business.exception';

@Injectable()
export class ProceduresService {
  private readonly logger = new Logger(ProceduresService.name);
  constructor(
    @InjectRepository(Procedure)
    private procedureRepo: Repository<Procedure>,
  ) {}
  async create(createProcedureDto: CreateProcedureDto) {
    const getProc = await this.findOneByCode(createProcedureDto.code);
    if (getProc){
      this.logger.warn(`PROCEDURE already exist id=${getProc.code}`);
      throw new BusinessException(RESPONSE_MESSAGE.PROCEDURE.EXIST);
    }
    const procedure = this.procedureRepo.create(createProcedureDto);
    return await this.procedureRepo.save(procedure);
  }

   async findAll(limit: number, page: number, search?: string) : Promise<[Procedure[], number]> {
    const queryBuilder = this.procedureRepo.createQueryBuilder('procedure');
    if (search) {
      queryBuilder.where('procedure.description LIKE :search', { search: `%${search}%` });
    }
    const procedures = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
    const total = await queryBuilder.getCount();
    return [procedures, total];

      
  }

  async findOne(id: string) {
    const procedure = await this.procedureRepo.findOneBy({ id });
        if (!procedure) {
      throw new BusinessException(RESPONSE_MESSAGE.PROCEDURE.NOT_FOUND);
    }
    return procedure;
  }

  async update(id: string, updateProcedureDto: UpdateProcedureDto) {
    const procedure = await this.findOne(id);
    if (procedure.code != updateProcedureDto.code){
    const getProc = await this.findOneByCode(updateProcedureDto.code as any);
      if (getProc){
        this.logger.warn(`PROCEDURE already exist id=${getProc.code}`);
        throw new BusinessException(RESPONSE_MESSAGE.PROCEDURE.EXIST);
      }
    }
    await this.procedureRepo.update(id, updateProcedureDto);
    return procedure;
  }

  async remove(id: string) {
    const procedure = await this.findOne(id);
    await this.procedureRepo.delete(id);
    return procedure;
  }

  async findOneByCode(code: string){
  const procedure = await this.procedureRepo.findOne({where: {code:code}});
  return procedure;
  }
}

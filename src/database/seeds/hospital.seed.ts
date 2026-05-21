import { DataSource } from 'typeorm';
import { Hospital } from '../../hospitals/entities/hospital.entity';

export async function seedHospitals(dataSource: DataSource) {
  const repo = dataSource.getRepository(Hospital);

  const data = [
    {
      code: '3173712',
      name: 'RSU Yarsi Jakarta',
      class: 'B',
      address: 'Jl. Letjen Suprapto No. 16, Cempaka Putih, Jakarta Pusat',
      phone: '021-4206674',
    },
  ];

  await repo.save(data);
  console.log('✅ Hospital seeded');
}

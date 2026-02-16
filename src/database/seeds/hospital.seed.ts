import { DataSource } from 'typeorm';
import { Hospital } from '../../hospitals/entities/hospital.entity';

export async function seedHospitals(dataSource: DataSource) {
  const repo = dataSource.getRepository(Hospital);

  const data = [
    {
      kode_rs: '3173712',
      name: 'RSU Yarsi Jakarta',
      kelas_rs: 'B',
      address: 'Jl. Letjen Suprapto No. 16, Cempaka Putih, Jakarta Pusat',
      phone: '021-4206674',
    },
  ];

  await repo.save(data);
  console.log('✅ Hospital seeded');
}

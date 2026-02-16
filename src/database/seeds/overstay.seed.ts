import { Overstay } from '../../overstays/entities/overstay.entity';
import { DataSource } from "typeorm";


export async function seedOverstay(dataSource: DataSource) {
    const repo = dataSource.getRepository(Overstay);

    const data = [
        {
            category: 'Rawat Jalan',
            value_start: 1,
            value_end: 2,
            description: 'OK',
            is_overstay: false,
            is_active: true
        },
        {
            category: 'Rawat Jalan',
            value_start: 3,
            value_end: 999,
            description: 'Overstay Rawat Jalan Lebih Dari 2 Hari',
            is_overstay: true,
            is_active: true
        },
        {
            category: 'Rawat Inap',
            value_start: 1,
            value_end: 15,
            description: 'OK',
            is_overstay: false,
            is_active: true
        },
        {
            category: 'Rawat Inap',
            value_start: 16,
            value_end: 999,
            description: 'Overstay Rawat Inap Lebih Dari 15 Hari',
            is_overstay: true,
            is_active: true
        }
    ];

    await repo.save(data);
    console.log('✅ Overstay seeded');
}
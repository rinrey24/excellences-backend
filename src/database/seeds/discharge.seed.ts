import { Discharge } from 'src/discharges/entities/discharge.entity';
import { DataSource } from "typeorm";


export async function seedDischarge(dataSource: DataSource) {
    const repo = dataSource.getRepository(Discharge);

    const data =[
        {
            discharge_status: "1",
            description: "Persetujuan Dokter",
            is_active: true
        },
        {
            discharge_status: "2",
            description: "Dirujuk",
            is_active: true
        },
        {
            discharge_status: "3",
            description: "Permintaan Sendiri",
            is_active: true
        },
        {
            discharge_status: "4",
            description: "Meninggal",
            is_active: true
        },
        {
            discharge_status: "5",
            description: "Lain-lain",
            is_active: true
        },
    ];

    await repo.save(data);
    console.log('✅ Discharge seeded');
}
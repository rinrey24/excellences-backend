import { CaseType } from 'src/case_types/entities/case-type.entity';
import { DataSource } from "typeorm";


export async function seedCaseType(dataSource: DataSource) {
    const repo = dataSource.getRepository(CaseType);

    const data =[
        {
            tipe_kasus: "1",
            description: "Prosedur Rawat Inap",
            is_active: true
        },
        {
            tipe_kasus: "2",
            description: "Prosedur Besar Rawat Jalan",
            is_active: true
        },
        {
            tipe_kasus: "3",
            description: "Prosedur Signifikan Rawat Jalan",
            is_active: true
        },
        {
            tipe_kasus: "4",
            description: "Rawat Inap Bukan Prosedur",
            is_active: true
        },
        {
            tipe_kasus: "5",
            description: "Rawat Jalan Bukan Prosedur",
            is_active: true
        },
        {
            tipe_kasus: "6",
            description: "Rawat Inap Kebidanan",
            is_active: true
        },
        {
            tipe_kasus: "7",
            description: "Rawat Jalan kebidanan",
            is_active: true
        },
        {
            tipe_kasus: "8",
            description: "Rawat Inap Neonatal",
            is_active: true
        },
        {
            tipe_kasus: "9",
            description: "Rawat Jalan Neonatal",
            is_active: true
        },
        {
            tipe_kasus: "0",
            description: "Error",
            is_active: true
        },
    ];

    await repo.save(data);
    console.log('✅ Tipe Kasus seeded');
}
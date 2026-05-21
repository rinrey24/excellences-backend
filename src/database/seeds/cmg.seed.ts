import { Cmg } from 'src/cmgs/entities/cmg.entity';
import { DataSource } from "typeorm";


export async function seedCmg(dataSource: DataSource) {
    const repo = dataSource.getRepository(Cmg);

    const data =[
    {
        code_cmg: "G",
        description: "Central nervous system Groups",
        is_active: true
    },
    {
        code_cmg: "H",
        description: "Eye and Adnexa Groups",
        is_active: true
    },
    {
        code_cmg: "U",
        description: "Ear, nose, mouth & throat Groups",
        is_active: true
    },
    {
        code_cmg: "J",
        description: "Respiratory system Groups",
        is_active: true
    },
    {
        code_cmg: "I",
        description: "Cardiovascular system Groups",
        is_active: true
    },
    {
        code_cmg: "K",
        description: "Digestive system Groups",
        is_active: true
    },
    {
        code_cmg: "B",
        description: "Hepatobiliary & pancreatic system Groups",
        is_active: true
    },
    {
        code_cmg: "M",
        description: "Musculoskeletal system & connective tissue Groups",
        is_active: true
    },
    {
        code_cmg: "L",
        description: "Skin, subcutaneous tissue & breast Groups",
        is_active: true
    },
    {
        code_cmg: "E",
        description: "Endocrine system, nutrition & metabolism Groups",
        is_active: true
    },
    {
        code_cmg: "N",
        description: "Nephro-urinary System Groups",
        is_active: true
    },
    {
        code_cmg: "V",
        description: "Male reproductive System Groups",
        is_active: true
    },
    {
        code_cmg: "W",
        description: "Female reproductive system Groups",
        is_active: true
    },
    {
        code_cmg: "O",
        description: "Deleiveries Groups",
        is_active: true
    },
    {
        code_cmg: "P",
        description: "Newborns & Neonates Groups",
        is_active: true
    },
    {
        code_cmg: "D",
        description: "Haemopoeitic & immune system Groups",
        is_active: true
    },
    {
        code_cmg: "C",
        description: "Myeloproliferative system & neoplasms Groups",
        is_active: true
    },
    {
        code_cmg: "A",
        description: "Infectious & parasitic diseases Groups",
        is_active: true
    },
    {
        code_cmg: "F",
        description: "Mental Health and Behavioral Groups",
        is_active: true
    },
    {
        code_cmg: "T",
        description: "Substance abuse & dependence Groups",
        is_active: true
    },
    {
        code_cmg: "S",
        description: "Injuries, poisonings & toxic effects of drugs Groups",
        is_active: true
    },
    {
        code_cmg: "Z",
        description: "Factors influencing health status & other contacts with health services Groups",
        is_active: true
    },
    {
        code_cmg: "Q",
        description: "Ambulatory Groups-Episodic",
        is_active: true
    },
    {
        code_cmg: "QP",
        description: "Ambulatory Groups-Package",
        is_active: true
    },
    {
        code_cmg: "SA",
        description: "Sub-Acute Groups",
        is_active: true
    },
    {
        code_cmg: "YY",
        description: "Special Procedures",
        is_active: true
    },
    {
        code_cmg: "DD",
        description: "Special Drugs",
        is_active: true
    },
    {
        code_cmg: "II",
        description: "Special Investigations I",
        is_active: true
    },
    {
        code_cmg: "IJ",
        description: "Special Investigations II",
        is_active: true
    },
    {
        code_cmg: "RR",
        description: "Special Prosthesis",
        is_active: true
    },
    {
        code_cmg: "CD",
        description: "Chronic Groups",
        is_active: true
    },
    {
        code_cmg: "X",
        description: "Errors CMGs",
        is_active: true
    }
    ];

    await repo.save(data);
    console.log('✅ CMG seeded');
}
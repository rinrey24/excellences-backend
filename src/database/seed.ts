import { AppDataSource } from "./data-source";
import { seedDiagnosis } from "./seeds/diagnosis.seed";
import { seedHospitals } from "./seeds/hospital.seed";
import { seedOverstay } from "./seeds/overstay.seed";
import { seedProcedures } from "./seeds/procedure.seed";

async function runSeeds() {
    await AppDataSource.initialize();

    await seedHospitals(AppDataSource);
    await seedOverstay(AppDataSource);
    await seedDiagnosis(AppDataSource);
    await seedProcedures(AppDataSource);

    await AppDataSource.destroy();
}

runSeeds().catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
});
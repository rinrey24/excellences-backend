import { AppDataSource } from "./data-source";
import { seedHospitals } from "./seeds/hospital.seed";
import { seedOverstay } from "./seeds/overstay.seed";

async function runSeeds() {
    await AppDataSource.initialize();

    await seedHospitals(AppDataSource);
    await seedOverstay(AppDataSource);

    await AppDataSource.destroy();
}

runSeeds().catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
});
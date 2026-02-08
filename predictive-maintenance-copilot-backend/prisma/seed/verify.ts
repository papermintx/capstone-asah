import { PrismaClient } from '@prisma/client';

// Use direct URL for seeding operations
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL,
    },
  },
});

async function verify() {
  console.log('🔍 Verifying seeded data...\n');

  // Count machines
  const machineCount = await prisma.machine.count();
  const machinesByType = await prisma.machine.groupBy({
    by: ['type'],
    _count: true,
  });

  console.log('🏭 MACHINES:');
  console.log(`  Total: ${machineCount}`);
  machinesByType.forEach((group) => {
    console.log(`  Type ${group.type}: ${group._count}`);
  });

  // Count sensor data
  const sensorCount = await prisma.sensorData.count();
  console.log(`\n📊 SENSOR READINGS:`);
  console.log(`  Total: ${sensorCount}`);

  // Sample data
  console.log(`\n📋 SAMPLE DATA:\n`);

  const sampleMachine = await prisma.machine.findFirst({
    include: {
      sensorReadings: {
        take: 3,
        orderBy: { timestamp: 'desc' },
      },
    },
  });

  if (sampleMachine) {
    console.log('  Machine:');
    console.log(`    - ID: ${sampleMachine.id}`);
    console.log(`    - Product ID: ${sampleMachine.productId}`);
    console.log(`    - Type: ${sampleMachine.type}`);
    console.log(`    - Name: ${sampleMachine.name}`);
    console.log(`    - Status: ${sampleMachine.status}`);
    console.log(`\n  Latest Sensor Readings (3):`);

    sampleMachine.sensorReadings.forEach((reading, idx) => {
      console.log(
        `    ${idx + 1}. UDI: ${reading.udi} | Temp: ${reading.airTemp}K | Speed: ${reading.rotationalSpeed}rpm | Torque: ${reading.torque}Nm`,
      );
    });
  }

  // Statistics
  const avgStats = await prisma.sensorData.aggregate({
    _avg: {
      airTemp: true,
      processTemp: true,
      rotationalSpeed: true,
      torque: true,
      toolWear: true,
    },
  });

  console.log(`\n📈 SENSOR DATA STATISTICS:`);
  console.log(`  Avg Air Temp: ${avgStats._avg.airTemp?.toFixed(2)}K`);
  console.log(`  Avg Process Temp: ${avgStats._avg.processTemp?.toFixed(2)}K`);
  console.log(
    `  Avg Rotational Speed: ${avgStats._avg.rotationalSpeed?.toFixed(0)}rpm`,
  );
  console.log(`  Avg Torque: ${avgStats._avg.torque?.toFixed(2)}Nm`);
  console.log(`  Avg Tool Wear: ${avgStats._avg.toolWear?.toFixed(0)} min`);

  console.log('\n✅ Verification complete!');
}

verify()
  .catch((e) => {
    console.error('❌ Error during verification:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

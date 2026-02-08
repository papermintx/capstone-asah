/**
 * Database Seeder for Predictive Maintenance Application
 *
 * This script seeds the database with machine and sensor data from CSV file.
 *
 * CONFIGURATION:
 * - MAX_MACHINES: Set the number of machines to seed (line ~75)
 *   Example: MAX_MACHINES = 4 will seed only 4 machines
 *   Example: MAX_MACHINES = 100 will seed 100 machines
 *   Set to a large number (e.g., 99999) to seed all machines from CSV
 *
 * USAGE:
 * npm run prisma:seed
 */

import { PrismaClient, MachineType, MachineStatus } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

// Use direct URL for seeding operations
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL,
    },
  },
});

interface CSVRow {
  UDI: number;
  'Product ID': string;
  Type: MachineType;
  'Air temperature [K]': number;
  'Process temperature [K]': number;
  'Rotational speed [rpm]': number;
  'Torque [Nm]': number;
  'Tool wear [min]': number;
  Target: number;
  'Failure Type': string;
}

function parseCSV(filePath: string): CSVRow[] {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContent.split('\n');
  const headers = lines[0].split(',');

  const data: CSVRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = line.split(',');
    if (values.length !== headers.length) continue;

    data.push({
      UDI: parseInt(values[0]),
      'Product ID': values[1].trim(),
      Type: values[2].trim() as MachineType,
      'Air temperature [K]': parseFloat(values[3]),
      'Process temperature [K]': parseFloat(values[4]),
      'Rotational speed [rpm]': parseInt(values[5]),
      'Torque [Nm]': parseFloat(values[6]),
      'Tool wear [min]': parseInt(values[7]),
      Target: parseInt(values[8]),
      'Failure Type': values[9],
    });
  }

  return data;
}

async function main() {
  console.log('🌱 Starting seed...');

  // Path ke CSV file
  const csvPath = path.join(
    __dirname,
    '..',
    '..',
    'predictive_maintenance.csv',
  );
  console.log('📂 Reading CSV file from:', csvPath);

  // Parse CSV
  const csvData = parseCSV(csvPath);
  console.log(`📊 Found ${csvData.length} rows in CSV`);

  // Extract unique machines
  const uniqueMachines = new Map<
    string,
    { type: MachineType; productId: string }
  >();

  // ⚙️ KONFIGURASI: Ubah angka ini untuk menentukan jumlah mesin
  const MAX_MACHINES = 4; // Hanya ambil 4 mesin pertama

  csvData.forEach((row) => {
    if (
      !uniqueMachines.has(row['Product ID']) &&
      uniqueMachines.size < MAX_MACHINES
    ) {
      uniqueMachines.set(row['Product ID'], {
        productId: row['Product ID'],
        type: row.Type,
      });
    }
  });

  console.log(
    `🏭 Found ${uniqueMachines.size} unique machines (limited to ${MAX_MACHINES})`,
  );

  // Clear existing data (optional - hapus jika tidak ingin menghapus data lama)
  console.log('🗑️  Cleaning existing data...');
  await prisma.sensorData.deleteMany({});
  await prisma.machine.deleteMany({});

  // Insert Machines
  console.log('🏭 Inserting machines...');
  const machineMap = new Map<string, string>(); // productId -> machineId

  let machineCount = 0;
  for (const [productId, machineData] of uniqueMachines) {
    const machine = await prisma.machine.create({
      data: {
        productId: productId,
        type: machineData.type,
        name: `Machine ${productId}`,
        description: `${machineData.type === 'L' ? 'Low' : machineData.type === 'M' ? 'Medium' : 'High'} quality variant machine`,
        location: `Factory Floor ${Math.floor(Math.random() * 5) + 1}`,
        installationDate: new Date(
          2023,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1,
        ),
        lastMaintenanceDate: new Date(
          2024,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1,
        ),
        status: MachineStatus.operational,
      },
    });

    machineMap.set(productId, machine.id);
    machineCount++;

    if (machineCount % 50 === 0) {
      console.log(
        `  ✓ Inserted ${machineCount}/${uniqueMachines.size} machines`,
      );
    }
  }

  console.log(`✅ Inserted ${machineCount} machines`);

  // Filter CSV data to only include sensors for selected machines
  const filteredCsvData = csvData.filter((row) =>
    machineMap.has(row['Product ID']),
  );
  console.log(
    `📊 Filtered ${filteredCsvData.length} sensor readings for ${machineCount} machines`,
  );

  // Insert Sensor Data in batches
  console.log('📊 Inserting sensor data...');
  const batchSize = 1000;
  let sensorCount = 0;

  for (let i = 0; i < filteredCsvData.length; i += batchSize) {
    const batch = filteredCsvData.slice(i, i + batchSize);

    const sensorDataToInsert = batch
      .map((row) => {
        const machineId = machineMap.get(row['Product ID']);
        if (!machineId) {
          console.warn(
            `⚠️  Machine not found for Product ID: ${row['Product ID']}`,
          );
          return null;
        }

        return {
          udi: row.UDI,
          machineId: machineId,
          productId: row['Product ID'],
          timestamp: new Date(2024, 0, 1 + Math.floor(row.UDI / 100)), // Generate timestamp based on UDI
          airTemp: row['Air temperature [K]'],
          processTemp: row['Process temperature [K]'],
          rotationalSpeed: row['Rotational speed [rpm]'],
          torque: row['Torque [Nm]'],
          toolWear: row['Tool wear [min]'],
        };
      })
      .filter((data) => data !== null);

    await prisma.sensorData.createMany({
      data: sensorDataToInsert as any[],
      skipDuplicates: true,
    });

    sensorCount += sensorDataToInsert.length;

    if (sensorCount % 5000 === 0) {
      console.log(
        `  ✓ Inserted ${sensorCount}/${filteredCsvData.length} sensor readings`,
      );
    }
  }

  console.log(`✅ Inserted ${sensorCount} sensor readings`);
  console.log('✨ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

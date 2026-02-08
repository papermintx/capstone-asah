import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import {
  CreateSensorReadingDto,
  QuerySensorReadingsDto,
  BatchCreateSensorReadingsDto,
} from './dto/sensor.dto';
import { SensorData, Prisma } from '@prisma/client';

@Injectable()
export class SensorsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createSensorReadingDto: CreateSensorReadingDto,
  ): Promise<SensorData> {
    // Verify machine exists
    const machine = await this.prisma.machine.findUnique({
      where: { id: createSensorReadingDto.machineId },
    });

    if (!machine) {
      throw new NotFoundException('Machine not found');
    }

    return this.prisma.sensorData.create({
      data: {
        ...createSensorReadingDto,
        timestamp: createSensorReadingDto.timestamp
          ? new Date(createSensorReadingDto.timestamp)
          : new Date(),
      },
    });
  }

  async createBatch(batchCreateDto: BatchCreateSensorReadingsDto) {
    const { readings } = batchCreateDto;

    // Verify all machines exist
    const machineIds = [...new Set(readings.map((r) => r.machineId))];
    const machines = await this.prisma.machine.findMany({
      where: { id: { in: machineIds } },
    });

    if (machines.length !== machineIds.length) {
      throw new BadRequestException('One or more machines not found');
    }

    // Create all sensor readings
    const created = await this.prisma.sensorData.createMany({
      data: readings.map((reading) => ({
        ...reading,
        timestamp: reading.timestamp ? new Date(reading.timestamp) : new Date(),
      })),
    });

    return {
      message: `${created.count} sensor readings created successfully`,
      count: created.count,
    };
  }

  async findAll(query: QuerySensorReadingsDto) {
    const { machineId, startDate, endDate, limit = 100, offset = 0 } = query;

    const where: Prisma.SensorDataWhereInput = {};

    if (machineId) {
      where.machineId = machineId;
    }

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) {
        where.timestamp.gte = new Date(startDate);
      }
      if (endDate) {
        where.timestamp.lte = new Date(endDate);
      }
    }

    const total = await this.prisma.sensorData.count({ where });

    const readings = await this.prisma.sensorData.findMany({
      where,
      take: limit,
      skip: offset,
      include: {
        machine: {
          select: {
            id: true,
            productId: true,
            name: true,
            type: true,
          },
        },
      },
      orderBy: { timestamp: 'desc' },
    });

    return {
      data: readings,
      meta: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    };
  }

  async findOne(udi: number): Promise<SensorData> {
    const reading = await this.prisma.sensorData.findUnique({
      where: { udi },
      include: {
        machine: true,
      },
    });

    if (!reading) {
      throw new NotFoundException('Sensor reading not found');
    }

    return reading;
  }

  async getStatistics(machineId: string) {
    // Verify machine exists
    const machine = await this.prisma.machine.findUnique({
      where: { id: machineId },
    });

    if (!machine) {
      throw new NotFoundException('Machine not found');
    }

    const readings = await this.prisma.sensorData.findMany({
      where: { machineId },
      orderBy: { timestamp: 'desc' },
      take: 100, // Last 100 readings for stats
    });

    if (readings.length === 0) {
      return {
        machineId,
        count: 0,
        statistics: null,
      };
    }

    // Calculate statistics
    const stats = {
      airTemp: this.calculateStats(readings.map((r) => r.airTemp)),
      processTemp: this.calculateStats(readings.map((r) => r.processTemp)),
      rotationalSpeed: this.calculateStats(
        readings.map((r) => r.rotationalSpeed),
      ),
      torque: this.calculateStats(readings.map((r) => r.torque)),
      toolWear: this.calculateStats(readings.map((r) => r.toolWear)),
    };

    return {
      machineId,
      count: readings.length,
      statistics: stats,
      latestReading: readings[0],
    };
  }

  async remove(udi: number): Promise<{ message: string }> {
    await this.findOne(udi);

    await this.prisma.sensorData.delete({
      where: { udi },
    });

    return { message: 'Sensor reading deleted successfully' };
  }

  private calculateStats(values: number[]) {
    if (values.length === 0) return null;

    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((acc, val) => acc + val, 0);
    const avg = sum / values.length;

    return {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: parseFloat(avg.toFixed(2)),
      median: sorted[Math.floor(sorted.length / 2)],
    };
  }
}

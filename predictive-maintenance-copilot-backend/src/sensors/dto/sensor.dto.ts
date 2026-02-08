import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Create Sensor Reading Schema
export const createSensorReadingSchema = z.object({
  machineId: z.uuid('Invalid machine ID'),
  productId: z.string().optional(),
  airTemp: z.number().min(-50).max(100),
  processTemp: z.number().min(-50).max(500),
  rotationalSpeed: z.number().min(0).max(10000),
  torque: z.number().min(0).max(1000),
  toolWear: z.number().int().min(0).max(1000),
  timestamp: z.iso.datetime().optional(),
});

export class CreateSensorReadingDto extends createZodDto(
  createSensorReadingSchema,
) {}

// Query Sensor Readings Schema
export const querySensorReadingsSchema = z.object({
  machineId: z.uuid().optional(),
  startDate: z.iso.datetime().optional(),
  endDate: z.iso.datetime().optional(),
  limit: z
    .string()
    .transform((val) => Math.min(Math.max(parseInt(val) || 100, 1), 1000))
    .optional(),
  offset: z
    .string()
    .transform((val) => Math.max(parseInt(val) || 0, 0))
    .optional(),
});

export class QuerySensorReadingsDto extends createZodDto(
  querySensorReadingsSchema,
) {}

// Batch Create Schema
export const batchCreateSensorReadingsSchema = z.object({
  readings: z.array(createSensorReadingSchema).min(1).max(100),
});

export class BatchCreateSensorReadingsDto extends createZodDto(
  batchCreateSensorReadingsSchema,
) {}

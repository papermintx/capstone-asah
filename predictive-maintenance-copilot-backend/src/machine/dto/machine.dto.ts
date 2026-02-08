import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { MachineStatus, MachineType } from '@prisma/client';

// Create Machine Schema
export const createMachineSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  type: z.enum(MachineType),
  name: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  installationDate: z.string().datetime().optional(),
  lastMaintenanceDate: z.string().datetime().optional(),
  status: z.enum(MachineStatus).default('operational'),
});

export class CreateMachineDto extends createZodDto(createMachineSchema) {}

// Update Machine Schema (partial)
export const updateMachineSchema = z.object({
  productId: z.string().optional(),
  type: z.enum(MachineType).optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  installationDate: z.iso.datetime().optional(),
  lastMaintenanceDate: z.iso.datetime().optional(),
  status: z.enum(MachineStatus).optional(),
});

export class UpdateMachineDto extends createZodDto(updateMachineSchema) {}

// Query Machines Schema
export const queryMachinesSchema = z.object({
  search: z.string().optional(),
  type: z.enum(MachineType).optional(),
  status: z.enum(MachineStatus).optional(),
  location: z.string().optional(),
  includeStats: z
    .string()
    .transform((val) => val === 'true')
    .optional(),
  limit: z
    .string()
    .transform((val) => Math.min(Math.max(parseInt(val) || 50, 1), 200))
    .optional(),
  offset: z
    .string()
    .transform((val) => Math.max(parseInt(val) || 0, 0))
    .optional(),
});

export class QueryMachinesDto extends createZodDto(queryMachinesSchema) {}

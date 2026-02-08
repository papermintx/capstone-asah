import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findBySupabaseId(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async createFromSupabase(data: {
    id: string;
    email: string;
    fullName?: string;
  }) {
    return this.prisma.user.create({
      data: {
        id: data.id,
        email: data.email,
        fullName: data.fullName,
        role: UserRole.operator, // Default role
        isActive: true,
      },
    });
  }

  async updateUser(
    id: string,
    data: { fullName?: string; email?: string; role?: UserRole },
  ) {
    const updateData: any = {};

    if (data.fullName !== undefined) {
      updateData.fullName = data.fullName;
    }

    if (data.email !== undefined) {
      updateData.email = data.email;
    }

    if (data.role !== undefined) {
      updateData.role = data.role;
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  async deactivateUser(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async activateUser(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { isActive: true },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Find or create user with Supabase ID sync
   * Uses transaction to prevent race conditions
   * If user exists with different ID, sync with Supabase ID
   */
  async findOrCreateFromSupabase(data: {
    id: string; // Supabase ID
    email: string;
    fullName?: string;
  }) {
    return this.prisma.$transaction(async (tx) => {
      // Try to find by Supabase ID first
      let user = await tx.user.findUnique({
        where: { id: data.id },
      });

      if (user) {
        return user;
      }

      // Check if user exists by email (ID mismatch scenario)
      const existingUser = await tx.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        // ID mismatch detected - sync with Supabase ID
        console.warn(
          `⚠️ ID mismatch detected for ${data.email}: DB=${existingUser.id}, Supabase=${data.id}`,
        );
        console.log(`🔄 Syncing database ID to match Supabase...`);

        // Delete old record and create new one with correct ID
        // (Can't update ID directly due to primary key constraint)
        await tx.user.delete({
          where: { id: existingUser.id },
        });

        user = await tx.user.create({
          data: {
            id: data.id, // Use Supabase ID as source of truth
            email: data.email,
            fullName: data.fullName || existingUser.fullName,
            role: existingUser.role,
            isActive: existingUser.isActive,
          },
        });

        console.log(`✅ ID synced successfully: ${data.id}`);
        return user;
      }

      // User doesn't exist - create new
      user = await tx.user.create({
        data: {
          id: data.id,
          email: data.email,
          fullName: data.fullName,
          role: UserRole.operator,
          isActive: true,
        },
      });

      console.log(`✅ New user created: ${data.email}`);
      return user;
    });
  }
}

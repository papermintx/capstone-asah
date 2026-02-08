import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Zod Schemas
export const SignUpSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().optional(),
});

export const SignInSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const ResetPasswordSchema = z.object({
  email: z.email('Invalid email address'),
});

export const ResendVerificationSchema = z.object({
  email: z.email('Invalid email address'),
});

export const VerifyEmailSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  type: z.string().optional(),
});

export const VerifyEmailCallbackSchema = z.object({
  accessToken: z.string().min(1, 'Access token is required'),
  refreshToken: z.string().optional(),
  type: z.string().optional(),
});

// DTOs from Zod Schemas
export class SignUpDto extends createZodDto(SignUpSchema) {}
export class SignInDto extends createZodDto(SignInSchema) {}
export class RefreshTokenDto extends createZodDto(RefreshTokenSchema) {}
export class ResetPasswordDto extends createZodDto(ResetPasswordSchema) {}
export class ResendVerificationDto extends createZodDto(
  ResendVerificationSchema,
) {}
export class VerifyEmailDto extends createZodDto(VerifyEmailSchema) {}
export class VerifyEmailCallbackDto extends createZodDto(
  VerifyEmailCallbackSchema,
) {}

// Types
export type SignUpInput = z.infer<typeof SignUpSchema>;
export type SignInInput = z.infer<typeof SignInSchema>;
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
export type ResendVerificationInput = z.infer<typeof ResendVerificationSchema>;
export type VerifyEmailInput = z.infer<typeof VerifyEmailSchema>;
export type VerifyEmailCallbackInput = z.infer<
  typeof VerifyEmailCallbackSchema
>;

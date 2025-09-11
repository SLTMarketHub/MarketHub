import { Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  stockCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IError extends Error {
  statusCode?: number;
  status?: string;
  code?: number;
  errors?: Record<string, { message: string }>;
  keyValue?: Record<string, any>;
  errmsg?: string;
  name: string;
  message: string;
  stack?: string;
}

export interface IValidationError extends Error {
  errors: Record<string, { message: string }>;
}

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(value);
}

export const parseCronExpression = (cron: string): { frequency: 'MONTHLY' | 'WEEKLY' | 'DAILY'; day: number } => {
  const parts = cron.split(' ');
  if (parts[4] === '*') {
    return { frequency: 'MONTHLY', day: parseInt(parts[3], 10) };
  }
  
  if (parts[5] !== '*'){
    return { frequency: 'WEEKLY', day: parseInt(parts[5], 10) };
  }
  
  return { frequency: 'DAILY', day: 1 };
};
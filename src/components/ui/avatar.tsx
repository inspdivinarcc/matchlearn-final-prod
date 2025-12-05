import * as React from 'react';
import { cn } from '@/lib/utils';

export function Avatar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>){
  return <div className={cn("h-10 w-10 rounded-full bg-gray-200 grid place-items-center overflow-hidden", className)} {...props} />;
}
export function AvatarFallback({ className, ...props }: React.HTMLAttributes<HTMLDivElement>){
  return <div className={cn("h-full w-full grid place-items-center", className)} {...props} />;
}

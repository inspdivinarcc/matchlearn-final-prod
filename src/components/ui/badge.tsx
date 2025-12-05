import * as React from 'react';
import { cn } from '@/lib/utils';

export function Badge({ className, variant='default', ...props }: React.HTMLAttributes<HTMLSpanElement> & { variant?: 'default'|'secondary'|'outline'|'destructive' }){
  const variants: Record<string,string> = {
    default: "bg-purple-600 text-white",
    secondary: "bg-gray-200 text-gray-900",
    outline: "border border-gray-300 text-gray-900",
    destructive: "bg-red-600 text-white"
  };
  return <span className={cn("inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold", variants[variant], className)} {...props} />;
}

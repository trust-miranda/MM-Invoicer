import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        portratar: "bg-red-100 text-red-800",
        emprogresso: "bg-yellow-100 text-yellow-800",
        concluido: "bg-green-100 text-green-800",
        cancelado: "bg-gray-100 text-gray-800",
        backlog: "bg-blue-100 text-blue-800",
      },
    },
    defaultVariants: {
      variant: "portratar",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant }), "text-nowrap", className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };

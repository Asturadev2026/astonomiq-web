import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const typographyVariants = cva("text-foreground", {
    variants: {
        variant: {
            h1: "font-poppins font-semibold text-[36px] leading-[44px] tracking-normal",
            // Add other variants here as provided
        },
    },
    defaultVariants: {
        variant: "h1",
    },
});

export interface TypographyProps
    extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof typographyVariants> {
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
}

const Typography = React.forwardRef<HTMLHeadingElement, TypographyProps>(
    ({ className, variant, as, ...props }, ref) => {
        const Component = as || "h1";
        return (
            <Component
                className={cn(typographyVariants({ variant, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Typography.displayName = "Typography";

export { Typography, typographyVariants };

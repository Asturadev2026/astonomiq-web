import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const typographyVariants = cva("text-foreground", {
    variants: {
        variant: {
            h1: "font-poppins font-semibold text-[36px] leading-[44px] tracking-normal",

            // Body - Regular (400)
            "body-lg": "font-poppins font-normal text-base", // 16px / 24px
            "body-md": "font-poppins font-normal text-sm",   // 14px / 20px
            "body-sm": "font-poppins font-normal text-xs",   // 12px / 16px

            // Label - Medium (500)
            "label-md": "font-poppins font-medium text-sm",  // 14px / 20px
            "label-sm": "font-poppins font-medium text-xs",  // 12px / 16px
            "label-xs": "font-poppins font-medium text-[10px] leading-[16px]", // 10px / 16px
        },
    },
    defaultVariants: {
        variant: "body-md",
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

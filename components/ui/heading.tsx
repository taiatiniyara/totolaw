import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  children: React.ReactNode;
}

const headingStyles = {
  h1: "scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl",
  h2: "scroll-m-20 text-3xl font-bold tracking-tight lg:text-4xl",
  h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
  h4: "scroll-m-20 text-xl font-semibold tracking-tight",
  h5: "scroll-m-20 text-lg font-semibold tracking-tight",
  h6: "scroll-m-20 text-base font-semibold tracking-tight",
};

const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as: Component = "h2", className, children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          "font-[family-name:var(--font-noto-serif)]",
          headingStyles[Component],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Heading.displayName = "Heading";

export { Heading };

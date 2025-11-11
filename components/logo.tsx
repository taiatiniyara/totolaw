import Image from "next/image";
import logo from "./images/logo.svg";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function Logo({ className, width = 120, height = 40 }: LogoProps) {
  return (
    <a href="/">
      <Image
        className={cn("object-contain", className)}
        src={logo}
        alt="Totolaw Logo"
        width={width}
        height={height}
        priority
      />
    </a>
  );
}

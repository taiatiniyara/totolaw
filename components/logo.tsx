import Image from "next/image";
import logo from "./images/logo.svg";
export default function Logo() {
  return <Image className="lg:w-[8%] sm:w-[16%] md:w-[12%]" src={logo} alt="Logo" />;
}

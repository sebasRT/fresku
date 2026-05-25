import { cn } from "@/utils/functions/styles";
import Image from "next/image";

const LoadingPage = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "m-auto w-full min-h-[calc(100svh-12rem)] flex place-content-center",
      className
    )}
  >
    <Image src={"/Fresku.svg"} height={350} width={350} alt="Domis" />
  </div>
);

export default LoadingPage;

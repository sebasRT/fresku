"use client";
import { cn } from "@/utils/functions/styles";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import styles from "../bottomNav.module.scss";

const Home = () => {
  const pathName = usePathname();

  if (pathName === "/") return null;
  return (
    <Link href={"/"} className={cn(styles.link)}>
      <IoIosArrowBack /> <p>Inicio</p>
    </Link>
  );
};

export default Home;

import Link from "next/link";
import { ReactNode } from "react";

const productsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <nav>
      <Link href={"/products/new"}>Nuevos</Link>
      <Link href={"/products/create"}>Crear</Link>
      <main>{children}</main>
    </nav>
  );
};

export default productsLayout;

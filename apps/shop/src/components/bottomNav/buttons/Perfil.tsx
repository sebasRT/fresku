import Link from "next/link";
import { IoPersonOutline } from "react-icons/io5";

const Perfil = () => {
  return (
    <Link href={"/perfil"} replace>
      <IoPersonOutline />
    </Link>
  );
};

export default Perfil;

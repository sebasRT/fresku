import { getRootDomain } from "@/utils/consts/global";
import { headers } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

const NotFound = async () => {
  const headersList = await headers();
  const host = headersList.get("host") as string;
  const isSubdomainSearch = host.endsWith(getRootDomain());

  if (isSubdomainSearch) {
    redirect("/tienda-no-encontrada", RedirectType.replace);
  }

  return (
    <div>
      <h1></h1>
    </div>
  );
};

export default NotFound;

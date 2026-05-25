import BottomNav from "@/components/bottomNav/BottomNav";
import Searchbar from "@/components/Searchbar/Searchbar";
import { getTenantName } from "@fresku/mongo/tenants/meta";
import { Metadata } from "next";

type Params = Promise<{ domain: string }>;
export async function generateMetadata(
  { params }: { params: Params },
): Promise<Metadata> {
  const { domain } = await params;
  const name = await getTenantName(domain);

  return {
    title: name ?? "Fresku",
    description: "Tu tienda a un click",
  };
}

const layout = async ({ children, params }: { children: React.ReactNode, params: Params }) => {
  const { domain } = await params;
  return (
    <div className="flex flex-col h-svh max-h-svh overflow-auto">
      <header>
        <nav className="p-3 flex gap-3 w-full max-w-md mx-auto relative">
          <Searchbar />
        </nav>
      </header>
      <main className="relative grow mb-20">
        {children}
        <BottomNav domain={domain} />
      </main>
    </div>
  );
};

export default layout;

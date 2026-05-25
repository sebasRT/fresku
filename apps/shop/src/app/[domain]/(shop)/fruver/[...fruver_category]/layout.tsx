import { FruverCategory, FruverSubcategory } from "@/utils/consts/fruver";
import { ReactNode } from "react";
import Shufflers from "../_c/Shufflers";

const CategoryLayout = async ({
  params,
  children,
}: {
  params: Promise<{
    domain: string;
    fruver_category: string[];
  }>;
  children: ReactNode;
}) => {
  const { fruver_category } = await params;
  const [category, subcategory] = fruver_category as [FruverCategory, string?];

  const decodeSub =
    subcategory && (decodeURIComponent(subcategory) as FruverSubcategory);

  return (
    <div>
      <Shufflers category={category} subcategory={decodeSub} />
      {children}
    </div>
  );
};

export default CategoryLayout;

import { ReactNode } from "react";
import Shufflers from "./c/Shufflers";
import Providers from "./providers";

const CategoryLayout = async ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <div>
      <Shufflers />
      <Providers>
        {children}
      </Providers>
    </div>
  );
};

export default CategoryLayout;

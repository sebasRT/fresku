import LoadingPage from "@/components/LoadingPage";
import { Suspense } from "react";
import CheckoutLoader from "./CheckoutLoader";

export default async function Page({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;

  return (
    <Suspense fallback={<LoadingPage />}>
      <CheckoutLoader domain={domain} />
    </Suspense>
  );
}

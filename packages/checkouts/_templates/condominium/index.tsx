"use client";
import { CheckoutProps } from "@fresku/checkouts";
import CheckoutForm from "./components/CheckoutForm";

const index = ({ domain }: CheckoutProps) => {
  return <CheckoutForm domain={domain} />;
};

export default index;

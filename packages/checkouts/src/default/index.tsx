"use client";
import { CheckoutProps } from "@fresku/checkouts";
import Form from "./components/Form";

const index = ({ domain }: CheckoutProps) => {
  return <Form domain={domain} />;
};

export default index;

"use client";
import Lottie from "lottie-react";
import animationData from "@/assets/lotties/AddProduct.json";

const LottieAddToCartAnimation = () => (
  <Lottie
    animationData={animationData}
    style={{ maxWidth: "20rem", margin: "auto" }}
  />
);

export default LottieAddToCartAnimation;

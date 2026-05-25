"use client";
import { CldImage } from "next-cloudinary";
import { Suspense } from "react";

const ProductImage = ({ src, alt }: { src: string; alt: string }) => {
  if (!src) {
    return <></>;
  }
  return (
    <figure className="relative aspect-square w-full min-w-full overflow-clip bg-white">
      <Suspense fallback={<></>}>
        <CldImage
          src={src}
          fill
          alt={alt}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain object-center py-1"
        />
      </Suspense>
    </figure>
  );
};

export default ProductImage;

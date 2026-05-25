import { Card } from "@/components/products/barcode/Card";
import { Card as FruverCard } from "@/components/products/fruver/Card";
import { getBarcodeProducts } from "@/lib/mongo/products/barcode";
import { getFruverProducts } from "@/lib/mongo/products/fruver";
import { Order } from "@fresku/model/order";
import { BarcodeProduct } from "@fresku/model/products/barcode";
import { FruverProduct } from "@fresku/model/products/fruver";
import { Coiny } from "next/font/google";
import Link from "next/link";
import { use } from "react";

const coiny = Coiny({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
});

const RecentProducts = ({
  domain,
  products,
}: {
  domain: string;
  products: Promise<Order["products"]>;
}) => {
  const recentProducts = use(products);

  if (!recentProducts.barcode?.length && !recentProducts.fruver?.length) {
    return (
      <Link href={"/"}>
        <p className="mt-9 mx-5 text-center">
          Haz tu primer <span className={coiny.className}>Domi</span> ⚡
        </p>
      </Link>
    );
  }

  const { barcode, fruver } = recentProducts;
  const barcodes = barcode?.map((p) => p.barcode) || [];
  const skus = fruver?.map((p) => p.sku) || [];
  const barcodeProducts = getBarcodeProducts(domain, barcodes);
  const fruverProducsts = getFruverProducts(domain, skus);

  return (
    <div className="w-full max-w-full flex flex-row flex-wrap gap-5 pt-0">
      <FruverList products={fruverProducsts} />
      <BarcodeList products={barcodeProducts} />
    </div>
  );
};

const BarcodeList = ({ products }: { products: Promise<BarcodeProduct[]> }) => {
  const barcodeProducts = use(products);
  if (!barcodeProducts) return null;
  return (
    <>
      {barcodeProducts.map((product, i) => (
        <Card product={product} key={product.barcode + i} size="small" />
      ))}
    </>
  );
};

const FruverList = ({ products }: { products: Promise<FruverProduct[]> }) => {
  const fruverProducts = use(products);
  if (!fruverProducts) return null;
  return (
    <>
      {fruverProducts.map((product, i) => (
        <FruverCard product={product} key={product.sku + i} size="small" />
      ))}
    </>
  );
};
export default RecentProducts;

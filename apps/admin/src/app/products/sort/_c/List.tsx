import {
    EditBarcode,
} from "@/components/products/barcode/edit/EditBarcode";
import { useProductById, useProducts } from "./useProducts";

const List = () => {
  const { products } = useProducts();
  const { isLoading, data, error } = products;

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>No products found.</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-wrap ">
      {data.map((p) => (
        <Card key={p.barcode} id={p.barcode} />
      ))}
    </div>
  );
};

const Card = ({ id }: { id: string }) => {
  const { product, updateProduct } = useProductById(id);

  if (!product) return null;

  return (
    <EditBarcode product={product} onUpdate={updateProduct}>
      <EditBarcode.Card withModal />
    </EditBarcode>
  );
};

export default List;

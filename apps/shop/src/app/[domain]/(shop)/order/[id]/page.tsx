import { getOrderById } from "@/lib/mongo/orders";
import { OrderBarcode, OrderFruver } from "@fresku/model/order";
import { formatPrice } from "@fresku/utils/functions/strings";
import styles from "./order.module.scss";

async function page({
  params,
}: {
  params: Promise<{ domain: string; id: string }>;
}) {
  const { domain, id } = await params;
  const order = await getOrderById(domain, id);

  if (!order) return <span>Esta orden no pudo ser encontrada</span>;

  const barcode = order.products.barcode;
  const fruver = order.products.fruver;
  const {
    address: { label },
    contact: { name, phone },
    status,
  } = order;

  return (
    <div className={styles.order}>
      <div>
        <section>
          <span>Estado de tu Domi</span>
          <h1>{statusLabels[status]}</h1>
        </section>
        <section>
          <span>Info de entrega</span>
          <b>{name}</b>
          <p>{phone}</p>
          <p>{label}</p>
        </section>
      </div>
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>#</th>
            <th>total</th>
          </tr>
        </thead>
        <tbody>
          {barcode?.map((product, key) => (
            <BarcodeLI product={product} key={product.barcode + key} />
          ))}
          {fruver?.map((product, key) => (
            <FruverLI product={product} key={product.sku + key} />
          ))}
        </tbody>
        <tfoot>
          {/* <tr>
            <td colSpan={2}>Total</td>
            <td>{formatPrice(order.total)}</td>
          </tr> */}
        </tfoot>
      </table>
    </div>
  );
}

const BarcodeLI = ({ product }: { product: OrderBarcode }) => {
  const { name, price, quantity, measure } = product;
  const total = price * quantity;
  return (
    <tr>
      <td className={styles.name}>{`${name} ${measure}`}</td>
      <td>
        <p className={styles.quantity}>{quantity} x</p>
        <p className={styles.unitPrice}>{formatPrice(price)}</p>
      </td>
      <td className={styles.price}>{formatPrice(total)}</td>
    </tr>
  );
};

const FruverLI = ({ product }: { product: OrderFruver }) => {
  const { name, labelPrice, labelMeasure } = product;
  return (
    <tr>
      <td className={styles.name}>{name}</td>
      <td className={styles.quantity}>{labelMeasure}</td>
      <td className={styles.price}>{formatPrice(labelPrice)}</td>
    </tr>
  );
};

const statusLabels = {
  pending: "Pendiente",
  packed: "Procesando",
  delivered: "Entregado",
  canceled: "Cancelado",
};

export default page;

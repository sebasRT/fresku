"use client";
import { measureConversionsToGrams, measureUnits } from "@/utils/consts/fruver";
import { getLabelMeasure, getLabelPrice } from "@/utils/functions/fruver";
import { formatPrice } from "@/utils/functions/strings";
import { FruverProduct } from "@fresku/model/products/fruver";
import {
  useFruverCartActions,
  useFruverItemById,
  useFruverItemQuantity,
} from "@fresku/stores/cart/fruver";
import { MeasureUnit } from "@fresku/utils/products/fruver/types";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { MdAddCircle, MdRemove } from "react-icons/md";
import styles from "./product.module.scss";

const FControls = ({ product }: { product: FruverProduct }) => {
  const { sellingFormat } = product;

  return (
    <div className={clsx(styles.controls, styles[sellingFormat])}>
      {(() => {
        switch (sellingFormat) {
          case "weight":
            return <WeightHandlers product={product} />;
          case "unit":
            return <UnitHandlers product={product} />;
          default:
            return <div>handlers</div>;
        }
      })()}
    </div>
  );
};

const WeightHandlers = ({ product }: { product: FruverProduct }) => {
  const { addToCart, removeFromCart } = useFruverCartActions();
  const { sku, unit, unitQuantity, pricePerGram } = product;
  const initPrice = getLabelPrice(product);
  const [unitQ, setUnitQ] = useState(unitQuantity);
  const [measureUnit, setMeasureUnit] = useState<MeasureUnit>(unit);
  const [sellPrice, setSellPrice] = useState<number>(initPrice);
  const saved = useFruverItemById(sku);

  useEffect(() => {
    const newPrice =
      measureConversionsToGrams[measureUnit] * unitQ * pricePerGram;
    setSellPrice(newPrice);
  }, [unitQ, measureUnit]);

  const handleAddToCart = () => {
    const item = {
      ...product,
      unit: measureUnit,
      unitQuantity: unitQ,
      quantity: 1,
      price: Math.floor(sellPrice),
    };
    addToCart(item);
  };

  const weightLabel = saved && getLabelMeasure(saved);
  return (
    <>
      {saved && <span className={styles.count} children={weightLabel} />}
      <div className={styles.handlers}>
        <div>
          <input
            type="number"
            min={0}
            onChange={(e) => setUnitQ(Number(e.currentTarget.value))}
            defaultValue={unitQuantity}
            className={styles.unitQuantity}
          />
          <select
            defaultValue={unit}
            onChange={(e) =>
              setMeasureUnit(e.currentTarget.value as MeasureUnit)
            }
            children={measureUnits.map((unit) => (
              <option key={unit} value={unit} children={unit} />
            ))}
          />
        </div>
        <span className={styles.price}>{formatPrice(sellPrice)}</span>
      </div>
      {saved ? (
        <div className={styles.savedButtons}>
          <button
            className={styles.delete}
            onClick={() => removeFromCart(sku)}
            children={"Eliminar"}
          />
          <button
            className={styles.change}
            disabled={
              unitQ === saved.unitQuantity && measureUnit === saved.unit
            }
            onClick={handleAddToCart}
            children={"Cambiar"}
          />
        </div>
      ) : (
        <button
          className={styles.add}
          onClick={handleAddToCart}
          children={"Añadir"}
        />
      )}
    </>
  );
};

const UnitHandlers = ({ product }: { product: FruverProduct }) => {
  const cartItemQuantity = useFruverItemQuantity(product.sku);
  const { addToCart, removeUnitById } = useFruverCartActions();

  const addUnit = () => {
    addToCart({ ...product, quantity: 1 });
  };

  const removeUnit = () => {
    removeUnitById(product.sku);
  };

  return (
    <>
      {cartItemQuantity > 0 && (
        <span className={styles.count}>{cartItemQuantity}</span>
      )}

      <button children={<MdRemove />} onClick={removeUnit} />
      <span>{cartItemQuantity}</span>
      <button children={<MdAddCircle />} onClick={addUnit} />
    </>
  );
};

export default FControls;

"use client";
import FruverModal from "@/components/products/fruver/Modal";
import { barcodeQuerySearch as BarcodeQuerySearch } from "@/lib/mongo/products/barcode";
import { fruverQuerySearch } from "@/lib/mongo/products/fruver";
import styles from "@/styles/global/searchbar.module.scss";
import { getFruverLabels } from "@/utils/functions/fruver";
import { formatPrice } from "@/utils/functions/strings";
import { BarcodeProduct } from "@fresku/model/products/barcode";
import { FruverProduct } from "@fresku/model/products/fruver";
import {
  useBarcodeCartActions,
  useBarcodeItemQuantity,
} from "@fresku/stores/cart/barcode";
import {
  useFruverCartActions,
  useFruverItemQuantity,
} from "@fresku/stores/cart/fruver";
import clsx from "clsx";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoIosClose, IoIosSearch } from "react-icons/io";
import { MdAddCircle } from "react-icons/md";
import { useDebounceValue } from "usehooks-ts";
import ProductImage from "./products/ProductImage";
import BarcodeModal from "./products/barcode/Modal";

const SearchBar = () => {
  const { domain } = useParams<{ domain: string }>();
  const [barcodeResults, setBarcodeResults] = useState<BarcodeProduct[]>([]);
  const [fruverResults, setFruverResults] = useState<FruverProduct[]>([]);
  const [query, setQuery] = useDebounceValue<string>("", 600);
  const [loading, setLoading] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      if (query) {
        const fruverResponse = await fruverQuerySearch(query, domain);
        const barcodeResponse = await BarcodeQuerySearch(query, domain);
        const barcodeResults = barcodeResponse as BarcodeProduct[];
        const fruverResults = fruverResponse as FruverProduct[];

        setBarcodeResults(barcodeResults);
        setFruverResults(fruverResults);
        setLoading(false);
      } else {
        setBarcodeResults([]);
      }
    };
    fetchResults();
  }, [query]);

  const resetSearch = () => {
    setLoading(false);
    setInputValue("");
    setQuery("");
    setBarcodeResults([]);
  };

  return (
    <div id={styles.searchBar}>
      <input
        placeholder="Buscar Producto"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setQuery(e.target.value);
        }}
        ref={input}
      />
      {barcodeResults.length > 0 && (
        <ul>
          {fruverResults.map((result) => (
            <FruverItem product={result} key={result.name} />
          ))}
          {barcodeResults.map((result) => (
            <BarcodeItem product={result} key={result.barcode} />
          ))}
          {barcodeResults.length >= 15 ||
            (fruverResults.length > 15 && (
              <li className={styles.moreResults}>
                <Link
                  href={`/buscar?query=${query}`}
                  onClick={() => resetSearch()}
                >
                  <span className="text-center block text-blue-600 py-3">
                    Ver más resultados
                  </span>
                </Link>
              </li>
            ))}
        </ul>
      )}

      {barcodeResults.length < 1 && inputValue.length > 0 && (
        <ul className="text-xl text-center bg-white py-2">
          {loading ? (
            <span>Buscando...</span>
          ) : (
            <span> Lo sentimos, no tenemos resultados para esta búsqueda</span>
          )}
        </ul>
      )}

      {inputValue.length === 0 ? (
        <IoIosSearch id={styles.searchIcon} />
      ) : (
        <IoIosClose onClick={resetSearch} id={styles.searchIcon} />
      )}
    </div>
  );
};

const BarcodeItem = ({ product }: { product: BarcodeProduct }) => {
  const { addToCart } = useBarcodeCartActions();
  const { name, brand, image, price, barcode, measure } = product;
  const quantity = useBarcodeItemQuantity(barcode);

  return (
    <li>
      <BarcodeModal product={product} />
      <ProductImage src={image} alt={name} />
      <section className={styles.productDetails}>
        <p>{brand}</p>
        <h3>{name}</h3>
        <div>
          <span>{measure}</span>
          <span className={styles.price}>{formatPrice(price)}</span>
        </div>
      </section>
      <span className={clsx(styles.count, { "opacity-0": quantity < 1 })}>
        {quantity}
      </span>
      <button
        className={styles.addButton}
        onClick={() => addToCart({ ...product })}
      >
        <MdAddCircle />
      </button>
    </li>
  );
};

const FruverItem = ({ product }: { product: FruverProduct }) => {
  const { addToCart } = useFruverCartActions();
  const { name, image, sellingFormat, sku, unit, unitQuantity, avrWeight } =
    product;
  const quantity = useFruverItemQuantity(sku);
  const { measure, price } = getFruverLabels(product);

  return (
    <li>
      <FruverModal product={product} />
      <ProductImage src={image} alt={name} />
      <section className={styles.productDetails}>
        <h3>{name}</h3>
        <div>
          <span>{measure}</span>
          <span className={styles.price}>{formatPrice(price)}</span>
        </div>
      </section>
      <span className={clsx(styles.count, { "opacity-0": quantity < 1 })}>
        {quantity}
      </span>
      <button
        className={styles.addButton}
        disabled={quantity > 0 && sellingFormat === "weight"}
        onClick={() => addToCart({ ...product, quantity: 1, type: "fruver" })}
      >
        <MdAddCircle />
      </button>
    </li>
  );
};

export default SearchBar;

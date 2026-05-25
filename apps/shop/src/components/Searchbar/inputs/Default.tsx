"use client";
import { barcodeQuerySearch } from "@/lib/mongo/products/barcode";
import { fruverQuerySearch } from "@/lib/mongo/products/fruver";
import { BarcodeProduct } from "@fresku/model/products/barcode";
import { FruverProduct } from "@fresku/model/products/fruver";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { HiOutlineX } from "react-icons/hi";
import { PiStopFill } from "react-icons/pi";
import { useDebounceValue } from "usehooks-ts";
import Microphone from "../microphone/Microphone";
import useAudioStore from "../microphone/microphoneStore";
import ProductsSlider from "../ProductsSlider";
import { useBarMode, useQuery as useSearcharQuery } from "../useSearchbar";
import styles from "./inputs.module.scss";

const queryClient = new QueryClient();

const DefaultInput = () => {
  const { query, setQuery } = useSearcharQuery();
  const { mode } = useBarMode();

  if (mode !== "default") return null;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <label className={styles.container}>
        <input
          type="text"
          onChange={handleInputChange}
          value={query}
          placeholder="Que producto buscas?"
        />
        {query.length < 3 ? (
          <Microphone />
        ) : (
          <>
            <HiOutlineX className="text-[2em] " onClick={() => setQuery("")} />
            <Microphone />
          </>
        )}
      </label>
      <Results />
    </QueryClientProvider>
  );
};

const Results = () => {
  const resultsDiv = useRef<HTMLDivElement>(null);
  const { domain } = useParams<{ domain: string }>();
  const { query, setQuery } = useSearcharQuery();
  const { isRecording, text } = useAudioStore();
  const [debouncedQuery, set] = useDebounceValue(query, 600);

  const {
    data: products,
    isLoading,
    error,
    isEnabled,
  } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => fetchProducts(debouncedQuery, domain),
    enabled: query.length >= 3,
  });

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!resultsDiv.current) return;
      const target = event.target as Node;
      if (!resultsDiv.current.contains(target)) {
        setQuery("");
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [setQuery]);

  if (isRecording)
    return (
      <div className="absolute top-full left-0 z-30 w-full max-w-md overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg p-5">
        <span className="flex gap-5 items-center">
          Oprime <PiStopFill /> para buscar tu producto
        </span>
      </div>
    );

  if (!query) {
    return null;
  }

  return (
    <div
      className="absolute top-full left-0 z-30 w-full max-w-md overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg p-5"
      ref={resultsDiv}
    >
      {(query !== debouncedQuery || !isEnabled) && resultsUI.idle}
      {isLoading && Boolean(query) && resultsUI.loading}
      {products &&
        debouncedQuery === query &&
        resultsUI.fetched(products.barcode, products.fruver)}
      {error && <span>Hubo un error al buscar productos</span>}
    </div>
  );
};

const resultsUI = {
  loading: <span>Buscando productos...</span>,
  fetched: (
    barcodeResults: BarcodeProduct[],
    fruverResults: FruverProduct[]
  ) => <ProductsSlider barcode={barcodeResults} fruver={fruverResults} />,
  idle: <span>Usa tu microfono para una busqueda agil 🎤😁</span>,
} as const;

async function fetchProducts(query: string, domain: string) {
  if (!query || query.trim().length === 0) return { barcode: [], fruver: [] };
  const [fruverResults, barcodeResults] = await Promise.all([
    fruverQuerySearch(query, domain),
    barcodeQuerySearch(query, domain),
  ]);
  return { barcode: barcodeResults, fruver: fruverResults };
}

export default DefaultInput;

import { uploadImage } from "@/lib/cloudinary/actions";
import { BaseBarcodeProduct } from "@fresku/model/products/barcode";
import { CldImage } from "next-cloudinary";
import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { IoIosAddCircleOutline } from "react-icons/io";
import { LuLoader } from "react-icons/lu";

const ImageInput = () => {
  const {
    register,
    getValues,
    setValue,
    formState: { errors },
    watch,
  } = useFormContext<BaseBarcodeProduct>();
  const [imageId, setImageId] = useState<string>("");

  const [imageState, setImageState] = useState<
    "idle" | "loading" | "loaded" | "failed"
  >("idle");

  const inputRef = useRef<HTMLInputElement>(null);

  const UploadImage: ChangeEventHandler<HTMLInputElement> = async (event) => {
    const barcode = getValues("barcode");
    if (!barcode) {
      event.preventDefault();
      return alert(
        "Por favor, ingresa el código de barras del producto antes de subir una imagen."
      );
    }

    const file = event.target.files?.[0];
    if (!file) return;

    setImageState("loading");

    const formData = new FormData();
    formData.append("NewProductReportImage", file);

    const cloudinaryData: any = await uploadImage(formData, barcode.toString());

    if (!cloudinaryData.public_id) throw new Error("Error uploading image");

    setImageId(cloudinaryData.public_id);
    setValue("image", cloudinaryData.public_id);

    setImageState("loaded");
  };

  const image = watch("image");
  useEffect(() => {
    setImageState(image ? "loaded" : "idle");
    if (image) {
      setValue("image", image);
      setImageId(image);
    }
  }, [image]);

  return (
    <label htmlFor="barcode">
      <button
        type="button"
        onClick={() => setValue("image", "no-image")}
        className="bg-blue-500 px-10 self-center rounded-full"
      >
        Sin imagen
      </button>
      <div
        className="image-input"
        style={{
          borderWidth: 2,
          borderColor: errors.image ? "red" : "transparent",
        }}
        onClick={() => inputRef.current?.click()}
      >
        {(() => {
          switch (imageState) {
            case "idle":
              return (
                <div className="flex flex-col items-center gap-5 text-center text-5xl text-gray-500">
                  <IoIosAddCircleOutline />
                  <span className="text-sm font-semibold">
                    Añadir imagen del producto
                  </span>
                  <input
                    type="file"
                    accept='".png, .jpg, .jpeg"'
                    capture="environment"
                    id="barcode"
                    onChange={UploadImage}
                    hidden
                    required
                    ref={inputRef}
                  />
                </div>
              );
            case "loading":
              return (
                <LuLoader className="animate-spin text-4xl text-blue-500" />
              );

            case "loaded":
              return (
                <figure className="relative grid content-center h-full aspect-square object-cover">
                  <CldImage
                    src={imageId}
                    alt="product image"
                    fill
                    className="aspect-square h-full rounded-xs object-cover"
                  />
                  <input
                    type="file"
                    accept='".png, .jpg, .jpeg"'
                    capture="environment"
                    id="barcode"
                    onChange={UploadImage}
                    hidden
                    required
                    ref={inputRef}
                  />
                </figure>
              );
          }
        })()}
        <input {...register("image")} hidden required />
      </div>
    </label>
  );
};

export default ImageInput;

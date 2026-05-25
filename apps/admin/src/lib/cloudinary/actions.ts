'use server'
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryUploadWidgetInfo } from 'next-cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

export async function uploadImage(formData: FormData, name: string) {
    if (!formData.has('NewProductReportImage')) {
        throw new Error("No image file found in form data");
    }
    if (!name) {
        throw new Error("Product name is required for image upload");
    }

    const image = formData.get('NewProductReportImage') as File;
    const arrayBuffer = await image.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const cloudinaryResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: "minimarket", public_id: name, invalidate: true, overwrite: true }, function (error, result) {
            if (error) {
                reject(error); console.log(error.message);
                ; throw new Error(error.message);
            };
            resolve(result as CloudinaryUploadWidgetInfo)

        }).end(buffer)
    }
    )
    return cloudinaryResponse;
}

export const destroyImage = async (public_id: string) => {

    const cloudinaryResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(public_id, { invalidate: true }, function (error, result) {
            if (error) {
                reject(error); console.log(error.message);
                ; throw new Error(error.message);
            };
            resolve(result)
        })
    })

    return cloudinaryResponse;

}
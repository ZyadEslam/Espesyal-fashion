"use client";
import React, { useState, useCallback } from "react";
import { assets } from "@/public/assets/assets";
import ImageUploader, {
  ImageState,
} from "../components/dashboardComponents/ImageUploader";
import FormInput from "../components/dashboardComponents/FormInput";
import PriceInputs from "../components/dashboardComponents/PriceInputs";
import SubmitButton from "../components/dashboardComponents/SubmitBtn";
import ProductForm from "../components/dashboardComponents/ProductForm";

// Main Dashboard Page Component
const DashboardPage = () => {
  const [images, setImages] = useState<ImageState>({
    image1: assets.upload_area,
    image2: assets.upload_area,
    image3: assets.upload_area,
    image4: assets.upload_area,
  });

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, imageKey: string) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const imageUrl = URL.createObjectURL(file);
        setImages((prev) => ({
          ...prev,
          [imageKey]: imageUrl,
        }));
      }
    },
    []
  );

  const removeImageHandler = useCallback((imageKey: string) => {
    setImages((prev) => ({
      ...prev,
      [imageKey]: assets.upload_area,
    }));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg ">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

      <ProductForm>
        <ImageUploader
          images={images}
          onImageChange={handleImageChange}
          onRemoveImage={removeImageHandler}
        />

        <FormInput
          id="name"
          name="name"
          label="Product Name"
          type="text"
          placeholder="Enter product name"
          required
        />

        <FormInput
          id="description"
          name="description"
          label="Product Description"
          type="textarea"
          placeholder="Enter product description"
          required
          rows={4}
        />

        <div className="flex flex-col md:flex-row gap-4">
          <FormInput
            id="category"
            name="category"
            label="Product Category"
            type="text"
            placeholder="Category"
            required
            className="md:w-1/2"
          />
          <FormInput
            id="brand"
            name="brand"
            label="Product Brand"
            type="text"
            placeholder="Brand"
            required
            className="md:w-1/2"
          />
        </div>

        <PriceInputs />

        <SubmitButton />
      </ProductForm>
    </div>
  );
};

export default DashboardPage;

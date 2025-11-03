"use client";
import React, { useState, useCallback, memo } from "react";
import { assets } from "@/public/assets/assets";
import ImageUploader, {
  ImageState,
} from "../../components/dashboardComponents/ImageUploader";
import FormInput from "../../components/dashboardComponents/FormInput";
import PriceInputs from "../../components/dashboardComponents/PriceInputs";
import SubmitButton from "../../components/dashboardComponents/SubmitBtn";
import ProductForm from "../../components/dashboardComponents/ProductForm";
import { Plus } from "lucide-react";

// Main Dashboard Page Component
const DashboardPage = memo(() => {
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
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-orange/10 rounded-lg flex items-center justify-center">
            <Plus className="w-5 h-5 text-orange" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Add New Product
            </h1>
            <p className="text-gray-600 mt-1">
              Create a new product listing for your store
            </p>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8">
          <ProductForm>
            <ImageUploader
              images={images}
              onImageChange={handleImageChange}
              onRemoveImage={removeImageHandler}
            />

            <div className="space-y-6">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  id="category"
                  name="category"
                  label="Product Category"
                  type="text"
                  placeholder="Category"
                  required
                />
                <FormInput
                  id="brand"
                  name="brand"
                  label="Product Brand"
                  type="text"
                  placeholder="Brand"
                  required
                />
              </div>

              <PriceInputs />

              <div className="pt-6 border-t border-gray-200">
                <SubmitButton />
              </div>
            </div>
          </ProductForm>
        </div>
      </div>
    </div>
  );
});

DashboardPage.displayName = "DashboardPage";

export default DashboardPage;

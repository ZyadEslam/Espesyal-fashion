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
import { useTranslations, useLocale } from "next-intl";

const DashboardPage = memo(() => {
  const t = useTranslations("dashboard.addProduct");
  const locale = useLocale();
  const direction = locale.startsWith("ar") ? "rtl" : "ltr";

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
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange/10 rounded-lg flex items-center justify-center">
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-orange" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-orange">
              {t("badge")}
            </p>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              {t("title")}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              {t("subtitle")}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-6 lg:p-8">
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
                label={t("nameLabel")}
                type="text"
                placeholder={t("namePlaceholder")}
                required
                direction={direction as "ltr" | "rtl"}
              />

              <FormInput
                id="description"
                name="description"
                label={t("descriptionLabel")}
                type="textarea"
                placeholder={t("descriptionPlaceholder")}
                required
                rows={4}
                direction={direction as "ltr" | "rtl"}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  id="category"
                  name="category"
                  label={t("categoryLabel")}
                  type="text"
                  placeholder={t("categoryPlaceholder")}
                  required
                  direction={direction as "ltr" | "rtl"}
                />
                <FormInput
                  id="brand"
                  name="brand"
                  label={t("brandLabel")}
                  type="text"
                  placeholder={t("brandPlaceholder")}
                  required
                  direction={direction as "ltr" | "rtl"}
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

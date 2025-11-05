import React from "react";
import { X } from "lucide-react";
import { Product } from "@/app/hooks/useProducts";

interface ProductViewModalProps {
  product: Product | null;
  onClose: () => void;
}

const ProductViewModal: React.FC<ProductViewModalProps> = ({
  product,
  onClose,
}) => {
  if (!product) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg sm:rounded-2xl shadow-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Product Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
        <div className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Name</label>
            <p className="mt-1 text-gray-900">{product.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <p className="mt-1 text-gray-900">{product.description}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Price</label>
              <p className="mt-1 text-gray-900">
                ${product.price.toFixed(2)}
              </p>
            </div>
            {product.oldPrice && (
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Old Price
                </label>
                <p className="mt-1 text-gray-900">
                  ${product.oldPrice.toFixed(2)}
                </p>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Brand</label>
              <p className="mt-1 text-gray-900">{product.brand}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Category
              </label>
              <p className="mt-1 text-gray-900">{product.categoryName}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Rating
              </label>
              <p className="mt-1 text-gray-900">{product.rating} ★</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Images
              </label>
              <p className="mt-1 text-gray-900">{product.imageCount || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductViewModal;


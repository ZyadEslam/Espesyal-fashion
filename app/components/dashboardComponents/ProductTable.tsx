import React from "react";
import { Package } from "lucide-react";
import { Product } from "@/app/hooks/useProducts";
import ProductActionButtons from "./ProductActionButtons";

interface ProductTableProps {
  products: Product[];
  searchTerm: string;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onCancelDelete: () => void;
  deleting: string | null;
  deleteConfirm: string | null;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  searchTerm,
  onView,
  onEdit,
  onDelete,
  onCancelDelete,
  deleting,
  deleteConfirm,
}) => {

  if (products.length === 0) {
    return (
      <div className="p-12 text-center">
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">
          {searchTerm
            ? "No products found matching your search"
            : "No products found"}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 lg:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-4 lg:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 lg:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Brand
              </th>
              <th className="px-4 lg:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 lg:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-4 lg:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Images
              </th>
              <th className="px-4 lg:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="px-4 lg:px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">
                      {product.name}
                    </div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {product.description}
                    </div>
                  </div>
                </td>
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    {product.categoryName}
                  </span>
                </td>
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{product.brand}</span>
                </td>
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.oldPrice && (
                      <span className="text-xs text-gray-500 line-through">
                        ${product.oldPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-gray-900">
                      {product.rating}
                    </span>
                    <span className="text-yellow-400">★</span>
                  </div>
                </td>
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">
                    {product.imageCount || 0}
                  </span>
                </td>
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <ProductActionButtons
                    product={product}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onCancelDelete={onCancelDelete}
                    deleting={deleting}
                    deleteConfirm={deleteConfirm}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4 p-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white border border-gray-200 rounded-lg p-4 space-y-3"
          >
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {product.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Category:</span>
                <span className="ml-1 font-medium text-gray-900">
                  {product.categoryName}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Brand:</span>
                <span className="ml-1 font-medium text-gray-900">
                  {product.brand}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Price:</span>
                <span className="ml-1 font-medium text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.oldPrice && (
                  <span className="ml-2 text-xs text-gray-500 line-through">
                    ${product.oldPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <div>
                <span className="text-gray-500">Rating:</span>
                <span className="ml-1 font-medium text-gray-900">
                  {product.rating} ★
                </span>
              </div>
              <div>
                <span className="text-gray-500">Images:</span>
                <span className="ml-1 font-medium text-gray-900">
                  {product.imageCount || 0}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <ProductActionButtons
                product={product}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                onCancelDelete={onCancelDelete}
                deleting={deleting}
                deleteConfirm={deleteConfirm}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductTable;


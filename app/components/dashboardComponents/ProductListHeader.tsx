import React from "react";
import { Package, Search } from "lucide-react";

interface ProductListHeaderProps {
  productCount: number;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const ProductListHeader: React.FC<ProductListHeaderProps> = ({
  productCount,
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange/10 rounded-lg flex items-center justify-center">
            <Package className="w-4 h-4 sm:w-5 sm:h-5 text-orange" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Product List</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Manage all your products ({productCount} total)
            </p>
          </div>
        </div>
      </div>

      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-orange"
        />
      </div>
    </div>
  );
};

export default ProductListHeader;


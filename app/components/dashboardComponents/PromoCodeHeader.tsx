import React from "react";
import { Tag, Plus } from "lucide-react";

interface PromoCodeHeaderProps {
  onCreateClick: () => void;
}

const PromoCodeHeader: React.FC<PromoCodeHeaderProps> = ({
  onCreateClick,
}) => {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange/10 rounded-lg flex items-center justify-center">
            <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-orange" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              Promo Code Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Create and manage promotional codes
            </p>
          </div>
        </div>
        <button
          onClick={onCreateClick}
          className="flex items-center justify-center gap-2 bg-orange text-white px-4 py-2 rounded-lg hover:bg-orange/90 transition-colors text-sm sm:text-base w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span className="whitespace-nowrap">Create Promo Code</span>
        </button>
      </div>
    </div>
  );
};

export default PromoCodeHeader;


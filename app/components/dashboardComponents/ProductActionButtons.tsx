import React from "react";
import { Edit, Trash2, Eye, Loader2 } from "lucide-react";
import { Product } from "@/app/hooks/useProducts";

interface ProductActionButtonsProps {
  product: Product;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onCancelDelete: () => void;
  deleting: string | null;
  deleteConfirm: string | null;
}

const ProductActionButtons: React.FC<ProductActionButtonsProps> = ({
  product,
  onView,
  onEdit,
  onDelete,
  onCancelDelete,
  deleting,
  deleteConfirm,
}) => {
  return (
    <div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onView(product)}
          className="text-blue-600 hover:text-blue-800"
          title="View"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => onEdit(product)}
          className="text-orange hover:text-orange/80"
          title="Edit"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(product._id)}
          disabled={deleting === product._id}
          className="text-red-600 hover:text-red-800 disabled:opacity-50"
          title="Delete"
        >
          {deleting === product._id ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
      </div>
      {deleteConfirm === product._id && (
        <div className="mt-2 text-xs">
          <button
            onClick={() => onDelete(product._id)}
            className="text-red-600 hover:text-red-800 mr-2"
          >
            Confirm
          </button>
          <button
            onClick={onCancelDelete}
            className="text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductActionButtons;


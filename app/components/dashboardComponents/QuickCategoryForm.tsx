import React, { useState } from "react";
import { Plus, X, Loader2, CheckCircle2 } from "lucide-react";

interface QuickCategoryFormProps {
  onCategoryCreated: (categoryId: string, categoryName: string) => void;
  onClose: () => void;
}

const QuickCategoryForm: React.FC<QuickCategoryFormProps> = ({
  onCategoryCreated,
  onClose,
}) => {
  const [categoryName, setCategoryName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!categoryName.trim()) {
      setError("Category name is required");
      return;
    }

    setCreating(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: categoryName.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create category");
      }

      if (!result.success || !result.data) {
        throw new Error("Invalid response from server");
      }

      setSuccess(true);
      
      // Wait a moment to show success state, then call callback
      setTimeout(() => {
        onCategoryCreated(result.data._id, result.data.name);
        setCategoryName("");
        setCreating(false);
        onClose();
      }, 500);
    } catch (err) {
      console.error("Error creating category:", err);
      setError(err instanceof Error ? err.message : "Failed to create category");
      setCreating(false);
    }
  };

  return (
    <div 
      className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-[100] p-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Quick Add Category</h3>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          disabled={creating}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
        <div>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => {
              setCategoryName(e.target.value);
              setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
                handleSubmit(e);
              }
            }}
            placeholder="e.g., T-Shirts, Summer, Women..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-orange"
            disabled={creating || success}
            autoFocus
          />
          {error && (
            <p className="mt-1 text-xs text-red-600">{error}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSubmit(e);
            }}
            disabled={creating || success || !categoryName.trim()}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-orange text-white rounded-lg hover:bg-orange/90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {creating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating...</span>
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Created!</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            disabled={creating}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickCategoryForm;


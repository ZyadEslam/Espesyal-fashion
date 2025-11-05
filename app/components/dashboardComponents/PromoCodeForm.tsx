import React from "react";
import { PromoCodeState } from "@/app/types/types";
import { PromoCodeFormData } from "@/app/hooks/usePromoCodes";

interface PromoCodeFormProps {
  formData: PromoCodeFormData;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onChange: (data: PromoCodeFormData) => void;
  submitting: boolean;
  isEdit: boolean;
}

const PromoCodeForm: React.FC<PromoCodeFormProps> = ({
  formData,
  onSubmit,
  onCancel,
  onChange,
  submitting,
  isEdit,
}) => {
  const handleChange = (field: keyof PromoCodeFormData, value: string) => {
    onChange({
      ...formData,
      [field]: value,
    });
  };

  return (
    <form onSubmit={onSubmit} className="p-4 sm:p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Code *
        </label>
        <input
          type="text"
          value={formData.code}
          onChange={(e) => handleChange("code", e.target.value.toUpperCase())}
          required
          className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-orange"
          placeholder="SUMMER2024"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Discount Percentage *
        </label>
        <input
          type="number"
          min="0"
          max="100"
          step="0.01"
          value={formData.discountPercentage}
          onChange={(e) => handleChange("discountPercentage", e.target.value)}
          required
          className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-orange"
          placeholder="10"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date *
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
            required
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-orange"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date *
          </label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => handleChange("endDate", e.target.value)}
            required
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-orange"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          State *
        </label>
        <select
          value={formData.state}
          onChange={(e) =>
            handleChange("state", e.target.value as PromoCodeState)
          }
          required
          className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-orange"
        >
          <option value={PromoCodeState.INACTIVE}>Inactive</option>
          <option value={PromoCodeState.ACTIVE}>Active</option>
        </select>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 px-4 py-2 text-sm sm:text-base bg-orange text-white rounded-lg hover:bg-orange/90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </span>
          ) : isEdit ? (
            "Update"
          ) : (
            "Create"
          )}
        </button>
      </div>
    </form>
  );
};

export default PromoCodeForm;


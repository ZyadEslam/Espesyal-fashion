import { Loader2 } from "lucide-react";
import { AddressFormValues } from "./useNewAddressForm";

type TranslationFn = ReturnType<typeof import("next-intl").useTranslations>;

interface NewAddressModalFormProps {
  error: string | null;
  formValues: AddressFormValues;
  isSubmitDisabled: boolean;
  labelClassName: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onContentMouseDown?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  submitting: boolean;
  t: TranslationFn;
  tForm: TranslationFn;
  tSubmit: TranslationFn;
}

const NewAddressModalForm = ({
  error,
  formValues,
  isSubmitDisabled,
  labelClassName,
  onChange,
  onClose,
  onSubmit,
  submitting,
  t,
  tForm,
  tSubmit,
  onContentMouseDown,
}: NewAddressModalFormProps) => {
  return (
    <div
      className="relative mt-4 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
      onMouseDown={onContentMouseDown}
    >
      {submitting && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 text-gray-700">
            <Loader2 className="h-8 w-8 animate-spin text-orange" />
            <p className="text-sm font-medium">{t("creatingAddress")}</p>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 text-gray-400 transition hover:text-gray-600"
        aria-label="Close modal"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div className="mb-6">
        <p className="text-sm font-semibold uppercase text-orange">{t("addNew")}</p>
        <h2 className="text-2xl font-bold text-gray-900">{t("title")}</h2>
        <p className="text-sm text-gray-500">{t("address")}</p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label htmlFor="name" className={labelClassName}>
            {tForm("fullNameRequired")}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="address-form-input"
            placeholder={tForm("fullNamePlaceholder")}
            value={formValues.name}
            onChange={onChange}
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className={labelClassName}>
            {tForm("phoneNumberRequired")}
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="address-form-input"
            placeholder={tForm("phoneNumberPlaceholder")}
            value={formValues.phone}
            onChange={onChange}
            required
          />
        </div>

        <div>
          <label htmlFor="address" className={labelClassName}>
            {tForm("streetAddressRequired")}
          </label>
          <input
            id="address"
            name="address"
            type="text"
            className="address-form-input"
            placeholder={tForm("streetAddressPlaceholder")}
            value={formValues.address}
            onChange={onChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="city" className={labelClassName}>
              {tForm("cityRequired")}
            </label>
            <input
              id="city"
              name="city"
              type="text"
              className="address-form-input"
              placeholder={tForm("cityPlaceholder")}
              value={formValues.city}
              onChange={onChange}
              required
            />
          </div>
          <div>
            <label htmlFor="state" className={labelClassName}>
              {tForm("stateRequired")}
            </label>
            <input
              id="state"
              name="state"
              type="text"
              className="address-form-input"
              placeholder={tForm("statePlaceholder")}
              value={formValues.state}
              onChange={onChange}
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="rounded-lg bg-orange px-6 py-2 text-sm font-semibold text-white transition hover:bg-orange/90 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {submitting ? tSubmit("saving") : tSubmit("saveAddress")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewAddressModalForm;


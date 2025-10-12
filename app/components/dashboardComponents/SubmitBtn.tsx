import React from "react";

const SubmitBtn = React.memo(() => {
  return (
    <div className="mt-4">
      <input
        type="submit"
        className="px-6 py-2 bg-orange text-white font-medium rounded-md hover:bg-orange/90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors cursor-pointer"
        value="ADD PRODUCT"
      />
    </div>
  );
});

SubmitBtn.displayName = "SubmitButton";

export default SubmitBtn;

"use client";
import CartProvider from "./CartProvider";
import WishlistProvider from "./WishlistProvider";
import ProductsProvider from "./ProductsProvider";

interface AppProvidersProps {
  children: React.ReactNode;
}

const CtxProviders = ({ children }: AppProvidersProps) => {
  return (
    <ProductsProvider>
      <CartProvider>
        <WishlistProvider>{children}</WishlistProvider>
      </CartProvider>
    </ProductsProvider>
  );
};

export default CtxProviders;

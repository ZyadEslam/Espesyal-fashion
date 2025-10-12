import { StaticImageData } from "next/image";

export interface ProductCardProps {
  _id?: string;
  name: string;
  description: string;
  rating: number;
  price: number;
  oldPrice?: number;
  discount?: string;
  category?: string;
  brand?: string;
  color?: string;
  quantity?: number;
  quantityInCart?: number;
  imgSrc: StaticImageData[];
}

export interface TableRowProps {
  product: ProductCardProps;
}

export interface AddressProps {
  _id: string;
  name: string;
  phone: string;
  pinCode: string;
  address: string;
  city: string;
  state: string;
}

// export interface ShippingFromProps {
//   handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void;
//   formData: {
//     name: string;
//     phone: string;
//     pinCode: string;
//     address: string;
//     city: string;
//     state: string;
//   };
// }

"use client";
import React from "react";
import { motion } from "framer-motion";
import { assets } from "@/public/assets/assets";
import Image from "next/image";
import PrimaryBtn from "../PrimaryBtn";

const BestSellersSection = () => {
  const bestSellers = [
    {
      id: 1,
      name: "Premium Fashion Set",
      price: 129,
      originalPrice: 179,
      image: assets.girl1,
      rating: 4.9,
      sales: 2500,
      badge: "Best Seller",
    },
    {
      id: 2,
      name: "Elegant Evening Wear",
      price: 89,
      originalPrice: 120,
      image: assets.girl3,
      rating: 4.8,
      sales: 1800,
      badge: "Trending",
    },
    {
      id: 3,
      name: "Casual Chic Collection",
      price: 79,
      originalPrice: 99,
      image: assets.girl8,
      rating: 4.7,
      sales: 2200,
      badge: "Popular",
    },
    {
      id: 4,
      name: "Designer Accessories",
      price: 45,
      originalPrice: 65,
      image: assets.girl6,
      rating: 4.9,
      sales: 1500,
      badge: "Hot",
    },
  ];

  return (
    <section className="py-12 bg-gradient-to-br from-secondaryLight to-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center bg-orange/10 text-orange px-4 py-2 rounded-full text-sm font-semibold mb-4">
            🔥 BEST SELLERS
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Customer <span className="text-orange">Favorites</span>
          </h2>
          <p className="text-foreground/70 text-base max-w-2xl mx-auto">
            Discover our most loved products that customers can&apos;t get enough of
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {bestSellers.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* Product Image */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />

                {/* Badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-gradient-to-r from-orange to-primary text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    {product.badge}
                  </span>
                </div>

                {/* Discount Badge */}
                <div className="absolute top-3 right-3">
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    -
                    {Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100
                    )}
                    %
                  </span>
                </div>

                {/* Quick View Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <PrimaryBtn
                    text="Quick View"
                    href={`/product/${product.id}`}
                    customClass="px-6 py-2 rounded-full text-sm font-semibold bg-orange text-gray-900  hover:text-white"
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5">
                <h3 className="font-bold text-base text-foreground mb-2 group-hover:text-orange transition-colors">
                  {product.name}
                </h3>

                {/* Rating */}
                {/* <div className="flex items-center mb-3">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-sm">
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-foreground/60 ml-2">
                    ({product.rating})
                  </span>
                </div> */}

                {/* Price */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-foreground">
                      ${product.price}
                    </span>
                    <span className="text-base text-foreground/50 line-through">
                      ${product.originalPrice}
                    </span>
                  </div>
                  {/* <span className="text-sm text-foreground/60">
                    {product.sales} sold
                  </span> */}
                </div>

                {/* Add to Cart Button */}
                <PrimaryBtn
                  text="Add to Cart"
                  href={`/product/${product.id}`}
                  customClass="w-full p-2 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-orange transition-colors duration-300"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <PrimaryBtn
            text="View All Best Sellers"
            href="/shop?filter=bestsellers"
            customClass="px-8 py-4 rounded-full text-lg font-semibold bg-gradient-to-r from-orange to-primary text-white hover:from-orange hover:to-orange shadow-lg hover:shadow-xl transition-all duration-300"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default BestSellersSection;

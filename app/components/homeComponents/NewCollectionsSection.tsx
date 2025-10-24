"use client";
import React from "react";
import { motion } from "framer-motion";
import { assets } from "@/public/assets/assets";
import Image from "next/image";
import PrimaryBtn from "../PrimaryBtn";

const NewCollectionsSection = () => {
  const newCollections = [
    {
      id: 1,
      name: "Spring Collection 2024",
      description: "Fresh designs for the new season",
      image: assets.girl2,
      items: 45,
      discount: 25,
      badge: "NEW",
    },
    {
      id: 2,
      name: "Minimalist Essentials",
      description: "Clean, simple, and timeless pieces",
      image: assets.girl4,
      items: 32,
      discount: 20,
      badge: "TRENDING",
    },
    {
      id: 3,
      name: "Boho Chic",
      description: "Free-spirited and artistic styles",
      image: assets.girl5,
      items: 28,
      discount: 30,
      badge: "LIMITED",
    },
  ];

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            ✨ NEW COLLECTIONS
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Fresh <span className="text-primary">Arrivals</span>
          </h2>
          <p className="text-foreground/70 text-base max-w-2xl mx-auto">
            Be the first to discover our latest collections and stay ahead of
            the fashion curve
          </p>
        </motion.div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {newCollections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Collection Image */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={collection.image}
                  alt={collection.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    {collection.badge}
                  </span>
                </div>

                {/* Discount Badge */}
                <div className="absolute top-4 right-4">
                  <span className="bg-orange text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{collection.discount}% OFF
                  </span>
                </div>

                {/* Collection Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-orange transition-colors">
                    {collection.name}
                  </h3>
                  <p className="text-secondaryLight mb-3 text-sm">
                    {collection.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondaryLight">
                      {collection.items} items available
                    </span>
                    <PrimaryBtn
                      text="Explore Collection"
                      href={`/shop?collection=${collection.name
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      customClass="px-4 py-2 rounded-full text-sm font-semibold bg-orange text-gray-900 hover:text-white transition-colors duration-300"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Featured Collection Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary  to-primary/70 shadow-2xl"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-primary/30 to-transparent rounded-full blur-3xl"></div>
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 items-center  p-6 lg:p-8">
            {/* Content */}
            <div className="text-secondary ">
              <div className="inline-flex items-center bg-gradient-to-r from-orange to-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
                🌟 FEATURED COLLECTION
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold mb-4  ">
                Premium <span className="text-orange">Luxury Line</span>
              </h3>
              <p className="text-secondaryLight text-base max-w-100 mb-6">
                Experience the finest in fashion with our exclusive luxury
                collection. Handcrafted pieces that define elegance and
                sophistication.
              </p>
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                <PrimaryBtn
                  text="Shop Luxury Collection"
                  href="/shop?collection=luxury"
                  customClass="w-fit px-4 lg:px-8 py-4 rounded-full lg:text-lg font-semibold bg-gradient-to-r from-orange to-primary text-white hover:from-orange hover:to-orange shadow-lg hover:shadow-xl transition-all duration-300"
                />
                <button className="text-secondaryLight hover:text-orange transition-colors duration-300 font-medium text-base">
                  Learn More →
                </button>
              </div>
            </div>

            {/* Image */}
            <div className="relative h-64 lg:h-80">
              <Image
                src={assets.girl7}
                alt="Luxury Collection"
                fill
                className="object-cover rounded-2xl"
              />
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-orange to-primary text-white px-6 py-3 rounded-xl shadow-2xl font-bold text-lg transform -rotate-12">
                EXCLUSIVE
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewCollectionsSection;

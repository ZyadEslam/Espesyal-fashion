"use client";
import React from "react";
import Image from "next/image";
import { StaticImageData } from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface FeaturedProductProps {
  title: string;
  description: string;
  imageSrc: StaticImageData;
  alt?: string;
}

const FeaturedProductCard = ({
  title,
  description,
  imageSrc,
  alt = "Featured product",
}: FeaturedProductProps) => {
  const router = useRouter();

  const handleExploreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push("/shop");
  };

  return (
    <Link
      className="relative md:w-[28%] sm:w-[100%] h-[400px] overflow-hidden group cursor-pointer"
      href={"/shop"}
    >
      <div className="relative w-full h-full">
        <Image
          src={imageSrc}
          alt={alt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 28vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          // loading="lazy"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-black/5 to-black/2 transition-all duration-300 group-hover:from-black/15 group-hover:via-black/15 group-hover:to-black/15"></div>

      <div className="absolute bottom-0 w-full left-0 p-4 transform transition-transform duration-300 group-hover:-translate-y-2">
        <h3 className="text-white text-2xl font-normal mb-1">{title}</h3>
        <p className="text-white text-sm mb-3 w-[70%] line-clamp-2">
          {description}
        </p>
        <div className="flex items-center justify-between">
          <button
            onClick={handleExploreClick}
            className="bg-orange text-white px-4 py-1.5 rounded-sm hover:bg-orange/90 transition-colors"
            suppressHydrationWarning
          >
            Explore more
          </button>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedProductCard;

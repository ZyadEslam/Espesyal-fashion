"use client";
import React from "react";
import Image from "next/image";
import { assets } from "@/public/assets/assets";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();

  return (
    <>
      {pathname !== "/dashboard" && (
        <footer className="mt-18">
          <div className="flex justify-between gap-0 text-[14px] sm:gap-8 md:flex-row sm:flex-col px-[8.5%]">
            <div className="md:w-[42%] sm:w-[90%] flex flex-col gap-4">
              <Image src={assets.logo} alt="logo"  />
              <p className="text-gray-500">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry&apos;s standard
                dummy text ever since the 1500s, when an unknown printer took a
                galley of type and scrambled it to make a type specimen book.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="normal-black">Company</h3>
              <ul className="footer-listed-items">
                <Link href="/">Home</Link>
                <Link href="/about">About us</Link>
                <Link href="/contact">Contact us</Link>
                <Link href="/home">Privacy Policy</Link>
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="normal-black">Get in touch</h3>
              <ul className="footer-listed-items">
                <li>+201040431147</li>
                <li>+201144094269</li>
                <li>Contact@ zyadelbehiry@gmail.com</li>
              </ul>
            </div>
          </div>
          <div className="text-gray-700 text-[13px] text-center border-t border-gray-300 py-4 mt-10">
            Copyright 2025 © Zyad Elbehiry All Right Reserved.
          </div>
        </footer>
      )}
    </>
  );
};

export default Footer;

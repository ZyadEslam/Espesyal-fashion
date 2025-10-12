import React from 'react'
import {motion} from "framer-motion"
import Image from 'next/image'
const ImageSection = () => {
  return (
    <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="flex flex-col items-center justify-center space-y-6"
  >
    <div className="relative w-full max-w-md">
      <Image
        src="/assets/my_location_image.svg"
        alt="Shipping Address"
        width={300}
        height={300}
        className="w-full h-auto"
      />
    </div>
  </motion.div>  )
}

export default ImageSection
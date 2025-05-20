import watch from "./images/watch1.png"
import AOS from "aos";
import "aos/dist/aos.css";
import {useEffect } from "react";

const Collections = () => {

 useEffect(() => {
    AOS.init({
      duration: 500,
      once: false,
      mirror: false,
    });
  }, []);

  const collections = [
    { name: "Men's Collection", image: watch },
    { name: "Women's Collection", image: watch },
    { name: "Smart Collection", image: watch },
  ]

  return (
    <section className="w-full py-5 container mx-auto">
      <div data-aos="fade-up" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {collections.map((collection, index) => (
          <div key={index} className="relative group overflow-hidden bg-[#0f1420] rounded-lg cursor-pointer">
            <img
              src={collection.image || "/placeholder.svg"}
              alt={collection.name}
              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-xl font-semibold mb-1">{collection.name}</h3>
              <p className="text-sm text-[#B1976B] mb-3">Shop Now →</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Collections

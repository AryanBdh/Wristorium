import Button from "./ui/Button";
import Input from "./ui/Input";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const Newsletter = () => {
  useEffect(() => {
    AOS.init({
      duration: 300,
      once: false,
      mirror: false,
    });
  }, []);

  return (
    <>
      <section className="py-16 border-b border-gray-800 bg-[#0F172A]">
        <div data-aos="fade-up" className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Subscribe to our newsletter to receive exclusive offers, new product
            announcements, and curated content.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Your email address"
              className="bg-[#1a1f2c] border-gray-700 rounded-none focus:border-[#d4af37] focus:ring-[#d4af37]"
            />
            <Button className="bg-[#d4af37] hover:bg-[#b8973a] text-black rounded-none">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Newsletter;

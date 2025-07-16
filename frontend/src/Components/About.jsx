import Header from "../Header"
import Button from "../ui/Button"
import craft from "../images/craftsmanship.jpg"
import { Link } from "react-router-dom"

const About = () => {
  const values = [
    {
      title: "Craftsmanship",
      description:
        "Every timepiece is meticulously handcrafted by master artisans, blending traditional Nepali artistry with modern techniques.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#d4af37]"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      ),
    },
    {
      title: "Quality",
      description:
        "We use only the finest materials sourced globally and locally, maintaining the highest standards in every detail.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#d4af37]"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      ),
    },
    {
      title: "Innovation",
      description:
        "Blending traditional watchmaking with modern technology to create exceptional timepieces for the contemporary world.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#d4af37]"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
          <path d="M2 17l10 5 10-5"></path>
          <path d="M2 12l10 5 10-5"></path>
        </svg>
      ),
    },
  ]

  return (
    <>
      <Header />
      <div className="bg-[#162337] text-white">
        {/* Hero Section */}
        <section className=" bg-[#0F172A] relative h-[50vh] overflow-hidden">
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center max-w-3xl px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">About WHRISTORIUM</h1>
              <p className="text-lg md:text-xl text-gray-200">
                Crafting exceptional timepieces from the heart of Nepal
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-[#d4af37] text-sm uppercase tracking-wider">OUR STORY</span>
            <h2 className="text-3xl font-bold mt-4 mb-8">The Essence of Nepali Horology</h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              Founded in the vibrant landscape of Nepal, WHRISTORIUM has embarked on a journey to redefine luxury
              watchmaking. We are deeply inspired by Nepal's rich cultural heritage and its tradition of intricate
              craftsmanship, infusing these elements into every timepiece we create.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              Each watch is a testament to our dedication to excellence, representing the perfect fusion of artistry,
              precision, and the unique spirit of Nepal. We aim to bring the beauty and resilience of the Himalayas to
              your wrist.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-[#0F172A] border-y border-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-[#d4af37] text-sm uppercase tracking-wider">OUR VALUES</span>
              <h2 className="text-3xl font-bold mt-4">What We Stand For</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {values.map((value, index) => (
                <div key={index} className="bg-[#162337] rounded-lg p-6 text-center">
                  <div className="flex justify-center mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <span className="text-[#d4af37] text-sm uppercase tracking-wider">OUR MISSION</span>
              <h2 className="text-3xl font-bold mt-4 mb-6">Crafting Legacies, One Moment at a Time</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                At WHRISTORIUM, we believe that time is precious. Our mission is to create timepieces that not only
                measure moments but celebrate them, crafted to be treasured for generations. We are committed to
                sustainable practices and supporting local communities in Nepal.
              </p>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Every watch tells a story of dedication, precision, and the timeless art of watchmaking, infused with
                the spirit of the Himalayas.
              </p>
              <Button className="bg-[#d4af37] hover:bg-[#b8973a] text-black rounded-none px-8 py-3">
                Explore Our Collection
              </Button>
            </div>
            <div className="relative">
              <img
                src={craft}
                alt="WHRISTORIUM Craftsmanship"
                className="w-full rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-[#0F172A] border-t border-gray-800">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Experience WHRISTORIUM</h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Discover the artistry and precision that goes into every timepiece. Explore our collections and find your
              perfect watch.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/shop"
                >
              <Button className="bg-[#d4af37] hover:bg-[#b8973a] text-black rounded-none px-8 py-3">Shop Now</Button>
              </Link>
              <Button
                variant="outline"
                className="border-gray-600 hover:bg-gray-800 rounded-none px-8 py-3 bg-transparent"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default About

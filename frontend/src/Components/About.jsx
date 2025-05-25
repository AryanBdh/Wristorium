import Header from "../Header";
import Button from "../ui/Button";
import bgimg from "../images/bgimg.png"; // Assuming you have a background image

const About = () => {
  const milestones = [
    {
      year: "1952",
      title: "Foundation",
      description:
        "CHRONOLUXE was founded by master watchmaker Henri Dubois in Geneva, Switzerland.",
    },
    {
      year: "1967",
      title: "Innovation",
      description:
        "Introduced our first automatic movement, revolutionizing precision timekeeping.",
    },
    {
      year: "1985",
      title: "Global Expansion",
      description:
        "Opened flagship stores in New York, London, and Tokyo, establishing worldwide presence.",
    },
    {
      year: "2003",
      title: "Digital Era",
      description:
        "Launched our first smart timepiece, blending traditional craftsmanship with modern technology.",
    },
    {
      year: "2020",
      title: "Sustainability",
      description:
        "Committed to carbon-neutral production and ethical sourcing of all materials.",
    },
  ];

  const values = [
    {
      title: "Craftsmanship",
      description:
        "Every timepiece is meticulously handcrafted by our master artisans using traditional techniques passed down through generations.",
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
    {
      title: "Innovation",
      description:
        "We continuously push the boundaries of horological engineering while respecting the timeless principles of watchmaking.",
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
          <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
          <line x1="9" y1="9" x2="9.01" y2="9"></line>
          <line x1="15" y1="9" x2="15.01" y2="9"></line>
        </svg>
      ),
    },
    {
      title: "Excellence",
      description:
        "Our commitment to excellence is reflected in every detail, from the finest materials to the most precise movements.",
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
      title: "Heritage",
      description:
        "With over 70 years of watchmaking heritage, we honor our past while embracing the future of timekeeping.",
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
  ];

  const team = [
    {
      name: "Henri Dubois III",
      position: "Master Watchmaker & CEO",
      description:
        "Third-generation watchmaker carrying on the family tradition of excellence.",
      image: "https://via.placeholder.com/300x400",
    },
    {
      name: "Isabella Chen",
      position: "Head of Design",
      description:
        "Award-winning designer with 15 years of experience in luxury timepiece design.",
      image: "https://via.placeholder.com/300x400",
    },
    {
      name: "Marcus Weber",
      position: "Chief Innovation Officer",
      description:
        "Leading our technological advancement while preserving traditional craftsmanship.",
      image: "https://via.placeholder.com/300x400",
    },
  ];

  return (
    <>
      <Header />
      <div className="bg-[#162337] text-white">
        {/* Hero Section */}
        <section className="relative h-[60vh] overflow-hidden">
          <img
            src={bgimg}
            alt="CHRONOLUXE Workshop"
            className="object-cover w-full h-full brightness-50"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center max-w-4xl px-4">
              <h1 className="text-5xl md:text-7xl font-bold mb-6">Our Story</h1>
              <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
                For over seven decades, CHRONOLUXE has been crafting exceptional
                timepieces that embody the perfect fusion of traditional Swiss
                watchmaking and innovative design.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-20 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-[#d4af37] text-sm uppercase tracking-wider">
              OUR MISSION
            </span>
            <h2 className="text-4xl font-bold mt-4 mb-8">
              Timeless Excellence
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              At CHRONOLUXE, we believe that time is the most precious gift we
              possess. Our mission is to create timepieces that not only measure
              moments but celebrate them. Each watch we craft is a testament to
              our unwavering commitment to excellence, precision, and artistry.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              We honor the rich heritage of Swiss watchmaking while embracing
              innovation to create timepieces that will be treasured for
              generations to come.
            </p>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 bg-[#0c1018] border-y border-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="text-[#d4af37] text-sm uppercase tracking-wider">
                OUR JOURNEY
              </span>
              <h2 className="text-4xl font-bold mt-4">Milestones in Time</h2>
            </div>

            <div className="max-w-4xl mx-auto">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row items-start mb-12 last:mb-0"
                >
                  <div className="flex-shrink-0 w-full md:w-32 mb-4 md:mb-0">
                    <div className="text-3xl font-bold text-[#d4af37]">
                      {milestone.year}
                    </div>
                  </div>
                  <div className="flex-1 md:ml-8">
                    <div className="bg-[#0f1420] rounded-lg p-6">
                      <h3 className="text-xl font-semibold mb-3">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-300">{milestone.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-[#d4af37] text-sm uppercase tracking-wider">
              OUR VALUES
            </span>
            <h2 className="text-4xl font-bold mt-4">What Drives Us</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <div key={index} className="bg-[#0f1420] rounded-lg p-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">{value.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="py-20 bg-[#0c1018] border-y border-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="text-[#d4af37] text-sm uppercase tracking-wider">
                OUR TEAM
              </span>
              <h2 className="text-4xl font-bold mt-4">Master Craftspeople</h2>
              <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
                Meet the passionate individuals who bring our timepieces to life
                through their expertise and dedication.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="bg-[#0f1420] rounded-lg overflow-hidden"
                >
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-1">
                      {member.name}
                    </h3>
                    <p className="text-[#d4af37] text-sm mb-3">
                      {member.position}
                    </p>
                    <p className="text-gray-300 text-sm">
                      {member.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Workshop */}
        <section className="py-20 container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <span className="text-[#d4af37] text-sm uppercase tracking-wider">
                OUR WORKSHOP
              </span>
              <h2 className="text-4xl font-bold mt-4 mb-6">
                Where Magic Happens
              </h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Our state-of-the-art workshop in Geneva combines traditional
                Swiss watchmaking techniques with modern precision tools. Every
                timepiece is assembled by hand, ensuring the highest quality and
                attention to detail.
              </p>
              <p className="text-gray-300 mb-8 leading-relaxed">
                From the initial design sketches to the final quality
                inspection, each watch undergoes over 200 individual processes,
                taking an average of 6 months to complete.
              </p>
              <Button className="bg-[#d4af37] hover:bg-[#b8973a] text-black rounded-none px-8 py-6">
                Visit Our Workshop
              </Button>
            </div>
            <div className="relative">
              <img
                src="https://via.placeholder.com/600x500"
                alt="CHRONOLUXE Workshop"
                className="w-full rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-lg"></div>
            </div>
          </div>
        </section>

        {/* Sustainability */}
        <section className="py-20 bg-[#0c1018] border-y border-gray-800">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <span className="text-[#d4af37] text-sm uppercase tracking-wider">
                SUSTAINABILITY
              </span>
              <h2 className="text-4xl font-bold mt-4 mb-8">
                Responsible Luxury
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-8">
                We are committed to creating luxury timepieces while minimizing
                our environmental impact. Our sustainability initiatives include
                carbon-neutral production, ethical sourcing of materials, and
                supporting local communities.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-[#1a1f2c] rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#d4af37]"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">Ethical Sourcing</h3>
                  <p className="text-sm text-gray-400">
                    All materials sourced from certified ethical suppliers
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-[#1a1f2c] rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#d4af37]"
                    >
                      <path d="M3 6h18l-2 13H5L3 6z"></path>
                      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">Carbon Neutral</h3>
                  <p className="text-sm text-gray-400">
                    100% carbon-neutral production since 2020
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-[#1a1f2c] rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#d4af37]"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M16 12l-4-4-4 4"></path>
                      <path d="M12 16V8"></path>
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">Community Support</h3>
                  <p className="text-sm text-gray-400">
                    Supporting local artisan communities worldwide
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Experience CHRONOLUXE</h2>
            <p className="text-lg text-gray-300 mb-8">
              Discover the artistry and precision that goes into every
              CHRONOLUXE timepiece. Visit our flagship store or explore our
              collections online.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-[#d4af37] hover:bg-[#b8973a] text-black rounded-none px-8 py-6">
                Explore Collections
              </Button>
              <Button
                variant="outline"
                className="border-gray-600 hover:bg-gray-800 rounded-none px-8 py-6"
              >
                Find a Store
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;

import bgimg from "./images/bgimg.png"

const Collections = () => {
  const collections = [
    { name: "Men's Collection", image: bgimg },
    { name: "Women's Collection", image: bgimg },
    { name: "Smart Collection", image: bgimg },
  ]

  return (
    <section className="py-5 container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {collections.map((collection, index) => (
          <div key={index} className="relative group overflow-hidden bg-[#0f1420] rounded-lg cursor-pointer">
            <img
              src={collection.image || "/placeholder.svg"}
              alt={collection.name}
              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-xl font-semibold mb-1">{collection.name}</h3>
              <p className="text-sm text-gray-300 mb-3">Shop Now →</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Collections

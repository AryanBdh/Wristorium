"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X, Plus, Minus, Save, ArrowLeft } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import toast from "react-hot-toast";

const AddProduct = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "men",
    brand: "WHRISTORIUM",
    features: [""],
    images: [],
    isNew: false,
    isSale: false,
    stock: "",
    sku: "",
    weight: "",
    dimensions: {
      diameter: "",
      thickness: "",
      lugWidth: "",
    },
    materials: {
      case: "",
      crystal: "",
      strap: "",
      movement: "",
    },
    specifications: {
      waterResistance: "",
      powerReserve: "",
      functions: [""],
    },
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const categories = [
    { value: "men", label: "Men's Watches" },
    { value: "women", label: "Women's Watches" },
    { value: "smart", label: "Smart Watches" },
  ];

  

  const handleInputChange = (field, value) => {
    setProductData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedInputChange = (section, field, value) => {
    setProductData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleArrayInputChange = (field, index, value) => {
    setProductData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (field) => {
    setProductData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (field, index) => {
    setProductData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = (files) => {
    const newFiles = Array.from(files).slice(0, 6 - imageFiles.length); // Max 6 images
    setImageFiles((prev) => [...prev, ...newFiles]);

    // Create preview URLs
    const newImageUrls = newFiles.map((file) => URL.createObjectURL(file));
    setProductData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImageUrls],
    }));
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setProductData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  const validateForm = () => {
    const required = ["name", "description", "price", "stock"];
    const missing = required.filter((field) => !productData[field]);

    if (missing.length > 0) {
      toast.error(`Please fill in required fields: ${missing.join(", ")}`);
      return false;
    }

    if (productData.features.filter((f) => f.trim()).length === 0) {
      toast.error("Please add at least one feature");
      return false;
    }

    if (productData.images.length === 0) {
      toast.error("Please add at least one product image");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Here you would typically upload images and save product data to your backend
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call

      toast.success("Product added successfully!", {
        icon: "✅",
        id: "product-add-success",
      });

      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to add product. Please try again.", {
        id: "product-add-error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-[#0a0e17] text-white min-h-screen">
        {/* Header */}
        <div className="bg-[#0f1420] border-b border-gray-800">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => navigate("/dashboard")}
                  variant="outline"
                  className="border-gray-600"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
                <div>
                  <h1 className="text-3xl font-bold">Add New Product</h1>
                  <p className="text-gray-400">
                    Create a new timepiece for WHRISTORIUM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
            {/* Basic Information */}
            <div className="bg-[#0f1420] rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Basic Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Product Name <span className="text-red-400">*</span>
                  </label>
                  <Input
                    value={productData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., Sovereign Classic"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">SKU</label>
                  <Input
                    value={productData.sku}
                    onChange={(e) => handleInputChange("sku", e.target.value)}
                    placeholder="e.g., WH-SC-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={productData.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    className="w-full bg-[#1a1f2c] border border-gray-700 rounded px-3 py-2"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Price <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="number"
                    value={productData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="2450"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Original Price (if on sale)
                  </label>
                  <Input
                    type="number"
                    value={productData.originalPrice}
                    onChange={(e) =>
                      handleInputChange("originalPrice", e.target.value)
                    }
                    placeholder="2800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Stock Quantity <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="number"
                    value={productData.stock}
                    onChange={(e) => handleInputChange("stock", e.target.value)}
                    placeholder="25"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Weight (grams)
                  </label>
                  <Input
                    type="number"
                    value={productData.weight}
                    onChange={(e) =>
                      handleInputChange("weight", e.target.value)
                    }
                    placeholder="165"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium mb-2">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={productData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={4}
                  className="w-full bg-[#1a1f2c] border border-gray-700 rounded px-3 py-2 resize-none"
                  placeholder="Detailed description of the timepiece..."
                  required
                />
              </div>

              {/* Status Flags */}
              <div className="mt-6 flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={productData.isNew}
                    onChange={(e) =>
                      handleInputChange("isNew", e.target.checked)
                    }
                    className="rounded border-gray-600 bg-[#1a1f2c] text-[#d4af37] focus:ring-[#d4af37]"
                  />
                  <span className="text-sm">Mark as New</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={productData.isSale}
                    onChange={(e) =>
                      handleInputChange("isSale", e.target.checked)
                    }
                    className="rounded border-gray-600 bg-[#1a1f2c] text-[#d4af37] focus:ring-[#d4af37]"
                  />
                  <span className="text-sm">Mark as Sale</span>
                </label>
              </div>
            </div>

            {/* Product Images */}
            <div className="bg-[#0f1420] rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Product Images</h2>

              {/* Image Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? "border-[#d4af37] bg-[#d4af37]/10"
                    : "border-gray-600 hover:border-gray-500"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg mb-2">Drag and drop images here</p>
                <p className="text-sm text-gray-400 mb-4">
                  or click to browse (Max 6 images)
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="hidden"
                  id="image-upload"
                />
                <Button
                  type="button"
                  onClick={() =>
                    document.getElementById("image-upload").click()
                  }
                  variant="outline"
                  className="border-gray-600"
                >
                  Choose Files
                </Button>
              </div>

              {/* Image Previews */}
              {productData.images.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium mb-4">Uploaded Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {productData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Product ${index + 1}`}
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 bg-[#d4af37] text-black text-xs px-2 py-1 rounded">
                            Main
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="bg-[#0f1420] rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Features</h2>

              <div className="space-y-3">
                {productData.features.map((feature, index) => (
                  <div key={index} className="flex gap-3">
                    <Input
                      value={feature}
                      onChange={(e) =>
                        handleArrayInputChange(
                          "features",
                          index,
                          e.target.value
                        )
                      }
                      placeholder="e.g., Automatic Movement"
                      className="flex-1"
                    />
                    {productData.features.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeArrayItem("features", index)}
                        variant="outline"
                        size="sm"
                        className="border-red-600 text-red-400 hover:bg-red-900/20"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() => addArrayItem("features")}
                  variant="outline"
                  size="sm"
                  className="border-gray-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Feature
                </Button>
              </div>
            </div>

            {/* Dimensions */}
            <div className="bg-[#0f1420] rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Dimensions</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Case Diameter (mm)
                  </label>
                  <Input
                    type="number"
                    value={productData.dimensions.diameter}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "dimensions",
                        "diameter",
                        e.target.value
                      )
                    }
                    placeholder="42"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Case Thickness (mm)
                  </label>
                  <Input
                    type="number"
                    value={productData.dimensions.thickness}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "dimensions",
                        "thickness",
                        e.target.value
                      )
                    }
                    placeholder="12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Lug Width (mm)
                  </label>
                  <Input
                    type="number"
                    value={productData.dimensions.lugWidth}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "dimensions",
                        "lugWidth",
                        e.target.value
                      )
                    }
                    placeholder="22"
                  />
                </div>
              </div>
            </div>

            {/* Materials */}
            <div className="bg-[#0f1420] rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Materials</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Case Material
                  </label>
                  <Input
                    value={productData.materials.case}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "materials",
                        "case",
                        e.target.value
                      )
                    }
                    placeholder="316L Stainless Steel"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Crystal
                  </label>
                  <Input
                    value={productData.materials.crystal}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "materials",
                        "crystal",
                        e.target.value
                      )
                    }
                    placeholder="Sapphire Crystal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Strap Material
                  </label>
                  <Input
                    value={productData.materials.strap}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "materials",
                        "strap",
                        e.target.value
                      )
                    }
                    placeholder="Genuine Leather"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Movement
                  </label>
                  <Input
                    value={productData.materials.movement}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "materials",
                        "movement",
                        e.target.value
                      )
                    }
                    placeholder="Swiss Automatic"
                  />
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-[#0f1420] rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Specifications</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Water Resistance
                  </label>
                  <Input
                    value={productData.specifications.waterResistance}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "specifications",
                        "waterResistance",
                        e.target.value
                      )
                    }
                    placeholder="100m / 330ft"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Power Reserve
                  </label>
                  <Input
                    value={productData.specifications.powerReserve}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "specifications",
                        "powerReserve",
                        e.target.value
                      )
                    }
                    placeholder="42 Hours"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">
                  Functions
                </label>
                <div className="space-y-3">
                  {productData.specifications.functions.map((func, index) => (
                    <div key={index} className="flex gap-3">
                      <Input
                        value={func}
                        onChange={(e) =>
                          handleArrayInputChange(
                            "specifications.functions",
                            index,
                            e.target.value
                          )
                        }
                        placeholder="e.g., Date Display"
                        className="flex-1"
                      />
                      {productData.specifications.functions.length > 1 && (
                        <Button
                          type="button"
                          onClick={() =>
                            removeArrayItem("specifications.functions", index)
                          }
                          variant="outline"
                          size="sm"
                          className="border-red-600 text-red-400 hover:bg-red-900/20"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() => addArrayItem("specifications.functions")}
                    variant="outline"
                    size="sm"
                    className="border-gray-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Function
                  </Button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                onClick={() => navigate("/dashboard")}
                variant="outline"
                className="border-gray-600"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#d4af37] hover:bg-[#b8973a] text-black px-8"
              >
                {isSubmitting ? (
                  "Adding Product..."
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Add Product
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddProduct;

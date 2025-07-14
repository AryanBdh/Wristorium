"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Upload,
  X,
  Plus,
  Minus,
  Save,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import toast from "react-hot-toast";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

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
    weight: "",
    sku: "",
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
  const [existingImages, setExistingImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const categories = [
    { value: "men", label: "Men's Watches" },
    { value: "women", label: "Women's Watches" },
    { value: "smart", label: "Smart Watches" },
  ];

  // Fetch product data on component mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(
          `http://localhost:5000/api/products/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const product = await response.json();

        // Populate form with existing product data
        setProductData({
          name: product.name || "",
          description: product.description || "",
          price: product.price?.toString() || "",
          originalPrice: product.originalPrice?.toString() || "",
          category: product.category || "men",
          brand: product.brand || "WHRISTORIUM",
          features: product.features?.length > 0 ? product.features : [""],
          images: product.images || [],
          isNew: product.isNew || false,
          isSale: product.isSale || false,
          stock: product.stock?.toString() || "",
          weight: product.weight?.toString() || "",
          sku: product.sku || "",
          dimensions: {
            diameter: product.dimensions?.diameter?.toString() || "",
            thickness: product.dimensions?.thickness?.toString() || "",
            lugWidth: product.dimensions?.lugWidth?.toString() || "",
          },
          materials: {
            case: product.materials?.case || "",
            crystal: product.materials?.crystal || "",
            strap: product.materials?.strap || "",
            movement: product.materials?.movement || "",
          },
          specifications: {
            waterResistance: product.specifications?.waterResistance || "",
            powerReserve: product.specifications?.powerReserve || "",
            functions:
              product.specifications?.functions?.length > 0
                ? product.specifications.functions
                : [""],
          },
        });

        setExistingImages(product.images || []);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error(`Failed to load product: ${error.message}`);
        navigate("/admin/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);

  // Validation rules (same as AddProduct)
  const validateField = (field, value) => {
    switch (field) {
      case "name":
        if (!value.trim()) return "Product name is required";
        if (value.trim().length < 3)
          return "Product name must be at least 3 characters";
        if (value.trim().length > 100)
          return "Product name must be less than 100 characters";
        return "";

      case "description":
        if (!value.trim()) return "Description is required";
        if (value.trim().length < 20)
          return "Description must be at least 20 characters";
        if (value.trim().length > 1000)
          return "Description must be less than 1000 characters";
        return "";

      case "price":
        if (!value) return "Price is required";
        const price = Number.parseFloat(value);
        if (isNaN(price) || price <= 0)
          return "Price must be a positive number";
        if (price > 1000000) return "Price must be less than $1,000,000";
        return "";

      case "originalPrice":
        if (value && value.trim()) {
          const originalPrice = Number.parseFloat(value);
          const currentPrice = Number.parseFloat(productData.price);
          if (isNaN(originalPrice) || originalPrice <= 0)
            return "Original price must be a positive number";
          if (originalPrice <= currentPrice)
            return "Original price must be higher than current price";
          if (originalPrice > 1000000)
            return "Original price must be less than $1,000,000";
        }
        return "";

      case "stock":
        if (!value) return "Stock quantity is required";
        const stock = Number.parseInt(value);
        if (isNaN(stock) || stock < 0)
          return "Stock must be a non-negative number";
        if (stock > 10000) return "Stock must be less than 10,000";
        return "";

      case "sku":
        if (value) {
          const val = value.toString().trim(); // 👈 Convert to string safely

          if (val.length < 3) return "SKU must be at least 3 characters";
          if (val.length > 50) return "SKU must be less than 50 characters";
          if (!/^[A-Za-z0-9\-_]+$/.test(val))
            return "SKU can only contain letters, numbers, hyphens, and underscores";
        }
        return "";

      case "weight":
        if (value && value.trim()) {
          const weight = Number.parseFloat(value);
          if (isNaN(weight) || weight <= 0)
            return "Weight must be a positive number";
          if (weight > 1000) return "Weight must be less than 1000 grams";
        }
        return "";

      case "features":
        const validFeatures = value.filter((f) => f.trim());
        if (validFeatures.length === 0)
          return "At least one feature is required";
        if (validFeatures.some((f) => f.trim().length > 100))
          return "Each feature must be less than 100 characters";
        return "";

      default:
        return "";
    }
  };

  const validateNestedField = (section, field, value) => {
    if (value && value.trim()) {
      if (
        field === "diameter" ||
        field === "thickness" ||
        field === "lugWidth"
      ) {
        const num = Number.parseFloat(value);
        if (isNaN(num) || num <= 0) return `${field} must be a positive number`;
        if (num > 1000) return `${field} must be less than 1000mm`;
      }
    }
    return "";
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate basic fields
    const basicFields = [
      "name",
      "description",
      "price",
      "originalPrice",
      "stock",
      "sku",
      "weight",
    ];
    basicFields.forEach((field) => {
      const error = validateField(field, productData[field]);
      if (error) newErrors[field] = error;
    });

    // Validate features
    const featuresError = validateField("features", productData.features);
    if (featuresError) newErrors.features = featuresError;

    // Validate nested fields
    Object.keys(productData.dimensions).forEach((field) => {
      const error = validateNestedField(
        "dimensions",
        field,
        productData.dimensions[field]
      );
      if (error) newErrors[`dimensions.${field}`] = error;
    });

    return newErrors;
  };

  const handleInputChange = (field, value) => {
    setProductData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Real-time validation
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleNestedInputChange = (section, field, value) => {
    setProductData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));

    // Real-time validation for nested fields
    const fieldKey = `${section}.${field}`;
    if (touched[fieldKey]) {
      const error = validateNestedField(section, field, value);
      setErrors((prev) => ({ ...prev, [fieldKey]: error }));
    }
  };

  const handleArrayInputChange = (field, index, value) => {
    setProductData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));

    // Real-time validation for array fields
    if (touched[field]) {
      const error = validateField(
        field,
        productData[field].map((item, i) => (i === index ? value : item))
      );
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, productData[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleNestedBlur = (section, field) => {
    const fieldKey = `${section}.${field}`;
    setTouched((prev) => ({ ...prev, [fieldKey]: true }));
    const error = validateNestedField(
      section,
      field,
      productData[section][field]
    );
    setErrors((prev) => ({ ...prev, [fieldKey]: error }));
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

    // Re-validate after removal
    if (touched[field]) {
      const newArray = productData[field].filter((_, i) => i !== index);
      const error = validateField(field, newArray);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleImageUpload = (files) => {
    const newFiles = Array.from(files).slice(
      0,
      6 - existingImages.length - imageFiles.length
    );
    setImageFiles((prev) => [...prev, ...newFiles]);

    // Update touched state for images
    setTouched((prev) => ({ ...prev, images: true }));
  };

  const removeNewImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (index) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/products/${id}/images/${index}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove image");
      }

      setExistingImages((prev) => prev.filter((_, i) => i !== index));
      toast.success("Image removed successfully");
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error(`Failed to remove image: ${error.message}`);
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = {
      name: true,
      description: true,
      price: true,
      originalPrice: true,
      stock: true,
      sku: true,
      weight: true,
      features: true,
      "dimensions.diameter": true,
      "dimensions.thickness": true,
      "dimensions.lugWidth": true,
    };
    setTouched(allTouched);

    // Validate all fields
    const formErrors = validateForm();
    setErrors(formErrors);

    // Check if form is valid
    if (Object.keys(formErrors).length > 0) {
      const firstErrorField = Object.keys(formErrors)[0];
      const element =
        document.querySelector(`[name="${firstErrorField}"]`) ||
        document.querySelector(`[name="${firstErrorField.replace(".", "-")}"]`);
      element?.focus();

      toast.error("Please fix the errors before submitting", {
        id: "validation-error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Create FormData for file upload
      const formData = new FormData();

      // Add basic fields
      formData.append("name", productData.name);
      formData.append("description", productData.description);
      formData.append("price", productData.price);
      if (productData.originalPrice)
        formData.append("originalPrice", productData.originalPrice);
      formData.append("category", productData.category);
      formData.append("brand", productData.brand);
      formData.append("stock", productData.stock);
      if (productData.sku) formData.append("sku", productData.sku);
      if (productData.weight) formData.append("weight", productData.weight);
      formData.append("isNew", productData.isNew);
      formData.append("isSale", productData.isSale);

      // Add features as JSON
      formData.append(
        "features",
        JSON.stringify(productData.features.filter((f) => f.trim()))
      );

      // Add dimensions as JSON
      formData.append("dimensions", JSON.stringify(productData.dimensions));

      // Add materials as JSON
      formData.append("materials", JSON.stringify(productData.materials));

      // Add specifications as JSON
      formData.append(
        "specifications",
        JSON.stringify({
          ...productData.specifications,
          functions: productData.specifications.functions.filter((f) =>
            f.trim()
          ),
        })
      );

      // Add new image files
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      // Send request to update product
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product");
      }

      const data = await response.json();

      toast.success("Product updated successfully!", {
        icon: "✅",
        id: "product-update-success",
      });

      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error updating product:", error);
      setErrors({
        submit: error.message || "Failed to update product. Please try again.",
      });
      toast.error(
        error.message || "Failed to update product. Please try again.",
        {
          id: "product-update-error",
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldClassName = (fieldName) => {
    const baseClass = "w-full";
    if (errors[fieldName] && touched[fieldName]) {
      return `${baseClass} border-red-500 focus:border-red-500 focus:ring-red-500`;
    }
    if (!errors[fieldName] && touched[fieldName] && productData[fieldName]) {
      return `${baseClass} border-green-500 focus:border-green-500 focus:ring-green-500`;
    }
    return baseClass;
  };

  const getNestedFieldClassName = (section, field) => {
    const fieldKey = `${section}.${field}`;
    const baseClass = "w-full";
    if (errors[fieldKey] && touched[fieldKey]) {
      return `${baseClass} border-red-500 focus:border-red-500 focus:ring-red-500`;
    }
    if (!errors[fieldKey] && touched[fieldKey] && productData[section][field]) {
      return `${baseClass} border-green-500 focus:border-green-500 focus:ring-green-500`;
    }
    return baseClass;
  };

  if (isLoading) {
    return (
      <div className="bg-[#162337] text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37] mx-auto"></div>
          <p className="mt-4">Loading product data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#162337] text-white min-h-screen">
        {/* Header */}
        <div className="bg-[#0f1420] border-b border-gray-800 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => navigate("/admin/dashboard")}
                  variant="outline"
                  className="border-gray-600"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
                <div>
                  <h1 className="text-3xl font-bold">Edit Product</h1>
                  <p className="text-gray-400">
                    Update timepiece information for WHRISTORIUM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <form
            onSubmit={handleSubmit}
            className="max-w-7xl mx-auto space-y-8"
            noValidate
          >
            {errors.submit && (
              <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Basic Information */}
            <div className="bg-[#0f1420] rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Basic Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Product Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      name="name"
                      value={productData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      onBlur={() => handleBlur("name")}
                      placeholder="e.g., Sovereign Classic"
                      className={getFieldClassName("name")}
                      aria-invalid={
                        errors.name && touched.name ? "true" : "false"
                      }
                      aria-describedby={
                        errors.name && touched.name ? "name-error" : undefined
                      }
                    />
                    {!errors.name && touched.name && productData.name && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                    )}
                    {errors.name && touched.name && (
                      <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                    )}
                  </div>
                  {errors.name && touched.name && (
                    <p
                      id="name-error"
                      className="mt-1 text-sm text-red-400 flex items-center gap-1"
                    >
                      <AlertCircle className="h-3 w-3" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">SKU</label>
                  <div className="relative">
                    <Input
                      name="sku"
                      value={productData.sku}
                      onChange={(e) => handleInputChange("sku", e.target.value)}
                      onBlur={() => handleBlur("sku")}
                      placeholder="e.g., WH-SC-001"
                      className={getFieldClassName("sku")}
                      aria-invalid={
                        errors.sku && touched.sku ? "true" : "false"
                      }
                      aria-describedby={
                        errors.sku && touched.sku ? "sku-error" : undefined
                      }
                    />
                    {!errors.sku && touched.sku && productData.sku && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                    )}
                    {errors.sku && touched.sku && (
                      <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                    )}
                  </div>
                  {errors.sku && touched.sku && (
                    <p
                      id="sku-error"
                      className="mt-1 text-sm text-red-400 flex items-center gap-1"
                    >
                      <AlertCircle className="h-3 w-3" />
                      {errors.sku}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="category"
                    value={productData.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    className="w-full bg-[#1a1f2c] border border-gray-700 rounded px-3 py-2"
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
                  <div className="relative">
                    <Input
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={productData.price}
                      onChange={(e) =>
                        handleInputChange("price", e.target.value)
                      }
                      onBlur={() => handleBlur("price")}
                      placeholder="2450"
                      className={getFieldClassName("price")}
                      aria-invalid={
                        errors.price && touched.price ? "true" : "false"
                      }
                      aria-describedby={
                        errors.price && touched.price
                          ? "price-error"
                          : undefined
                      }
                    />
                    {!errors.price && touched.price && productData.price && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                    )}
                    {errors.price && touched.price && (
                      <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                    )}
                  </div>
                  {errors.price && touched.price && (
                    <p
                      id="price-error"
                      className="mt-1 text-sm text-red-400 flex items-center gap-1"
                    >
                      <AlertCircle className="h-3 w-3" />
                      {errors.price}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Original Price (if on sale)
                  </label>
                  <div className="relative">
                    <Input
                      name="originalPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={productData.originalPrice}
                      onChange={(e) =>
                        handleInputChange("originalPrice", e.target.value)
                      }
                      onBlur={() => handleBlur("originalPrice")}
                      placeholder="2800"
                      className={getFieldClassName("originalPrice")}
                      aria-invalid={
                        errors.originalPrice && touched.originalPrice
                          ? "true"
                          : "false"
                      }
                      aria-describedby={
                        errors.originalPrice && touched.originalPrice
                          ? "originalPrice-error"
                          : undefined
                      }
                    />
                    {!errors.originalPrice &&
                      touched.originalPrice &&
                      productData.originalPrice && (
                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                      )}
                    {errors.originalPrice && touched.originalPrice && (
                      <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                    )}
                  </div>
                  {errors.originalPrice && touched.originalPrice && (
                    <p
                      id="originalPrice-error"
                      className="mt-1 text-sm text-red-400 flex items-center gap-1"
                    >
                      <AlertCircle className="h-3 w-3" />
                      {errors.originalPrice}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Stock Quantity <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      name="stock"
                      type="number"
                      min="0"
                      value={productData.stock}
                      onChange={(e) =>
                        handleInputChange("stock", e.target.value)
                      }
                      onBlur={() => handleBlur("stock")}
                      placeholder="25"
                      className={getFieldClassName("stock")}
                      aria-invalid={
                        errors.stock && touched.stock ? "true" : "false"
                      }
                      aria-describedby={
                        errors.stock && touched.stock
                          ? "stock-error"
                          : undefined
                      }
                    />
                    {!errors.stock && touched.stock && productData.stock && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                    )}
                    {errors.stock && touched.stock && (
                      <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                    )}
                  </div>
                  {errors.stock && touched.stock && (
                    <p
                      id="stock-error"
                      className="mt-1 text-sm text-red-400 flex items-center gap-1"
                    >
                      <AlertCircle className="h-3 w-3" />
                      {errors.stock}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Weight (grams)
                  </label>
                  <div className="relative">
                    <Input
                      name="weight"
                      type="number"
                      min="0"
                      step="0.1"
                      value={productData.weight}
                      onChange={(e) =>
                        handleInputChange("weight", e.target.value)
                      }
                      onBlur={() => handleBlur("weight")}
                      placeholder="165"
                      className={getFieldClassName("weight")}
                      aria-invalid={
                        errors.weight && touched.weight ? "true" : "false"
                      }
                      aria-describedby={
                        errors.weight && touched.weight
                          ? "weight-error"
                          : undefined
                      }
                    />
                    {!errors.weight && touched.weight && productData.weight && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                    )}
                    {errors.weight && touched.weight && (
                      <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                    )}
                  </div>
                  {errors.weight && touched.weight && (
                    <p
                      id="weight-error"
                      className="mt-1 text-sm text-red-400 flex items-center gap-1"
                    >
                      <AlertCircle className="h-3 w-3" />
                      {errors.weight}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium mb-2">
                  Description <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <textarea
                    name="description"
                    value={productData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    onBlur={() => handleBlur("description")}
                    rows={4}
                    className={`w-full bg-[#1a1f2c] border border-gray-700 rounded px-3 py-2 resize-none ${
                      errors.description && touched.description
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : !errors.description &&
                          touched.description &&
                          productData.description
                        ? "border-green-500 focus:border-green-500 focus:ring-green-500"
                        : ""
                    }`}
                    placeholder="Detailed description of the timepiece..."
                    aria-invalid={
                      errors.description && touched.description
                        ? "true"
                        : "false"
                    }
                    aria-describedby={
                      errors.description && touched.description
                        ? "description-error"
                        : undefined
                    }
                  />
                  {!errors.description &&
                    touched.description &&
                    productData.description && (
                      <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                    )}
                  {errors.description && touched.description && (
                    <AlertCircle className="absolute right-3 top-3 h-4 w-4 text-red-500" />
                  )}
                </div>
                <div className="flex justify-between items-center mt-1">
                  {errors.description && touched.description && (
                    <p
                      id="description-error"
                      className="text-sm text-red-400 flex items-center gap-1"
                    >
                      <AlertCircle className="h-3 w-3" />
                      {errors.description}
                    </p>
                  )}
                  <p
                    className={`text-xs ml-auto ${
                      productData.description.length > 900
                        ? "text-red-400"
                        : productData.description.length > 800
                        ? "text-yellow-400"
                        : "text-gray-400"
                    }`}
                  >
                    {productData.description.length}/1000
                  </p>
                </div>
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

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium mb-4">Current Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {existingImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={
                            image.startsWith("http")
                              ? image
                              : `http://localhost:5000/products/${image}`
                          }
                          alt={`Product ${index + 1}`}
                          className="w-full aspect-square object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src =
                              "/placeholder.svg?height=200&width=200";
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
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
                <p className="text-lg mb-2">Add more images</p>
                <p className="text-sm text-gray-400 mb-4">
                  Drag and drop or click to browse (Max 6 total)
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
                  disabled={existingImages.length + imageFiles.length >= 6}
                >
                  Choose Files
                </Button>
              </div>

              {/* New Image Previews */}
              {imageFiles.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium mb-4">New Images to Upload</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {imageFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file) || "/placeholder.svg"}
                          alt={`New ${index + 1}`}
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                          New
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="bg-[#0f1420] rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">
                Features <span className="text-red-400">*</span>
              </h2>

              <div className="space-y-3">
                {productData.features.map((feature, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-1 relative">
                      <Input
                        value={feature}
                        onChange={(e) =>
                          handleArrayInputChange(
                            "features",
                            index,
                            e.target.value
                          )
                        }
                        onBlur={() => {
                          setTouched((prev) => ({ ...prev, features: true }));
                          const error = validateField(
                            "features",
                            productData.features
                          );
                          setErrors((prev) => ({ ...prev, features: error }));
                        }}
                        placeholder="e.g., Automatic Movement"
                        className={
                          errors.features && touched.features
                            ? "border-red-500"
                            : ""
                        }
                      />
                    </div>
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
              {errors.features && touched.features && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.features}
                </p>
              )}
            </div>

            {/* Dimensions */}
            <div className="bg-[#0f1420] rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Dimensions</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Case Diameter (mm)
                  </label>
                  <div className="relative">
                    <Input
                      name="dimensions-diameter"
                      type="number"
                      min="0"
                      step="0.1"
                      value={productData.dimensions.diameter}
                      onChange={(e) =>
                        handleNestedInputChange(
                          "dimensions",
                          "diameter",
                          e.target.value
                        )
                      }
                      onBlur={() => handleNestedBlur("dimensions", "diameter")}
                      placeholder="42"
                      className={getNestedFieldClassName(
                        "dimensions",
                        "diameter"
                      )}
                      aria-invalid={
                        errors["dimensions.diameter"] &&
                        touched["dimensions.diameter"]
                          ? "true"
                          : "false"
                      }
                      aria-describedby={
                        errors["dimensions.diameter"] &&
                        touched["dimensions.diameter"]
                          ? "diameter-error"
                          : undefined
                      }
                    />
                    {!errors["dimensions.diameter"] &&
                      touched["dimensions.diameter"] &&
                      productData.dimensions.diameter && (
                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                      )}
                    {errors["dimensions.diameter"] &&
                      touched["dimensions.diameter"] && (
                        <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                      )}
                  </div>
                  {errors["dimensions.diameter"] &&
                    touched["dimensions.diameter"] && (
                      <p
                        id="diameter-error"
                        className="mt-1 text-sm text-red-400 flex items-center gap-1"
                      >
                        <AlertCircle className="h-3 w-3" />
                        {errors["dimensions.diameter"]}
                      </p>
                    )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Case Thickness (mm)
                  </label>
                  <div className="relative">
                    <Input
                      name="dimensions-thickness"
                      type="number"
                      min="0"
                      step="0.1"
                      value={productData.dimensions.thickness}
                      onChange={(e) =>
                        handleNestedInputChange(
                          "dimensions",
                          "thickness",
                          e.target.value
                        )
                      }
                      onBlur={() => handleNestedBlur("dimensions", "thickness")}
                      placeholder="12"
                      className={getNestedFieldClassName(
                        "dimensions",
                        "thickness"
                      )}
                      aria-invalid={
                        errors["dimensions.thickness"] &&
                        touched["dimensions.thickness"]
                          ? "true"
                          : "false"
                      }
                      aria-describedby={
                        errors["dimensions.thickness"] &&
                        touched["dimensions.thickness"]
                          ? "thickness-error"
                          : undefined
                      }
                    />
                    {!errors["dimensions.thickness"] &&
                      touched["dimensions.thickness"] &&
                      productData.dimensions.thickness && (
                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                      )}
                    {errors["dimensions.thickness"] &&
                      touched["dimensions.thickness"] && (
                        <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                      )}
                  </div>
                  {errors["dimensions.thickness"] &&
                    touched["dimensions.thickness"] && (
                      <p
                        id="thickness-error"
                        className="mt-1 text-sm text-red-400 flex items-center gap-1"
                      >
                        <AlertCircle className="h-3 w-3" />
                        {errors["dimensions.thickness"]}
                      </p>
                    )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Lug Width (mm)
                  </label>
                  <div className="relative">
                    <Input
                      name="dimensions-lugWidth"
                      type="number"
                      min="0"
                      step="0.1"
                      value={productData.dimensions.lugWidth}
                      onChange={(e) =>
                        handleNestedInputChange(
                          "dimensions",
                          "lugWidth",
                          e.target.value
                        )
                      }
                      onBlur={() => handleNestedBlur("dimensions", "lugWidth")}
                      placeholder="22"
                      className={getNestedFieldClassName(
                        "dimensions",
                        "lugWidth"
                      )}
                      aria-invalid={
                        errors["dimensions.lugWidth"] &&
                        touched["dimensions.lugWidth"]
                          ? "true"
                          : "false"
                      }
                      aria-describedby={
                        errors["dimensions.lugWidth"] &&
                        touched["dimensions.lugWidth"]
                          ? "lugWidth-error"
                          : undefined
                      }
                    />
                    {!errors["dimensions.lugWidth"] &&
                      touched["dimensions.lugWidth"] &&
                      productData.dimensions.lugWidth && (
                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                      )}
                    {errors["dimensions.lugWidth"] &&
                      touched["dimensions.lugWidth"] && (
                        <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                      )}
                  </div>
                  {errors["dimensions.lugWidth"] &&
                    touched["dimensions.lugWidth"] && (
                      <p
                        id="lugWidth-error"
                        className="mt-1 text-sm text-red-400 flex items-center gap-1"
                      >
                        <AlertCircle className="h-3 w-3" />
                        {errors["dimensions.lugWidth"]}
                      </p>
                    )}
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
                        onChange={(e) => {
                          const newFunctions = [
                            ...productData.specifications.functions,
                          ];
                          newFunctions[index] = e.target.value;
                          handleNestedInputChange(
                            "specifications",
                            "functions",
                            newFunctions
                          );
                        }}
                        placeholder="e.g., Date Display"
                        className="flex-1"
                      />
                      {productData.specifications.functions.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => {
                            const newFunctions =
                              productData.specifications.functions.filter(
                                (_, i) => i !== index
                              );
                            handleNestedInputChange(
                              "specifications",
                              "functions",
                              newFunctions
                            );
                          }}
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
                    onClick={() => {
                      const newFunctions = [
                        ...productData.specifications.functions,
                        "",
                      ];
                      handleNestedInputChange(
                        "specifications",
                        "functions",
                        newFunctions
                      );
                    }}
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
                onClick={() => navigate("/admin/dashboard")}
                variant="outline"
                className="border-gray-600"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#d4af37] hover:bg-[#b8973a] text-black px-8 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                    Updating Product...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Product
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

export default EditProduct;

"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Heart,
  Settings,
  Shield,
  Edit,
  Save,
  X,
  Eye,
  Star,
  Home,
} from "lucide-react";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import toast from "react-hot-toast";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    addresses: [],
  });

  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const user = JSON.parse(localStorage.getItem("user")) || {};

  // Load user data on mount
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        const res = await fetch("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const user = await res.json();

        // Update both local state and localStorage
        setProfileData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          addresses: user.addresses || [],
        });

        localStorage.setItem("user", JSON.stringify(user)); // 💾 Save user globally
      } catch (error) {
        toast.error("Failed to load profile");
      }
    }

    fetchUserProfile();
  }, []);

  // Handle save click - send update request to backend
  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!token) {
        toast.error("You must be logged in");
        return;
      }

      const updatePayload = {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        addresses: profileData.addresses,
      };

      const res = await fetch(
        `http://localhost:5000/api/user/update/${user._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatePayload),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Update failed");

      toast.success("Profile updated successfully");
      localStorage.setItem("user", JSON.stringify(data.user));
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  const handleSaveAddress = () => {
    if (!editingAddress) return;

    let newAddresses;
    if (editingAddress._id) {
      // update existing address
      newAddresses = profileData.addresses.map((addr) =>
        addr._id === editingAddress._id ? editingAddress : addr
      );
    } else {
      // add new address - generate temp id for React keys if needed
      newAddresses = [
        ...profileData.addresses,
        { ...editingAddress, _id: Date.now().toString() },
      ];
    }

    setProfileData({ ...profileData, addresses: newAddresses });
    setShowAddressForm(false);
    setEditingAddress(null);
  };

  // Delete address
  const handleDeleteAddress = (id) => {
    const newAddresses = profileData.addresses.filter(
      (addr) => addr._id !== id
    );
    setProfileData({ ...profileData, addresses: newAddresses });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "text-green-400";
      case "shipped":
        return "text-blue-400";
      case "processing":
        return "text-yellow-400";
      case "cancelled":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "orders", label: "Orders", icon: Package },
  ];

  return (
    <div className="bg-[#162337] text-white min-h-screen">
      {/* Header */}
      <div className="bg-[#0f1420] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Account</h1>
              <p className="text-gray-400">
                Manage your WHRISTORIUM account and preferences
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/"
              >
                <Button
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                        className="border-gray-600 hover:bg-gray-800"
                      >
                        <Home className="h-4 w-4 mr-2" />
                        Home
                      </Button>
              </Link>
              
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-[#0f1420] rounded-lg p-6">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-800">
                <div className="w-16 h-16 bg-[#1a1f2c] rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-[#d4af37]" />
                </div>
                <div>
                  <h3 className="font-semibold">{profileData.name}</h3>
                </div>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? "bg-[#d4af37] text-black"
                          : "hover:bg-[#1a1f2c] text-gray-300"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Profile Information */}
                <div className="bg-[#0f1420] rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">
                      Profile Information
                    </h2>
                    {!isEditing ? (
                      <Button
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                        className="border-gray-600 hover:bg-gray-800"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSaveProfile}
                          size="sm"
                          className="bg-[#d4af37] hover:bg-[#b8973a] text-black"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          onClick={handleCancelEdit}
                          variant="outline"
                          size="sm"
                          className="border-gray-600"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Name
                      </label>
                      <Input
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            name: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className={
                          !isEditing ? "bg-[#1a1f2c] border-gray-700" : ""
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email
                      </label>
                      <Input
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className={
                          !isEditing ? "bg-[#1a1f2c] border-gray-700" : ""
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Phone
                      </label>
                      <Input
                        value={profileData.phone}
                        maxLength={10}
                        onChange={(e) => {
                          if (/^\d*$/.test(e.target.value)) {
                            setProfileData({
                              ...profileData,
                              phone: e.target.value,
                            });
                          }
                        }}
                        disabled={!isEditing}
                        className={
                          !isEditing ? "bg-[#1a1f2c] border-gray-700" : ""
                        }
                      />
                    </div>
<br/>
                    {/* Address part */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">
                        Addresses
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {profileData.addresses.map((address) => (
                          <div
                            key={address._id}
                            className="bg-[#1a1f2c] rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold">{address.type}</h3>
                              {address.isDefault && (
                                <span className="bg-[#d4af37] text-black text-xs px-2 py-1 rounded">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="text-sm space-y-1 mb-4">
                              <div className="font-medium">{address.name}</div>
                              <div>{address.street}</div>
                              <div>
                                {address.city}, {address.district}{" "}
                                {address.zipCode}
                              </div>
                              <div>{address.country}</div>
                            </div>
                            {isEditing && (
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-gray-600"
                                  onClick={() => {
                                    setEditingAddress(address);
                                    setShowAddressForm(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-gray-600"
                                  onClick={() =>
                                    handleDeleteAddress(address._id)
                                  }
                                >
                                  Delete
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {isEditing && (
                        <Button
                          onClick={() => {
                            setEditingAddress({
                              type: "",
                              name: "",
                              street: "",
                              city: "",
                              district: "",
                              zipCode: "",
                              country: "",
                              isDefault: false,
                            });
                            setShowAddressForm(true);
                          }}
                          className="mt-4 bg-[#d4af37] hover:bg-[#b8973a] text-black"
                        >
                          Add New Address
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                  {/* <div className="bg-[#0f1420] rounded-lg p-6 text-center">
                    <Package className="h-8 w-8 text-[#d4af37] mx-auto mb-3" />
                    <div className="text-2xl font-bold mb-1">{orders.length}</div>
                    <div className="text-sm text-gray-400">Total Orders</div>
                  </div> */}
                </div>

                {/* Recent Orders */}
                <div className="bg-[#0f1420] rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Recent Orders</h2>
                    <Link
                      to="/orders"
                      className="text-[#d4af37] hover:underline text-sm"
                    >
                      View All Orders →
                    </Link>
                  </div>

                  {/* <div className="space-y-4">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-[#1a1f2c] rounded-lg">
                        <div className="flex items-center gap-4">
                          <img
                            src={order.items[0].image || "/placeholder.svg"}
                            alt={order.items[0].name}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div>
                            <div className="font-medium">{order.id}</div>
                            <div className="text-sm text-gray-400">{order.date}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${order.total.toLocaleString()}</div>
                          <div className={`text-sm ${getStatusColor(order.status)}`}>{order.status}</div>
                        </div>
                      </div>
                    ))}
                  </div> */}
                </div>
              </div>
            )}

            {/* {activeTab === "orders" && (
              <div className="bg-[#0f1420] rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6">Order History</h2>

                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">Order {order.id}</h3>
                          <p className="text-sm text-gray-400">Placed on {order.date}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${order.total.toLocaleString()}</div>
                          <div className={`text-sm ${getStatusColor(order.status)}`}>{order.status}</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-16 h-16 rounded object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">${item.price.toLocaleString()}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-3 mt-4 pt-4 border-t border-gray-700">
                        <Button variant="outline" size="sm" className="border-gray-600">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        {order.status === "Delivered" && (
                          <Button variant="outline" size="sm" className="border-gray-600">
                            Reorder
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )} */}

            {/* {activeTab === "addresses" && (
              <div className="bg-[#0f1420] rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Saved Addresses</h2>
                  <Button
                    className="bg-[#d4af37] hover:bg-[#b8973a] text-black"
                    onClick={() => {
                      setEditingAddress({
                        type: "",
                        name: "",
                        street: "",
                        city: "",
                        state: "",
                        zipCode: "",
                        country: "",
                        isDefault: false,
                      });
                      setShowAddressForm(true);
                    }}
                  >
                    Add New Address
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map((address) => (
                    <div
                      key={address._id}
                      className="border border-gray-700 rounded-lg p-4 relative"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{address.type}</h3>
                        {address.isDefault && (
                          <span className="bg-[#d4af37] text-black text-xs px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="text-sm space-y-1 mb-4">
                        <div className="font-medium">{address.name}</div>
                        <div>{address.street}</div>
                        <div>
                          {address.city}, {address.state} {address.zipCode}
                        </div>
                        <div>{address.country}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-600"
                          onClick={() => {
                            setEditingAddress(address);
                            setShowAddressForm(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-600"
                          onClick={() => handleDeleteAddress(address._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )} */}

            {showAddressForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-[#0f1420] rounded-lg p-6 w-96">
                  <h3 className="text-lg font-semibold mb-4">
                    {editingAddress._id ? "Edit Address" : "Add New Address"}
                  </h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveAddress();
                    }}
                  >
                    <label>Type</label>
                    <Input
                      value={editingAddress.type}
                      onChange={(e) =>
                        setEditingAddress({
                          ...editingAddress,
                          type: e.target.value,
                        })
                      }
                      required
                    />
                    <label>Name</label>
                    <Input
                      value={profileData.name}
                      onChange={(e) =>
                        setEditingAddress({
                          ...editingAddress,
                          name: e.target.value,
                        })
                      }
                    />
                    <label>Street</label>
                    <Input
                      value={editingAddress.street}
                      onChange={(e) =>
                        setEditingAddress({
                          ...editingAddress,
                          street: e.target.value,
                        })
                      }
                    />
                    <label>City</label>
                    <Input
                      value={editingAddress.city}
                      onChange={(e) =>
                        setEditingAddress({
                          ...editingAddress,
                          city: e.target.value,
                        })
                      }
                    />
                    <label>District</label>
                    <Input
                      value={editingAddress.district}
                      onChange={(e) =>
                        setEditingAddress({
                          ...editingAddress,
                          district: e.target.value,
                        })
                      }
                    />
                    <label>Zip Code</label>
                    <Input
                      value={editingAddress.zipCode}
                      onChange={(e) =>
                        setEditingAddress({
                          ...editingAddress,
                          zipCode: e.target.value,
                        })
                      }
                    />
                    <label>Country</label>
                    <Input
                      value={editingAddress.country}
                      onChange={(e) =>
                        setEditingAddress({
                          ...editingAddress,
                          country: e.target.value,
                        })
                      }
                    />
                    <label>
                      <input
                        type="checkbox"
                        checked={editingAddress.isDefault}
                        onChange={(e) =>
                          setEditingAddress({
                            ...editingAddress,
                            isDefault: e.target.checked,
                          })
                        }
                      />{" "}
                      Default Address
                    </label>

                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowAddressForm(false);
                          setEditingAddress(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-[#d4af37] text-black">
                        Save
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

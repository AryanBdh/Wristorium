"use client";

import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import Header from "../Header";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Us",
      details: ["info@whristorium.com", "support@whristorium.com"],
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Call Us",
      details: ["+977 9875621354", "+977 9864257890"],
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Visit Us",
      details: ["Putalisadak", "Kathmandu, Nepal"],
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Business Hours",
      details: ["Mon - Fri: 9:00 AM - 6:00 PM", "Sat: 10:00 AM - 4:00 PM"],
    },
  ];

  return (
    <>
    <Header />
      <div className="bg-[#162337] text-white">
        {/* Hero Section */}
        <section className="relative h-[40vh] overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center max-w-3xl px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Contact Us
              </h1>
              <p className="text-lg md:text-xl text-gray-200">
                We'd love to hear from you. Send us a message and we'll respond
                as soon as possible.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form and Info */}
        <section className="py-20 container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Contact Form */}
            <div className="bg-[#0F172A] rounded-lg p-8">
              <div className="mb-8">
                <span className="text-[#d4af37] text-sm uppercase tracking-wider">
                  GET IN TOUCH
                </span>
                <h2 className="text-3xl font-bold mt-2 mb-4">
                  Send us a Message
                </h2>
                <p className="text-gray-300">
                  Whether you have questions about our timepieces, need
                  assistance, or want to share feedback, we're here to help.
                </p>
              </div>

              {isSubmitted && (
                <div className="mb-6 p-4 bg-green-900/20 border border-green-700 rounded-lg">
                  <p className="text-green-400 text-sm">
                    Thank you for your message! We'll get back to you within 24
                    hours.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium mb-2"
                    >
                      Full Name *
                    </label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-2"
                    >
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium mb-2"
                  >
                    Subject *
                  </label>
                  <Input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full"
                    placeholder="What is this regarding?"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full rounded-none border border-gray-700 bg-[#0F172A] px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#d4af37] hover:bg-[#b8973a] text-black rounded-none px-8 py-6"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <span className="text-[#d4af37] text-sm uppercase tracking-wider">
                  CONTACT INFORMATION
                </span>
                <h2 className="text-3xl font-bold mt-2 mb-6">Get in Touch</h2>
                <p className="text-gray-300 mb-8">
                  Our customer service team is available to assist you with any
                  questions about our timepieces, services, or to help you find
                  the perfect watch.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="bg-[#0F172A] rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 p-2 bg-[#0F172A] rounded-full text-[#d4af37]">
                        {info.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">{info.title}</h3>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-sm text-gray-300">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional Info */}
              <div className="bg-[#0F172A] rounded-lg p-6">
                <h3 className="font-semibold mb-4">Customer Support</h3>
                <p className="text-sm text-gray-300 mb-4">
                  Our dedicated support team is here to help with:
                </p>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li>• Product information and recommendations</li>
                  <li>• Order status and shipping inquiries</li>
                  <li>• Warranty and repair services</li>
                  <li>• Technical support for smart timepieces</li>
                  <li>• General questions about WHRISTORIUM</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-[#0F172A] border-y border-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-[#d4af37] text-sm uppercase tracking-wider">
                FREQUENTLY ASKED
              </span>
              <h2 className="text-3xl font-bold mt-2">Quick Answers</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
              <div className="bg-[#0F172A] rounded-lg p-6">
                <h3 className="font-semibold mb-3">
                  How long does shipping take?
                </h3>
                <p className="text-sm text-gray-300">
                  Standard shipping takes 3-5 business days. Express shipping is
                  available for 1-2 day delivery.
                </p>
              </div>

              <div className="bg-[#0F172A] rounded-lg p-6">
                <h3 className="font-semibold mb-3">
                  Do you offer international shipping?
                </h3>
                <p className="text-sm text-gray-300">
                  No, we currently ship only within Nepal. We plan to expand
                  internationally in the future.
                </p>
              </div>

              <div className="bg-[#0F172A] rounded-lg p-6">
                <h3 className="font-semibold mb-3">
                  What is your return policy?
                </h3>
                <p className="text-sm text-gray-300">
                  We offer a 30-day return policy for unworn items in original
                  packaging.
                </p>
              </div>

              <div className="bg-[#0F172A] rounded-lg p-6">
                <h3 className="font-semibold mb-3">
                  How can I track my order?
                </h3>
                <p className="text-sm text-gray-300">
                  You'll receive a tracking number via email once your order
                  ships. You can also check your account.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Contact;

// src/pages/EsewaSuccess.jsx
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";

const EsewaSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  useEffect(() => {
    const encodedData = searchParams.get("data");
    if (!encodedData) {
      toast.error("Missing payment data.");
      navigate("/checkout");
      return;
    }

    // Call backend to verify payment
    fetch("http://localhost:5000/api/payments/esewa/success?data=" + encodedData)
      .then((res) => {
        if (res.redirected) {
          // If backend redirected, follow it manually
          window.location.href = res.url;
        } else {
          return res.json();
        }
      })
      .then((data) => {
        // Optional: handle non-redirect fallback
        console.log("Verification response:", data);
        if (data?.success) {
          clearCart();
          navigate("/profile");
        }
      })
      .catch((err) => {
        console.error("Error verifying payment:", err);
        toast.error("Verification failed.");
        navigate("/checkout");
      });
  }, []);

  return <div className="text-center mt-20">Verifying eSewa payment...</div>;
};

export default EsewaSuccess;

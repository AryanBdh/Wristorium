import { Link } from "react-router-dom"
import Button from "../ui/Button"

const EsewaFailure = () => {
  return (
    <div className="min-h-screen bg-[#162337] flex items-center justify-center">
      <div className="text-center text-white max-w-md mx-auto p-6">
        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-red-400">Payment Failed</h2>
        <p className="text-gray-400 mb-6">
          Your payment could not be processed. Please try again or choose another payment method.
        </p>
        <div className="space-y-3">
          <Link to="/checkout">
            <Button className="w-full bg-[#d4af37] text-black hover:bg-[#b8973a]">Try Again</Button>
          </Link>
          <Link to="/cart">
            <Button variant="outline" className="w-full border-gray-600 hover:bg-gray-800 bg-transparent">
              Back to Cart
            </Button>
          </Link>
          <Link to="/shop">
            <Button variant="outline" className="w-full border-gray-600 hover:bg-gray-800 bg-transparent">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default EsewaFailure

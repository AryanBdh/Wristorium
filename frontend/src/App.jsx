import { CartProvider } from "./context/CartContext.jsx";
import RouterComponent from "./RouterComponent.jsx";
import { Toaster } from "react-hot-toast";



const App = () => {
  return (
    <>
      <CartProvider>
          <RouterComponent />
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              duration: 3000,
              style: {
                background: "#0f1420",
                color: "#ffffff",
                border: "1px solid #1a1f2c",
                borderRadius: "8px",
                fontSize: "14px",
              },
              success: {
                iconTheme: {
                  primary: "#d4af37",
                  secondary: "#0f1420",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#0f1420",
                },
              },
            }}
          />
      </CartProvider>
    </>
  );
};

export default App;

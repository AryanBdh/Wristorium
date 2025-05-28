import { CartProvider } from "./context/CartContext.jsx";
import { FavoritesProvider } from "./context/FavouritesContext.jsx";
import RouterComponent from "./RouterComponent.jsx";
import {Toaster} from "react-hot-toast";

const App = () => {
  return (
    <>
    
      <CartProvider>
        <FavoritesProvider>
          <RouterComponent />
          <Toaster position="top-center" reverseOrder={false} />
        </FavoritesProvider>
      </CartProvider>
    </>
  );
};

export default App;

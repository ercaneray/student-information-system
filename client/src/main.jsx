import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { PrimeReactProvider } from "primereact/api";
import "./index.css";
import "primereact/resources/themes/saga-blue/theme.css";  // Add this line
import "primereact/resources/primereact.min.css";  // Add this line
import "primeicons/primeicons.css";
import App from "./App.jsx";
import { AuthContextProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <PrimeReactProvider>
          <App />
        </PrimeReactProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>
);

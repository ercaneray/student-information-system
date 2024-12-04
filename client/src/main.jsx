import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { PrimeReactProvider } from "primereact/api";
import { AuthProvider } from 'react-auth-kit'
import "./index.css";
import "primereact/resources/themes/saga-blue/theme.css";  // Add this line
import "primereact/resources/primereact.min.css";  // Add this line
import "primeicons/primeicons.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider
    authType={'cookie'}
    authName={'_auth'}
    cookieDomain={'localhost'}
    cookieSecure={false}
  >
    <BrowserRouter>
      <PrimeReactProvider>
        <App />
      </PrimeReactProvider>
    </BrowserRouter>
  </AuthProvider>

);

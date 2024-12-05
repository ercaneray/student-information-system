import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { PrimeReactProvider } from "primereact/api";
import  AuthProvider  from 'react-auth-kit'
import "./index.css";
import "primereact/resources/themes/saga-blue/theme.css";  // Add this line
import "primereact/resources/primereact.min.css";  // Add this line
import "primeicons/primeicons.css";
import App from "./App.jsx";
import createStore from "react-auth-kit/createStore";

const store = createStore({
  authName: '_auth',
  authType: 'cookie',
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === 'https:',
});

createRoot(document.getElementById("root")).render(
  <AuthProvider store={store}>
    <BrowserRouter>
      <PrimeReactProvider>
        <App />
      </PrimeReactProvider>
    </BrowserRouter>
  </AuthProvider>

);

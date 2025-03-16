import { StrictMode, useContext } from "react";
import { createRoot } from "react-dom/client";
import { AuthWrapper } from "./auth/AuthWrapper.jsx";
import App from "./App";
import "./styles/index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthWrapper>
      <App />
    </AuthWrapper>
  </StrictMode>,
);

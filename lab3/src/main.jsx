import { StrictMode, useContext } from "react";
import { createRoot } from "react-dom/client";
import { AuthWrapper } from "./auth/AuthWrapper.jsx";
import App from "./App";
import "./styles/index.css";
import { DarkModeProvider } from "./context/DarkModeProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthWrapper>
      <DarkModeProvider>
        <App />
      </DarkModeProvider>
    </AuthWrapper>
  </StrictMode>,
);

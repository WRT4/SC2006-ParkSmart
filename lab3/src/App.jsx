import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import Index from "./pages/Index";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Index></Index>,
    },
    {
      path: "signup",
      element: <SignUpPage></SignUpPage>,
    },
    {
      path: "login",
      element: <LoginPage></LoginPage>,
    },
    {
      path: "home",
      element: <HomePage></HomePage>,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;

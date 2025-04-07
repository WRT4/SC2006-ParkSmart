import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import Index from "./pages/Index";
import SearchPage from "./pages/SearchPage";
import LoadingPage from "./pages/LoadingPage";
import PostDetail from "./pages/PostDetail";
import EditPost from "./pages/EditPost";
import FeedbackPage from "./pages/FeedbackPage";
import AdminDashboard from "./pages/AdminDashboard";
import ProfilePage from "./pages/ProfilePage";
import LicensePage from "./pages/LicensePage";
import Forum from "./pages/Forum";
import About from "./pages/About";

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
    {
      path: "searchpage",
      element: <SearchPage></SearchPage>,
    },
    {
      path: "loading",
      element: <LoadingPage></LoadingPage>,
    },
    {
      path: "forum",
      element: <Forum />,
    },
    {
      path: "forum/post/:id",
      element: <PostDetail />,
    },
    {
      path: "forum/post/:id/edit",
      element: <EditPost />,
    },
    {
      path: "support",
      element: <FeedbackPage />,
    },
    {
      path: "support/admin",
      element: <AdminDashboard />,
    },
    {
      path: "profile",
      element: <ProfilePage />,
    },
    {
      path: "license",
      element: <LicensePage />,
    },
    {
      path: "about",
      element: <About />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import Index from "./pages/Index";
import SearchPage from "./pages/SearchPage";
import LoadingPage from "./pages/LoadingPage";
import Forum from "./pages/Forum";
import PostDetail from "./pages/PostDetail";
import EditPost from "./pages/EditPost";

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
  ]);

  return <RouterProvider router={router} />;
}

export default App;

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SignUpPage from './SignUpPage';
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import Index from './Index';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Index></Index>,
    },
    {
      path: 'signup',
      element: <SignUpPage></SignUpPage>,
    },
    {
      path: 'login',
      element: <LoginPage></LoginPage>,
    },
    {
      path: 'home',
      element: <HomePage></HomePage>,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;

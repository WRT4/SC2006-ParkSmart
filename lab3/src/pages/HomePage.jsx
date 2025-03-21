import { useContext, useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { AuthContext } from "../auth/AuthWrapper";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Home() {
  const { user, setUser } = useContext(AuthContext); // Assuming AuthContext has setUser to update user state
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Header></Header>
      <section className="grid justify-items-center gap-4 bg-blue-50 p-6 sm:gap-10 sm:p-10">
        <img
          src="./car.jpg"
          alt="Image of a car"
          className="w-full max-w-[500px] rounded-lg shadow-lg"
        />
        <div className="flex flex-col gap-2">
          <p className="text-center text-xl font-bold sm:text-3xl">
            Welcome to ParkSmart, {user.username}
          </p>
          <p className="text-center text-sm text-gray-600 sm:text-base">
            Manage your parking experience efficiently with our smart parking
            solutions.
          </p>
        </div>
      </section>
      <section className="grid justify-center gap-4 p-6 sm:gap-10 sm:p-10">
        <p className="text-center text-xl font-bold sm:text-3xl">
          Quick Access
        </p>
        <div className="grid w-full grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] justify-items-center gap-6 min-[1000px]:max-w-[1090px] min-[1000px]:grid-cols-3">
          <div className="grid h-[175px] w-full max-w-[350px] gap-1 rounded-md bg-blue-50 p-4 shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="#2563eb"
              className="bi bi-person-fill"
              viewBox="0 0 16 16"
            >
              <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
            </svg>
            <p className="font-semibold">My Profile</p>
            <p className="text-sm text-gray-600">
              View and manage your account settings and preferences.
            </p>
            <Link
              to="/profile"
              className="inline-flex items-center text-sm text-blue-600"
            >
              Access
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#2563eb"
                className="bi bi-chevron-right"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
                />
              </svg>
            </Link>
          </div>
          <div className="grid h-[175px] w-full max-w-[350px] gap-1 rounded-md bg-green-50 p-4 shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="#2563eb"
              className="bi bi-geo-alt-fill"
              viewBox="0 0 16 16"
            >
              <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
            </svg>
            <p className="font-semibold">Carpark Search</p>
            <p className="text-sm text-gray-600">
              Find and navigate to available parking spaces.
            </p>
            <Link
              to="/searchpage"
              className="inline-flex items-center text-sm text-blue-600"
            >
              Access
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#2563eb"
                className="bi bi-chevron-right"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
                />
              </svg>
            </Link>
          </div>
          <div className="grid h-[175px] w-full max-w-[350px] gap-1 rounded-md bg-purple-50 p-4 shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="#2563eb"
              className="bi bi-people-fill"
              viewBox="0 0 16 16"
            >
              <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
            </svg>
            <p className="font-semibold">Forum</p>
            <p className="text-sm text-gray-600">
              Connect with other users and share insights.
            </p>
            <Link
              to="/forum"
              className="inline-flex items-center text-sm text-blue-600"
            >
              Access
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#2563eb"
                className="bi bi-chevron-right"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
                />
              </svg>
            </Link>
          </div>
          <div className="grid h-[175px] w-full max-w-[350px] gap-1 rounded-md bg-yellow-50 p-4 shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="#2563eb"
              className="bi bi-chat-text-fill"
              viewBox="0 0 16 16"
            >
              <path d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M4.5 5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1zm0 2.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1zm0 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1z" />
            </svg>
            <p className="font-semibold">Provide Feedback</p>
            <p className="text-sm text-gray-600">
              Share your experience and help us improve.
            </p>
            <Link
              to="/support"
              className="inline-flex items-center text-sm text-blue-600"
            >
              Access
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#2563eb"
                className="bi bi-chevron-right"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
                />
              </svg>
            </Link>
          </div>
          <div className="grid h-[175px] w-full max-w-[350px] gap-1 rounded-md bg-cyan-50 p-4 shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="#2563eb"
              className="bi bi-info-circle-fill"
              viewBox="0 0 16 16"
            >
              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
            </svg>
            <p className="font-semibold">About</p>
            <p className="text-sm text-gray-600">
              Discover our mission and impact.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center text-sm text-blue-600"
            >
              Access
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#2563eb"
                className="bi bi-chevron-right"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
                />
              </svg>
            </Link>
          </div>
          <div className="grid h-[175px] w-full max-w-[350px] gap-1 rounded-md bg-fuchsia-50 p-4 shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="#2563eb"
              className="bi bi-c-circle-fill"
              viewBox="0 0 16 16"
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.146 4.992c.961 0 1.641.633 1.729 1.512h1.295v-.088c-.094-1.518-1.348-2.572-3.03-2.572-2.068 0-3.269 1.377-3.269 3.638v1.073c0 2.267 1.178 3.603 3.27 3.603 1.675 0 2.93-1.02 3.029-2.467v-.093H9.875c-.088.832-.75 1.418-1.729 1.418-1.224 0-1.927-.891-1.927-2.461v-1.06c0-1.583.715-2.503 1.927-2.503" />
            </svg>
            <p className="font-semibold">License</p>
            <p className="text-sm text-gray-600">
              View the terms and conditions governing the use of our services.
            </p>
            <Link
              to="/license"
              className="inline-flex items-center text-sm text-blue-600"
            >
              Access
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#2563eb"
                className="bi bi-chevron-right"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      <Footer></Footer>
    </>
  );
}

export default Home;

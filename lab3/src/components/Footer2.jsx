import { Typography } from "@material-tailwind/react";
import Title from "./Title";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-50 p-8 dark:bg-gray-800 dark:text-gray-50">
      <div className="flex flex-col place-content-evenly items-center gap-4 min-[580px]:flex-row">
        <Title colorLight="text-black" colorDark="text-gray-50"></Title>
        <div className="flex flex-row flex-wrap items-center justify-center gap-x-12 gap-y-6 text-center md:justify-between dark:bg-gray-800">
          <ul className="flex flex-col flex-wrap items-center gap-x-8 gap-y-4 min-[500px]:flex-row">
            <Link to="/about">
              <Typography
                as="a"
                color="blue-gray"
                className="font-normal transition-colors hover:text-gray-300 focus:text-gray-400 active:text-gray-400"
              >
                About Us
              </Typography>
            </Link>
            <Link to="/license">
              <Typography
                as="a"
                color="blue-gray"
                className="font-normal transition-colors hover:text-gray-300 focus:text-gray-400 active:text-gray-400"
              >
                License
              </Typography>
            </Link>
            <Link to="/forum">
              <Typography
                as="a"
                color="blue-gray"
                className="font-normal transition-colors hover:text-gray-300 focus:text-gray-400 active:text-gray-400"
              >
                Forum
              </Typography>
            </Link>
            <Link to="/support">
              <Typography
                as="a"
                color="blue-gray"
                className="font-normal transition-colors hover:text-gray-300 focus:text-gray-400 active:text-gray-400"
              >
                Contact Us
              </Typography>
            </Link>
          </ul>
        </div>
      </div>
      <hr className="border-blue-gray-50 my-8" />
      <Typography color="blue-gray" className="text-center font-normal">
        &copy; 2025 ParkSmart
      </Typography>
    </footer>
  );
}

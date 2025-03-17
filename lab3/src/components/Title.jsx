import Logo from "./Logo";
import { Link } from "react-router-dom";

export default function Title({ color = "text-black" }) {
  return (
    <Link
      to="/home"
      className={`${color} justify-self-start text-xl font-bold tracking-wide`}
    >
      <Logo></Logo>
      arkSmart
    </Link>
  );
}

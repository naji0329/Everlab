import React from "react";
import { Link } from "react-router-dom";

const Logo = () => (
  <img
    className="h-8 w-auto sm:h-10"
    src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
    alt=""
  />
);

const Title = () => (
  <span className="font-medium text-lg">Everlab Doctors</span>
);

const Navbar = () => {
  return (
    <div className="relative bg-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
          <Link to={"/"} className="flex justify-start items-center gap-3">
            <Logo />
            <Title />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

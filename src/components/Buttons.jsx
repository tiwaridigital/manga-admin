import React from 'react';

export const PurpleGradientButton = ({ btnText, href, onclick }) => {
  return (
    <button
      onClick={onclick}
      classNameName="rounded-lg px-3 py-2 m-1 overflow-hidden relative group cursor-pointer border-2 font-medium border-indigo-600 text-indigo-600 text-white"
    >
      <span classNameName="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-indigo-600 top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
      <span classNameName="relative text-indigo-600 transition duration-300 group-hover:text-white ease">
        {btnText}
      </span>
    </button>
  );
};

export const GreenGradientButton = ({ btnText, onclick, color }) => {
  return (
    <button
      onClick={onclick}
      className="relative px-5 py-2 font-medium text-white group"
    >
      <span
        className={`absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-0 -skew-x-12 bg-${color}-500 group-hover:bg-${color}-700 group-hover:skew-x-12`}
      ></span>
      <span
        className={`absolute inset-0 w-full h-full transition-all duration-300 ease-out transform skew-x-12 bg-${color}-700 group-hover:bg-${color}-500 group-hover:-skew-x-12`}
      ></span>
      <span
        className={`absolute bottom-0 left-0 hidden w-10 h-20 transition-all duration-100 ease-out transform -translate-x-8 translate-y-10 bg-${color}-600 -rotate-12`}
      ></span>
      <span
        className={`absolute bottom-0 right-0 hidden w-10 h-20 transition-all duration-100 ease-out transform translate-x-10 translate-y-8 bg-${color}-400 -rotate-12`}
      ></span>
      <span className="relative">{btnText}</span>
    </button>
  );
};

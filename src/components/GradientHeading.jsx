import React from 'react';

const GradientHeading = ({ text, fontSize = 20 }) => {
  return (
    <h1
      className={`text-[20px] md:text-[${fontSize}px] pb-[10px] font-sans font-bold tracking-tight inline from-[#f89e00] to-[#da2f68] bg-clip-text text-transparent bg-gradient-to-b`}
    >
      {text}
    </h1>
  );
};

export default GradientHeading;

import React from 'react';

const ContentWrapper = ({ children, maxWidth = 1360 }) => {
  return (
    <div className={`w-full max-w-[${maxWidth}px] mx-auto px-[20px]`}>
      {children}
    </div>
  );
};

export default ContentWrapper;

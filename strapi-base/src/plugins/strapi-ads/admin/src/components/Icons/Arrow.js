import React from 'react';

const Arrow = ({ stroke = '#fff', style, rotateArrow }) => {
  // console.log('stroke:', stroke);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20px"
      height="20px"
      viewBox="0 0 20 20"
      fill="none"
      // style={style}
      style={rotateArrow ? { ...style, transform: `rotate(45deg)` } : style}
    >
      <path
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4.343 15.657L15.657 4.343m0 0v9.9m0-9.9h-9.9"
      />
    </svg>
  );
};

export default Arrow;

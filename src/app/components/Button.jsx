'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const Button = ({ type = 'button', children, colourClass, customClassName, icon, iconSide, link, title, isDisabled = false, textSize, fontWeight, onClick }) => {
  const router = useRouter();
  const baseClasses = "flex px-4 py-2 rounded-xl shadow-sm transition-colors duration-300";

  const colourClasses = {
    pink: "bg-pink-200 text-pink-600 border border-pink-600",
    pinkStrong: "bg-pink-400 text-pink-800 border border-pink-800",
    pinkSolid: "bg-pink-800 text-white font-bold",
    green: "bg-green-200 text-green-400 border border-green-400",
    greenSolid: "bg-green-400 text-green-200 font-bold",
    default: "bg-gray-100 text-gray-600 border border-gray-600",
  }

  const handleClick = () => {
    if (link) {
      router.push(link);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={handleClick}
      className={`${baseClasses} ${customClassName} ${colourClass ? colourClasses[colourClass] : colourClasses["default"]} ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
    >
      <div className="flex flex-row items-center gap-2 text-center">
        {icon && iconSide === "left" && <span>{icon}</span>}
        <span className={`${fontWeight || 'font-reg'} ${textSize || 'text-lg'}`}>{title}</span>
        {icon && iconSide === "right" && <span>{icon}</span>}
      </div>
      {children}
    </button>
  );
};

export default Button;

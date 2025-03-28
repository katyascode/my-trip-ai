'use client';

import React from 'react';

const InputField = ({ type, value, onChange, label, placeholder }) => {
  if (type === 'checkbox') {
    return (
      <div className="flex flex-row items-center justify-center space-x-2">
        <input
          type="checkbox"
          checked={value}
          onChange={onChange}
          className="w-4 h-4 border-[1.5px] border-pink-600 focus:outline-none focus:border-pink-600 focus:bg-pink-200 transition-all duration-300"
        />
        <label>{label}</label>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-1.5">
      <label className="font-semibold">{label}</label>
      <input
        type={type}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-lg shadow-md border-[1px] border-pink-600
          focus:outline-none focus:border-pink-600 focus:bg-pink-200
          ${type === 'date' ? 'placeholder-gray-400' : ''}
          transition-all duration-300`}
      />
    </div>
  );
};

export default InputField;

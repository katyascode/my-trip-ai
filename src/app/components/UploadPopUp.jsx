"use client";

import React from "react";

const UploadPopUp = ({
  isOpen,
  onClose,
  onUpload,
  selectedFile,
  previewURL,
}) => {
  const handleUpload = () => {
    if (!selectedFile) {
      alert("No file selected.");
      return;
    }

    onUpload({
      name: selectedFile.name,
      url: URL.createObjectURL(selectedFile),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">
          Preview & Upload Document
        </h2>

        {previewURL && (
          <div className="mt-4">
            <p className="font-medium mb-1">Preview:</p>
            <img
              src={previewURL}
              alt="Preview"
              className="w-full max-h-48 rounded-md object-contain"
            />
          </div>
        )}

        <div className="flex justify-center mt-6 gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-pink-600 text-white font-semibold rounded hover:bg-pink-700"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPopUp;
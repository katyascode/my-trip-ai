"use client";

import React from "react";

const DocumentViewerPopUp = ({ isOpen, onClose, files = [], tripId, deleteFile }) => {
  if (!isOpen) return null;

  const tripFiles = files.filter(file => file.tripId === tripId);

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-center text-green-700 mb-4">Uploaded Documents</h2>

        {tripFiles.length === 0 ? (
          <p className="text-gray-500 text-center">No documents uploaded yet.</p>
        ) : (
          <ul className="list-disc list-inside space-y-2">
            {tripFiles.map((file) => (
              <li key={file.id} className="flex justify-between items-center">
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  {file.name}
                </a>
                <button
                  onClick={() => {
                    const confirmDelete = window.confirm(`Are you sure you want to delete "${file.name}"?`);
                    if (confirmDelete) deleteFile(file.id);
                  }}
                  className="text-pink-600 hover:text-red-600 ml-2"
                >
                  ✕ Remove File
              </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex justify-center mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewerPopUp;

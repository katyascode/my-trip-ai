"use client";

import React from "react";
import Button from '@/app/components/Button';


const DocumentViewerPopUp = ({ isOpen, onClose, files = [], tripId, deleteFile }) => {
  if (!isOpen) return null;

  const tripFiles = files.filter(file => file.tripId === tripId);

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-green-800 text-center mb-4">Uploaded Documents</h2>

        {tripFiles.length === 0 ? (
          <p className="text-gray-500 text-center">No documents uploaded yet.</p>
        ) : (
          <div className="space-y-3">
            {tripFiles.map((file) => (
              <div 
                key={file.id} 
                className="flex justify-between items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <svg
                    className="w-5 h-5 text-gray-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                    </svg>
                    <div className="min-w-0 flex-1 truncate">
                      <a
                        href={file.data}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-medium truncate"
                        title={file.name}
                      >
                        {file.name}
                      </a>                    
                    </div>
                    </div>
                <button
                  onClick={() => {
                    const confirmDelete = window.confirm(`Are you sure you want to delete "${file.name}"?`);
                    if (confirmDelete) deleteFile(file.id);
                  }}
                  className="text-pink-600 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors flex-shrink-0 ml-4"
                  title="Remove file"
                >
                  <svg
                     className="w-5 h-5"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                   >
                     <path
                       strokeLinecap="round"
                       strokeLinejoin="round"
                       strokeWidth={2}
                       d="M6 18L18 6M6 6l12 12"
                     />
                     </svg>
                     </button>
                    </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-6">
          <Button
            title="Close"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentViewerPopUp;

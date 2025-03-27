"use client";

import React, { useState, useRef } from "react";
import useUploadStore from "@/app/store/uploadStore";
import useTripsStore from "@/app/store/tripsStore";
// import { Button } from "@headlessui/react";
import Button from '@/app/components/Button'; //switched to this type of button for customClass attr


const UploadPage = () => {
    const trips = useTripsStore(state => state.trips);
    const fileInputRef = useRef(null);

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewURL, setPreviewURL] = useState("");
    const [selectedTrip, setSelectedTrip] = useState("");  // State for selected trip

    const addFile = useUploadStore((state) => state.addFile);
    const deleteFile = useUploadStore((state) => state.deleteFile);
    const uploadedFiles = useUploadStore((state) => state.uploadedFiles);

    // Handle File Selection
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewURL(URL.createObjectURL(file));
        }
    };

    // Handle Form Submission
    const handleSubmit = (event) => {
        event.preventDefault();

        if (!selectedTrip) {
            alert("Please select a trip before uploading.");
            return;
        }

        if (!selectedFile) {
            alert("Please select a file to upload.");
            return;
        }

        // Add file to Zustand store with trip association
        addFile({
            file: selectedFile,
            name: selectedFile.name,
            trip: trips.find(t => t.id === selectedTrip)?.destination || "Unknown",
            tripId: selectedTrip,
        });

        // Reset form
        setSelectedFile(null);
        setPreviewURL("");
        setSelectedTrip("");
        if (fileInputRef.current){
            fileInputRef.current.value='';
        }
    };

    return (
        <div className="max-w-[800px] mx-auto px-6 py-8">
            <div className="bg-white rounded-xl p-6 shadow-md border border-pink-600 text-center">
                <h2 className="text-2xl font-bold text-pink-800 mb-4">Upload File</h2>

                {/* Upload Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Trip Selection */}
                    <div className="space-y-2 mt-4">
                        <label className="block font-medium">What trip is this document for?</label>
                        <select
                            value={selectedTrip}
                            onChange={(e) => setSelectedTrip(e.target.value)}
                            className="w-full border px-3 py-2 rounded-md"
                        >
                            <option value="">Select Trip</option>
                            {trips.map((trip) => (
                                <option key={trip.id} value={trip.id}>
                                    {trip.destination}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* File Input */}
                    <div className="flex flex-col items-center space-y-2">
                        <Button
                            title="Choose File"
                            colourClass="green"
                            onClick={()=>fileInputRef.current.click()}
                            customClassName="w-full max-w-[300px]"
                        />
                        <input
                            ref={fileInputRef}
                            id="file-upload"
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        {selectedFile && (
                            <p className="text-sm text-gray-600">
                                Selected: {selectedFile.name}
                            </p>
                        )}
                    </div>


                    {/* Preview Section */}
                    {previewURL && (
                        <div className="mt-4">
                            <p className="text-lg font-semibold">File Preview:</p>
                            <img src={previewURL} alt="Preview" className="w-full h-auto rounded-md" />
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={!selectedTrip || !selectedFile}
                        className={`bg-pink-600 text-white font-bold px-4 py-2 rounded-md ${
                            !selectedTrip || !selectedFile ? 'opacity-50 cursor-not-allowed' : 'hover:bg-pink-700'
                        }`}
                    >
                        Upload File
                    </button>

                </form>

                {/* Uploaded Files List */}
                <div className="mt-8">
                    <h3 className="text-xl font-bold mt-6">Uploaded Files:</h3>
                    {uploadedFiles.length === 0 ? (
                        <p className="text-center py-4">No files uploaded yet</p>
                    ) : (
                        <div className="space-y-3">
                            {uploadedFiles.map((file) => (
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
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <a 
                                                href={file.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 underline hover:text-blue-800 font-medium truncate"
                                                title={file.name}
                                            >
                                            {file.name} 
                                        </a>
                                        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full whitespace-nowrap">
                                            {file.trip}
                                        </span>
                                    </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => deleteFile(file.id)}
                                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors flex-shrink-0 ml-4"
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
            </div>
        </div>
    </div>
);
};

export default UploadPage;

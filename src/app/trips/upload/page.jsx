"use client";

import React, { useState } from "react";
import useUploadStore from "@/app/store/uploadStore";
import useTripsStore from "@/app/store/tripsStore";

const UploadPage = () => {
    const trips = useTripsStore(state => state.trips);

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
            name: selectedFile.name,
            url: URL.createObjectURL(selectedFile),
            trip: trips.find(t => t.id === selectedTrip)?.destination || "Unknown",
            tripId: selectedTrip,
        });

        // Reset form
        setSelectedFile(null);
        setPreviewURL("");
        setSelectedTrip("");
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
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="bg-green-200 text-green-400 rounded-lg px-2 py-1.5"
                    />

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
                <h3 className="text-xl font-bold mt-6">Uploaded Files:</h3>
                <ul>
                    {uploadedFiles && uploadedFiles.map((file) => (
                        <li key={file.id} className="flex justify-between items-center mt-2">
                            <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline hover:text-blue-800"
                            >
                            {file.name} ({file.trip})
                            </a>

                            <button
                                onClick={() => deleteFile(file.id)}
                                className="text-pink-600 hover:text-red-600 ml-2"
                            >
                                ✕ Remove File
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default UploadPage;

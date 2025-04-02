'use client';

import React, { useState } from "react";
import useUploadStore from "@/app/store/uploadStore";
import useTripsStore from "@/app/store/tripsStore";
import mammoth from "mammoth";
import Button from "@/app/components/Button";

const UploadPage = () => {
    const trips = useTripsStore(state => state.trips);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewURL, setPreviewURL] = useState("");
    const [selectedTrip, setSelectedTrip] = useState("");
    const [fileError, setFileError] = useState("");

    const addFile = useUploadStore(state => state.addFile);
    const deleteFile = useUploadStore(state => state.deleteFile);
    const uploadedFiles = useUploadStore(state => state.uploadedFiles);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        console.log("File selected:", file);
        setFileError("");

        if (file) {
            if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"){
                setSelectedFile(file);
                setPreviewURL(URL.createObjectURL(file));
            }
            else{
                setSelectedFile(file);
                setPreviewURL("");
                setFileError("Please select a DOCX file");
            }
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("Submit clicked");

        if (!selectedTrip) {
            alert("Please select a trip before uploading.");
            console.error("No trip selected");
            return;
        }

        if (!selectedFile) {
            alert("Please select a file to upload.");
            console.error("No file selected");
            return;
        }

        console.log("Uploading file:", selectedFile.name, "for trip:", selectedTrip);

        let text = "";
        if (selectedFile.type === "application/pdf") {
            console.log("Processing PDF file...");
            text = await getItems(URL.createObjectURL(selectedFile));
            console.log("Extracted text from PDF:", text);
        } else if (selectedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            console.log("Processing DOCX file...");
            text = await extractTextFromDocx(selectedFile);
            console.log("Extracted text from DOCX:", text);
        }

        const newFile = {
            name: selectedFile.name,
            text: text,
            url: URL.createObjectURL(selectedFile),
            trip: trips.find(t => t.id === selectedTrip)?.destination || "Unknown",
            tripId: selectedTrip,
        };

        console.log("Adding file to store:", newFile);
        addFile(newFile);

        setSelectedFile(null);
        setPreviewURL("");
        setSelectedTrip("");
    };

    const extractTextFromDocx = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const arrayBuffer = event.target.result;
                mammoth.extractRawText({ arrayBuffer })
                    .then((result) => {
                        resolve(result.value);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            };
            reader.readAsArrayBuffer(file);
        });
    };

    return (
        <div className="max-w-[800px] mx-auto px-6 py-8">
            <div className="bg-white rounded-xl p-6 shadow-md border border-pink-600 text-center">
                <h2 className="text-2xl font-bold text-pink-800 mb-4">Upload File</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2 mt-4">
                        <label className="block font-medium">What trip is this document for?</label>
                        <select
                            value={selectedTrip}
                            onChange={(e) => setSelectedTrip(e.target.value)}
                            className="w-full border px-4 py-3 rounded-lg border-pink-600 shadow-md focus:outline-none focus:ring-1 focus:ring-pink-600"
                        >
                            <option value="">Select Trip</option>
                            {trips.map((trip) => (
                                <option key={trip.id} value={trip.id}>
                                    {trip.destination}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mt-4 flex justify-center">
                        <Button
                            onClick={() => document.querySelector('input[type="file"]').click()}
                            colourClass="green"
                            title="Choose File"
                        />
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                            accept=".docx"
                        />
                        {fileError ? (
                            <div className="mt-2 text-sm text-red-600">
                                {fileError}
                            </div>
                        ) : selectedFile && (
                            <div className="mt-2 text-sm text-gray-600">
                                Selected: {selectedFile.name}
                            </div>
                        )}
                    </div>

                    {previewURL && (
                        <div className="mt-4">
                            <p className="text-lg font-semibold">File Preview:</p>
                            <img src={previewURL} alt="Preview" className="w-full h-auto rounded-md" />
                        </div>
                    )}

                    <div className="flex justify-center">
                        <Button
                            type="submit"
                            disabled={!selectedTrip || !selectedFile}
                            colourClass={!selectedTrip || !selectedFile ? "default" : "pinkSolid"}
                            title="Upload File"
                        />
                    </div>
                </form>

                {uploadedFiles && uploadedFiles.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-xl font-bold mb-4">Uploaded Files:</h3>
                        <ul className="space-y-2">
                            {uploadedFiles.map((file) => (
                                <li key={file.id} className="flex items-center bg-gray-50 rounded-md px-3 py-2">
                                    <span className="text-gray-600 flex-shrink-0 mr-2">📄</span>
                                    <div className="flex-1 min-w-0 flex items-baseline">
                                        <a
                                            href={file.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 truncate mr-1"
                                            title={file.name}
                                        >
                                            {file.name}
                                        </a>
                                        <span className="text-gray-400 text-sm flex-shrink-0 bg-gray-200 px-1.5 py-0.5 rounded">
                                            {file.trip}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            console.log("Deleting file:", file.id);
                                            deleteFile(file.id);
                                        }}
                                        className="text-red-500 hover:text-red-700 flex-shrink-0 ml-2 px-1"
                                    >
                                        X
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadPage;

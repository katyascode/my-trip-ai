import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUploadStore = create(
  persist(
    (set, get) => ({
      uploadedFiles: [],

      addFile: (fileData) => {
        const id = Math.random().toString(36).substr(2, 9); // Unique ID
        const reader = new FileReader();
        reader.readAsDataURL(fileData.file);
        reader.onloadend = ()=>{
          set((state) => ({
            uploadedFiles: [...state.uploadedFiles, { 
              id,
              name: fileData.name,
              trip: fileData.trip,
              tripId: fileData.tripId,
              data: reader.result 
            }]
          }));
        }
      
        // return id;
      },

      getFileById: (id) => get().uploadedFiles.find(file => file.id === id),

      deleteFile: (id) => {
        set((state) => ({
          uploadedFiles: state.uploadedFiles.filter(file => file.id !== id)
        }));
      }
    }),
    {
      name: "upload-storage", // Key name in local storage
    }
  )
);

export default useUploadStore;

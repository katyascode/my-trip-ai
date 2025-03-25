import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUploadStore = create(
  persist(
    (set, get) => ({
      uploadedFiles: [],

      addFile: (file) => {
        const id = Math.random().toString(36).substr(2, 9); // Unique ID
        set((state) => ({
          uploadedFiles: [...state.uploadedFiles, { ...file, id }]
        }));
        return id;
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

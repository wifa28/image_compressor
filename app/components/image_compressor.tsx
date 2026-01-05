"use client";

import { useState, useRef } from "react";

export default function ImageCompressor() {
  // 1. menyimpan file yang dipilih user
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // 2. status loading saat proses compress
  const [loading, setLoading] = useState(false);

  // 3. pesan error (kalau ada)
  const [error, setError] = useState<string | null>(null);

  // 4. saat user pilih file
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  }

  // 5. saat klik tombol Compress
  async function handleCompress() {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/compress", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Gagal mengompres gambar");
      }

      const blob = await res.blob();

      // trigger download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "compressed-image.jpg";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError("Terjadi kesalahan saat compress");
    } finally {
      setLoading(false);
    }

    // reset state & input
    setFile(null);
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  // 6. Saat telah selesai download, file hilang
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 7. Drag & Drop
  const [isDragging, setIsDragging] = useState(false);

  //8. Handlers untuk drag & drop
  async function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const selectedFile = files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  }

  // 9. Hapus file yang telah dipilih
  function removeFile() {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setFile(null);
    setPreview(null);

    // reset input file agar file yang sama bisa dipilih lagi
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Image Compressor
        </h1>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="fileInput"
        />

        <div
          onDragOver={handleDragOver} 
          onDragLeave={handleDragLeave} 
          onDrop={handleDrop}
          onClick={() => {
            if (!file) {
              fileInputRef.current?.click();
            }
          }}
          className={`mb-4 border-2 border-dashed rounded-lg p-6 transition cursor-pointer text-center
            ${isDragging || !!file
              ? "border-blue-500 bg-blue-50 text-blue-600"
              : "border-gray-300 text-gray-500 hover:border-blue-500 hover:text-blue-600"
            }
      `}
        >
          {preview && (
            <div className="relative flex justify-center mb-4">
              <button
                type="button"
                onClick={removeFile}
                className="absolute -top-2 -right-2 bg-white text-gray-600 rounded-full p-1 shadow hover:bg-red-500 hover:text-white transition enabled:cursor-pointer"
              >
                ✕
              </button>

              <img
                src={preview}
                alt="Preview"
                className="max-h-64 rounded shadow"
              />
            </div>
          )}

          {file ? file.name : "Klik atau drag & drop gambar di sini"}
        </div>

        <button
          onClick={handleCompress}
          disabled={!file || loading}
          className="w-full bg-blue-500 text-white py-2 rounded-lg transition-all duration-200 enabled:hover:bg-blue-700 enabled:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Compressing..." : "Compress"}
        </button>

        {error && (
          <p className="text-red-500 text-sm mt-4 text-center">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

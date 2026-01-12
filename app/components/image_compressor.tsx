"use client";

import { useState, useRef } from "react";

export default function ImageCompressor() {
  // 1. menyimpan file yang dipilih user
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedPreview, setCompressedPreview] = useState<string | null>(null);


  // 2. status loading saat proses compress
  const [loading, setLoading] = useState(false);

  // 3. pesan error (kalau ada)
  const [error, setError] = useState<string | null>(null);

  // 4. saat user pilih file
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    const selectedFile = e.target.files[0];

    const errorMessage = validateImage(selectedFile);
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    // 🔥 RESET ERROR
    setError(null);

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setOriginalSize(selectedFile.size);

    setCompressedBlob(null);
    setCompressedPreview(null);

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

      setCompressedBlob(blob);
      setCompressedPreview(URL.createObjectURL(blob));

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

    const errorMessage = validateImage(selectedFile);
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    // 🔥 RESET ERROR
    setError(null);

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
    setCompressedBlob(null);
    setCompressedPreview(null);
    setOriginalSize(null);

    // reset input file agar file yang sama bisa dipilih lagi
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  // 10. Image Validation
  function validateImage(file: File): string | null {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "File harus berupa gambar (JPG, PNG, WEBP)";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "Ukuran gambar maksimal 5MB";
    }

    return null; // valid
  }


  return (
    <section>
      <div>
        <h1 className="text-4xl font-extrabold text-center">
          Compress images in seconds
        </h1>

        <p className="mt-3 text-center text-gray-600">
          Upload once. Done in seconds.
        </p>
      </div>
      <div className="mt-10 flex justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white border border-[#6E026F]/20 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold text-center mb-6 text-[#6E026F]">
            Image Compressor
          </h1>

          {!compressedBlob && (
            <>
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
                    ? "border-[#6E026F]/30 bg-purple-50 text-[#6E026F]"
                    : "border-gray-300 text-gray-500 hover:border-[#6E026F] hover:text-[#6E026F]"
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

              {error ? (
                <p className="mb-4 text-red-500 text-sm mt-4 text-center">
                  {error}
                </p>
              ) : (
                <p className="mb-4 text-xs text-gray-400 text-center mt-2">
                  JPG, PNG, WEBP • Maks 5MB
                </p>
              )}


              <button
                onClick={handleCompress}
                disabled={!file || loading}
                className="w-full bg-[#6E026F] text-white py-2 rounded-lg transition-all duration-200 enabled:hover:bg-[#5a015c] enabled:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Compressing..." : "Compress"}
              </button>
            </>
          )}

          {compressedBlob && (
            <>
              <div className="mb-4 border-2 border-dashed border-blue-500 bg-blue-50 rounded-lg p-6 transition cursor-pointer text-center">
                <img
                  src={compressedPreview!}
                  alt="Compressed Preview"
                  className="block mx-auto max-h-64 rounded shadow"
                />

                {originalSize && (
                  <p className="text-gray-800 text-sm mt-4 text-center">
                    Ukuran awal: {(originalSize / 1024).toFixed(1)} KB
                  </p>
                )}
                <p className="text-gray-800 text-sm mt-4 text-center">
                  Ukuran hasil: {(compressedBlob.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <div className="flex gap-3 mt-4">
                {/* Compress another — kiri */}
                <button
                  onClick={removeFile}
                  className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 py-2 rounded-lg enabled:cursor-pointer transition"
                >
                  Compress another
                </button>

                {/* Download — kanan */}
                <button
                  onClick={() => {
                    if (!compressedBlob) return;

                    const url = URL.createObjectURL(compressedBlob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "compressed-image.jpg";
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="flex-1 bg-emerald-500 text-white hover:bg-emerald-600 py-2 rounded-lg enabled:cursor-pointer transition"
                >
                  Download
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}   

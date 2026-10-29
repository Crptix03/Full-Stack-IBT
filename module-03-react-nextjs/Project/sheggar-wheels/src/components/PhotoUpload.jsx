"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2, Camera } from "lucide-react";

export default function PhotoUpload({ name = "photo", defaultValue = "" }) {
  const [preview, setPreview]   = useState(defaultValue || null);
  const [path, setPath]         = useState(defaultValue || "");
  const [uploading, setUploading] = useState(false);
  const [error, setError]       = useState("");
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setError("");
    setUploading(true);

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res  = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Upload failed");
        setUploading(false);
        return;
      }

      setPath(data.path);
      setPreview(data.path);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setPath("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      {/* Hidden input that carries the saved path into the form */}
      <input type="hidden" name={name} value={path} />

      {preview ? (
        /* Preview */
        <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-100">
          <Image
            src={preview}
            alt="Car photo preview"
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-cover"
          />
          {/* Remove button */}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white shadow transition-colors"
            aria-label="Remove photo"
          >
            <X className="w-4 h-4 text-neutral-600" />
          </button>
          {/* Replace overlay */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 text-neutral-700 text-xs font-semibold rounded-lg hover:bg-white shadow transition-colors"
          >
            <Camera className="w-3.5 h-3.5" />
            Change photo
          </button>
        </div>
      ) : (
        /* Drop zone */
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="w-full h-48 rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
        >
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
              <p className="text-sm text-indigo-600 font-medium">Uploading…</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                <Upload className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-neutral-700">
                  Click to upload or drag & drop
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  JPEG, PNG or WebP · max 5 MB
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
      />

      {error && (
        <p className="text-red-600 text-xs mt-2">{error}</p>
      )}
    </div>
  );
}

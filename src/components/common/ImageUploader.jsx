import React, { useState, useRef } from 'react';
import uploadService from '../../services/uploadService';

export default function ImageUploader({
  value,
  onChange,
  folder = 'general',
  label = 'Photograph / Image',
  helperText = 'JPG, PNG or WEBP up to 10MB',
  required = false,
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    if (!file) return;
    setErrorMessage('');
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const result = await uploadService.uploadImage(file, {
        folder,
        onProgress: (percent) => setUploadProgress(percent),
      });

      if (result?.url) {
        onChange(result.url, result);
      } else {
        throw new Error('Upload succeeded but no URL was returned.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to upload image.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleRemove = () => {
    onChange('', null);
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <label className="font-semibold text-[#1C1917] text-xs flex items-center gap-1">
            <span>{label}</span>
            {required && <span className="text-red-500">*</span>}
          </label>
          <span className="text-[10px] text-[#7A7168] flex items-center gap-1 font-mono">
            <span className="material-symbols-outlined text-[13px] text-[#065F46]">cloud_done</span>
            <span>Cloudinary Powered</span>
          </span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files?.[0])}
      />

      {value ? (
        <div className="relative group rounded-xl border border-[#E7E0D4] bg-[#FAF8F4] p-2 flex items-center gap-3 overflow-hidden">
          <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-black/5 shrink-0 border border-[#E7E0D4]">
            <img
              src={value}
              alt="Uploaded media"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1C1917]">
              <span className="material-symbols-outlined text-sm text-[#065F46]">verified</span>
              <span className="truncate">Cloudinary Asset Stored</span>
            </div>
            <p className="text-[11px] text-[#7A7168] truncate mt-0.5 font-mono">{value}</p>
            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="text-[11px] font-semibold text-[#065F46] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xs">sync</span>
                <span>Change Photo</span>
              </button>
              <span className="text-[#E7E0D4]">•</span>
              <button
                type="button"
                onClick={handleRemove}
                disabled={isUploading}
                className="text-[11px] font-semibold text-red-600 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xs">delete</span>
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-4 transition-all text-center cursor-pointer ${
            isDragOver
              ? 'border-[#065F46] bg-[#065F46]/5 scale-[0.99]'
              : 'border-[#E7E0D4] hover:border-[#065F46]/60 bg-[#FAF8F4]/80 hover:bg-[#FAF8F4]'
          } ${isUploading ? 'pointer-events-none opacity-80' : ''}`}
        >
          {isUploading ? (
            <div className="py-3 flex flex-col items-center">
              <div className="w-8 h-8 border-2 border-[#065F46]/30 border-t-[#065F46] rounded-full animate-spin mb-2" />
              <p className="text-xs font-semibold text-[#1C1917]">Uploading to Cloudinary...</p>
              <div className="w-48 bg-[#E7E0D4] h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-[#065F46] h-full transition-all duration-200"
                  style={{ width: `${uploadProgress || 65}%` }}
                />
              </div>
              <span className="text-[10px] text-[#7A7168] mt-1 font-mono">{uploadProgress}% complete</span>
            </div>
          ) : (
            <div className="py-2 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#E7E0D4]/40 flex items-center justify-center text-[#065F46] mb-2">
                <span className="material-symbols-outlined text-xl">cloud_upload</span>
              </div>
              <p className="text-xs font-semibold text-[#1C1917]">
                Click to browse or drag & drop photograph
              </p>
              <p className="text-[11px] text-[#7A7168] mt-0.5">{helperText}</p>
            </div>
          )}
        </div>
      )}

      {errorMessage && (
        <div className="mt-1.5 text-[11px] text-red-600 flex items-center gap-1 bg-red-50 border border-red-200 rounded-md px-2 py-1">
          <span className="material-symbols-outlined text-xs">error</span>
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';

export default function ImageUploader({
  file,
  value,
  preview,
  onChange,
  label = 'Photograph',
  helperText = 'JPG, PNG or WEBP up to 10MB',
  required = false,
}) {
  const [errorMessage, setErrorMessage] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [objectUrl, setObjectUrl] = useState('');
  const fileInputRef = useRef(null);

  // Safely manage local object URL for preview to prevent memory leaks
  useEffect(() => {
    if (file instanceof File) {
      const url = URL.createObjectURL(file);
      setObjectUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setObjectUrl('');
    }
  }, [file]);

  const displayPreview = preview || objectUrl || (typeof value === 'string' ? value : '');
  
  // Format clean file display name without exposing cloud vendor or raw URLs
  const getDisplayFileName = () => {
    if (file?.name) return file.name;
    if (displayPreview) return 'Attached Photograph';
    return 'Selected Photograph';
  };

  const fileSizeText = file?.size
    ? file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`
    : '';

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    setErrorMessage('');

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(selectedFile.type)) {
      setErrorMessage('Please select a valid image file (JPG, PNG, or WEBP).');
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setErrorMessage('Image size exceeds 10MB. Please choose a smaller photo.');
      return;
    }

    const previewUrl = URL.createObjectURL(selectedFile);
    onChange(selectedFile, previewUrl);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange(null, '');
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
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files?.[0])}
      />

      {displayPreview ? (
        <div className="relative rounded-xl border border-[#E7E0D4] bg-[#FAF8F4] p-3 flex items-center gap-3.5">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#E7E0D4]/30 shrink-0 border border-[#E7E0D4]">
            <img
              src={displayPreview}
              alt="Selected photograph"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0 pr-2">
            <p className="text-xs font-semibold text-[#1C1917] truncate">
              {getDisplayFileName()}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              {fileSizeText && (
                <span className="text-[11px] text-[#7A7168] font-mono">{fileSizeText}</span>
              )}
              {file && (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                  <span className="material-symbols-outlined text-[11px]">check_circle</span>
                  Ready to publish
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 mt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] font-semibold text-[#065F46] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xs">sync</span>
                <span>Change Photo</span>
              </button>
              <span className="text-[#E7E0D4]">•</span>
              <button
                type="button"
                onClick={handleRemove}
                className="text-[11px] font-semibold text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
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
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-5 transition-all text-center cursor-pointer ${
            isDragOver
              ? 'border-[#065F46] bg-[#065F46]/5 scale-[0.99]'
              : 'border-[#E7E0D4] hover:border-[#065F46]/60 bg-[#FAF8F4]/80 hover:bg-[#FAF8F4]'
          }`}
        >
          <div className="py-2 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-[#E7E0D4]/40 flex items-center justify-center text-[#065F46] mb-2">
              <span className="material-symbols-outlined text-xl">add_photo_alternate</span>
            </div>
            <p className="text-xs font-semibold text-[#1C1917]">
              Click to browse or drag & drop photograph
            </p>
            <p className="text-[11px] text-[#7A7168] mt-0.5">{helperText}</p>
          </div>
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

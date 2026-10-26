import axios from 'axios';
import apiClient from './apiClient';

const CLOUDINARY_CLOUD_NAME = import.meta.env?.VITE_CLOUDINARY_CLOUD_NAME || 'rdummyjd';
const CLOUDINARY_UPLOAD_PRESET = import.meta.env?.VITE_CLOUDINARY_UPLOAD_PRESET || 'hit_foundation';

export const uploadService = {
  uploadImage: async (file, { folder = 'gallery', onProgress } = {}) => {
    if (!file) {
      throw new Error('No image file selected.');
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Allowed formats: JPG, PNG, WEBP.');
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('Image size exceeds 10MB limit.');
    }

    try {
      const directForm = new FormData();
      directForm.append('file', file);
      directForm.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      if (folder) directForm.append('folder', `hit_foundation/${folder}`);

      const directRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        directForm,
        {
          onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              onProgress(percent);
            }
          },
        }
      );

      return {
        url: directRes.data.secure_url || directRes.data.url,
        publicId: directRes.data.public_id,
        format: directRes.data.format,
        width: directRes.data.width,
        height: directRes.data.height,
        bytes: directRes.data.bytes,
      };
    } catch (directError) {
      try {
        const formData = new FormData();
        formData.append('image', file);
        if (folder) formData.append('folder', folder);

        const response = await apiClient.post('/upload/image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              onProgress(percent);
            }
          },
        });

        if (response?.data?.url) {
          return response.data;
        }
        if (response?.url) {
          return response;
        }
      } catch (backendError) {
        throw new Error(
          directError.response?.data?.error?.message ||
          backendError.response?.data?.error ||
          backendError.response?.data?.message ||
          'Failed to upload image. Please try again.'
        );
      }
    }
  },

  uploadDocument: async (file, { folder = 'documents', onProgress } = {}) => {
    if (!file) {
      throw new Error('No document file selected.');
    }

    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid document format. Allowed: PDF, JPG, PNG.');
    }

    const maxSize = 15 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('Document size exceeds 15MB limit.');
    }

    try {
      const directForm = new FormData();
      directForm.append('file', file);
      directForm.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      if (folder) directForm.append('folder', `hit_foundation/${folder}`);

      const directRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
        directForm,
        {
          onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              onProgress(percent);
            }
          },
        }
      );

      return {
        url: directRes.data.secure_url || directRes.data.url,
        publicId: directRes.data.public_id,
        bytes: directRes.data.bytes,
      };
    } catch (directError) {
      try {
        const formData = new FormData();
        formData.append('document', file);
        if (folder) formData.append('folder', folder);

        const response = await apiClient.post('/upload/document', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              onProgress(percent);
            }
          },
        });

        if (response?.data?.url) {
          return response.data;
        }
        if (response?.url) {
          return response;
        }
      } catch (backendError) {
        throw new Error(
          directError.response?.data?.error?.message ||
          backendError.response?.data?.error ||
          backendError.response?.data?.message ||
          'Failed to upload document. Please try again.'
        );
      }
    }
  },
};

export default uploadService;

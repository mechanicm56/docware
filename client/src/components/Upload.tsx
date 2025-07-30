import React, { useState, useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import API from '../axios';

interface Props {
  onClose: () => void;
  onUploaded: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const UploadModal: React.FC<Props> = ({ onClose, onUploaded }) => {
  const [progress, setProgress] = useState<number | null>(null);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError('');
      const file = acceptedFiles[0];
      if (!file) return;

      setStatus('');
      setProgress(0);

      try {
        const formData = new FormData();
        formData.append('file', file);

        await API.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e) => {
            if (e.total) {
              const percent = Math.round((e.loaded * 100) / e.total);
              setProgress(percent);
              if (percent === 100) {
                setTimeout(() => {
                  onUploaded(); // refresh files
                  onClose(); // close modal
                }, 1000);
              }
            }
          },
        });

        setStatus('Scan in progress...');
      } catch (err) {
        setStatus('Upload failed');
      }
    },
    [onClose, onUploaded]
  );

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    if (fileRejections.length === 0) return;
    const rejection = fileRejections[0];
    // Check for size error
    const sizeError = rejection.errors.find(e => e.code === 'file-too-large');
    if (sizeError) {
      setError('File is too large. Maximum size allowed is 5MB.');
      return;
    }
    // Other errors, e.g. invalid file type
    const typeError = rejection.errors.find(e => e.code === 'file-invalid-type');
    if (typeError) {
      setError('Invalid file type. Allowed: PDF, DOCX, JPG, PNG.');
      return;
    }
    // Generic fallback
    setError('File rejected. Please check file type and size.');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md relative">
        <button
          className="absolute top-2 right-3 text-xl text-gray-500 hover:text-black"
          onClick={onClose}
          aria-label="Close upload modal"
        >
          &times;
        </button>
        <h2 className="text-lg font-semibold mb-4">Upload File</h2>

        <div
          {...getRootProps()}
          className={`border-dashed border-2 p-10 text-center cursor-pointer bg-gray-50 ${
            isDragActive ? 'border-blue-500 bg-blue-100' : 'border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <p>{isDragActive ? 'Drop the file here ...' : 'Drag & drop a file here, or click to select'}</p>
        </div>

        {error && <p className="mt-4 text-red-600">{error}</p>}

        {progress !== null && (
          <div className="mt-4">
            <p className="text-sm text-gray-700">Progress: {progress}%</p>
            <div className="w-full bg-gray-200 h-2 rounded">
              <div
                className="bg-blue-500 h-2 rounded"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {status && <p className="mt-4 text-blue-600">{status}</p>}
      </div>
    </div>
  );
};

export default UploadModal;

import React from 'react';
import { FileEntry } from './FileTable';

interface Props {
  file: FileEntry;
  onClose: () => void;
}

const FileMetadataModal: React.FC<Props> = ({ file, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md relative">
        <button
          className="absolute top-2 right-3 text-xl text-gray-500 hover:text-black"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-lg font-semibold mb-4">File Metadata</h2>
        <ul className="text-sm space-y-2">
          <li><strong>Filename:</strong> {file.filename}</li>
          {/* <li><strong>Path:</strong> {file.path || 'N/A'}</li> */}
          <li><strong>Status:</strong> {file.status}</li>
          <li><strong>Result:</strong> {file.result || 'Pending'}</li>
          <li><strong>Uploaded At:</strong> {new Date(file.uploadedAt).toLocaleString()}</li>
          <li><strong>Scanned At:</strong> {file.scannedAt ? new Date(file.scannedAt).toLocaleString() : 'Not yet scanned'}</li>
        </ul>
      </div>
    </div>
  );
};

export default FileMetadataModal;

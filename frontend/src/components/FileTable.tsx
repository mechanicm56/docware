// import React, { useState } from 'react';
// import FileMetadataModal from './FileInfo';

// export interface FileEntry {
//   _id: string;
//   filename: string;
//   path?: string;
//   status: 'pending' | 'scanned';
//   result: 'clean' | 'infected' | null;
//   uploadedAt: string;
//   scannedAt: string | null;
// }

// interface Props {
//   files: FileEntry[];
// }

// const FileTable: React.FC<Props> = ({ files }) => {
//   const [selectedFile, setSelectedFile] = useState<FileEntry | null>(null);

//   const getColorClass = (status: string, result: string | null) => {
//     if (status === 'pending') return 'text-yellow-600';
//     if (result === 'infected') return 'text-red-600';
//     return 'text-green-600';
//   };

//   return (
//     <>
//       <table className="w-full border mt-4">
//         <thead>
//           <tr className="bg-gray-100 text-left">
//             <th className="p-2">Filename</th>
//             <th className="p-2">Status</th>
//             <th className="p-2">Result</th>
//             <th className="p-2">Uploaded</th>
//             <th className="p-2">Scanned</th>
//           </tr>
//         </thead>
//         <tbody>
//           {files.map((file) => (
//             <tr key={file._id} className="border-t">
//               <td
//                 className="p-2 text-blue-600 hover:underline cursor-pointer"
//                 onClick={() => setSelectedFile(file)}
//               >
//                 {file.filename}
//               </td>
//               <td className={`p-2 ${getColorClass(file.status, file.result)}`}>{file.status}</td>
//               <td className={`p-2 ${getColorClass(file.status, file.result)}`}>{file.result || 'Scanning...'}</td>
//               <td className="p-2">{new Date(file.uploadedAt).toLocaleString()}</td>
//               <td className="p-2">{file.scannedAt ? new Date(file.scannedAt).toLocaleString() : '-'}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {selectedFile && (
//         <FileMetadataModal
//           file={selectedFile}
//           onClose={() => setSelectedFile(null)}
//         />
//       )}
//     </>
//   );
// };

// export default FileTable;

import React, { useState } from 'react';

export interface FileEntry {
  _id: string;
  filename: string;
  path: string;
  status: 'pending' | 'scanned';
  result: 'clean' | 'infected' | null;
  uploadedAt: string;
  scannedAt: string | null;
}

interface Props {
  files: FileEntry[];
}

const FileTable: React.FC<Props> = ({ files }) => {
  const [selectedFile, setSelectedFile] = useState<FileEntry | null>(null);

  const openModal = (file: FileEntry) => {
    setSelectedFile(file);
  };

  const closeModal = () => {
    setSelectedFile(null);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300">
          <thead className="bg-gray-100 text-sm text-gray-700 hidden sm:table-header-group">
            <tr>
              <th className="p-2 text-left">Filename</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Result</th>
              <th className="p-2 text-left">Uploaded</th>
              <th className="p-2 text-left">Scanned</th>
            </tr>
          </thead>
          <tbody>
            {files.map(file => (
              <React.Fragment key={file._id}>
                {/* Desktop row */}
                <tr className="hidden sm:table-row hover:bg-gray-50 cursor-pointer">
                  <td
                    className="p-2 text-blue-700 hover:underline"
                    onClick={() => openModal(file)}
                  >
                    {file.filename}
                  </td>
                  <td className="p-2 capitalize">
                    {file.status === 'pending' && (
                      <span className="text-yellow-600 font-medium">Pending</span>
                    )}
                    {file.status === 'scanned' && (
                      <span className="text-green-700 font-medium">Scanned</span>
                    )}
                  </td>
                  <td className="p-2 capitalize">
                    {file.result === 'clean' && (
                      <span className="text-green-600 font-medium">Clean</span>
                    )}
                    {file.result === 'infected' && (
                      <span className="text-red-600 font-medium">Infected</span>
                    )}
                    {!file.result && <span className="text-gray-500">-</span>}
                  </td>
                  <td className="p-2 text-sm">{new Date(file.uploadedAt).toLocaleString()}</td>
                  <td className="p-2 text-sm">
                    {file.scannedAt ? new Date(file.scannedAt).toLocaleString() : '-'}
                  </td>
                </tr>

                {/* Mobile card row */}
                <tr className="sm:hidden">
                  <td className="p-4 border-t border-gray-200">
                    <div
                      className="flex justify-between items-center"
                      onClick={() => openModal(file)}
                    >
                      <div>
                        <p className="text-blue-700 font-medium underline">{file.filename}</p>
                        <p className="text-xs text-gray-500">
                          Uploaded: {new Date(file.uploadedAt).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        {file.result === 'clean' && (
                          <span className="text-green-600 text-sm font-semibold">Clean</span>
                        )}
                        {file.result === 'infected' && (
                          <span className="text-red-600 text-sm font-semibold">Infected</span>
                        )}
                        {!file.result && (
                          <span className="text-yellow-600 text-sm font-semibold">Pending</span>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* File Details Modal */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
              onClick={closeModal}
              aria-label="Close details modal"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-4">File Details</h3>
            <ul className="text-sm text-gray-800 space-y-2">
              <li><strong>Filename:</strong> {selectedFile.filename}</li>
              <li><strong>Status:</strong> {selectedFile.status}</li>
              <li><strong>Result:</strong> {selectedFile.result ?? 'Pending'}</li>
              <li><strong>Uploaded At:</strong> {new Date(selectedFile.uploadedAt).toLocaleString()}</li>
              <li><strong>Scanned At:</strong> {selectedFile.scannedAt ? new Date(selectedFile.scannedAt).toLocaleString() : '-'}</li>
              <li><strong>Path:</strong> {selectedFile.path}</li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default FileTable;


import React, { useEffect, useState } from 'react';
import API from '../axios';
import FileTable, { FileEntry } from '../components/FileTable';
import UploadModal from '../components/Upload';
import { toast } from 'react-toastify';

const LOCAL_STORAGE_KEY = 'scannedFileIds';

const Dashboard: React.FC = () => {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'scanned'>('all');
  const [resultFilter, setResultFilter] = useState<'all' | 'clean' | 'infected' | 'scanning'>('all');

  const loadScannedFromStorage = () => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return new Set<string>(stored ? JSON.parse(stored) : []);
  };

  const [scannedFileIds, setScannedFileIds] = useState<Set<string>>(loadScannedFromStorage);

  const saveScannedToStorage = (ids: Set<string>) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(Array.from(ids)));
  };

  const fetchFiles = async () => {
    const params: Record<string, string> = {};
    if (statusFilter !== 'all') params.status = statusFilter;
    if (resultFilter !== 'all') params.result = resultFilter;

    const res = await API.get<FileEntry[]>('/files', { params });
    const newFiles = res.data;

    const newScanned = new Set(scannedFileIds);

    newFiles.forEach((file: { status: string; result: string | null; _id: string; filename: any; }) => {
      const isScanned = file.status === 'scanned' && file.result !== null;
      const isAlreadyTracked = scannedFileIds.has(file._id);

      if (isScanned && !isAlreadyTracked) {
        toast.info(`File "${file.filename}" scanned: ${file.result!.toUpperCase()}`, {
          type: file.result === 'infected' ? 'error' : 'success',
        });

        newScanned.add(file._id);
      }
    });

    // Update localStorage and state
    saveScannedToStorage(newScanned);
    setScannedFileIds(newScanned);
    setFiles(newFiles);
  };

  useEffect(() => {
    fetchFiles();
    const interval = setInterval(fetchFiles, 5000);
    return () => clearInterval(interval);
  }, [statusFilter, resultFilter]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">All Files</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-5 py-1 rounded hover:bg-blue-700"
        >
          Upload
        </button>
      </div>

      <div className="mb-4 flex gap-3 justify-end items-center">
        <div>
          <label className="mr-2 font-medium text-sm">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="scanned">Scanned</option>
          </select>
        </div>

        <div>
          <label className="mr-2 font-medium text-sm">Result:</label>
          <select
            value={resultFilter}
            onChange={(e) => setResultFilter(e.target.value as any)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="all">All</option>
            <option value="clean">Clean</option>
            <option value="infected">Infected</option>
            <option value="scanning">Scanning</option>
          </select>
        </div>
      </div>

      <FileTable files={files} />

      {showModal && (
        <UploadModal
          onClose={() => setShowModal(false)}
          onUploaded={fetchFiles}
        />
      )}
    </div>
  );
};

export default Dashboard;

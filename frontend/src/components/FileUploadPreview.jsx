import React, { useState, useCallback } from 'react';
import { useToast } from './Toast';

export default function FileUploadPreview({ value, onChange, label = 'Upload Payment Slip', accept = 'image/*,.pdf', maxSizeMB = 5 }) {
  const [file, setFile] = useState(value?.file || null);
  const { addToast } = useToast();
  const [preview, setPreview] = useState(value?.preview || null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((selectedFile) => {
    if (selectedFile) {
      const maxSize = maxSizeMB * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        addToast("File must be less than 5MB! Please try a smaller file.", 'error');
        return;
      }
      setFile(selectedFile);
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
          onChange({ file: selectedFile, preview: reader.result, name: selectedFile.name });
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
        onChange({ file: selectedFile, preview: null, name: selectedFile.name });
      }
    }
  }, [onChange, maxSizeMB, addToast]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  }, [handleFile]);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback(() => setIsDragging(false), []);

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    onChange(null);
  };

  return (
    <div>
      {!file ? (
        <label
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px 20px',
            border: '2px dashed var(--border-yellow)',
            borderRadius: 'var(--radius)',
            background: isDragging ? 'var(--yellow-glow)' : 'var(--bg-tertiary)',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          <input
            type="file"
            hidden
            accept={accept}
            onChange={(e) => handleFile(e.target.files[0])}
          />
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>📄</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', textAlign: 'center' }}>
            {label}<br />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Drag & drop or click to browse (Max {maxSizeMB}MB)
            </span>
          </p>
        </label>
      ) : (
        <div style={{
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border-yellow)',
          borderRadius: 'var(--radius)',
          padding: '20px',
          textAlign: 'center'
        }}>
          {preview ? (
            <img src={preview} alt="Preview" style={{
              maxWidth: '100%',
              maxHeight: '200px',
              objectFit: 'contain',
              borderRadius: 'var(--radius)',
              marginBottom: '12px'
            }} />
          ) : (
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'var(--yellow-glow)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '36px', margin: '0 auto 12px'
            }}>
              📄
            </div>
          )}
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            {file.name}
          </p>
          <button onClick={clearFile} className="btn btn-outline btn-sm">
            Change File
          </button>
        </div>
      )}
    </div>
  );
}

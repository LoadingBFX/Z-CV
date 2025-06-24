import React, { useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useZcv } from '../../context/ZcvContext';

const UploadSection: React.FC = () => {
  const { dispatch } = useZcv();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploadStatus('uploading');
    setUploadedFile(file);

    // Simulate API call to backend
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Mock API call - replace with actual backend call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful parse
      const mockProfile = {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        education: [{
          degree: "Bachelor of Science in Computer Science",
          school: "University of Technology",
          period: "2019-2023"
        }],
        experiences: [{
          title: "Software Engineer Intern",
          company: "Tech Corp",
          period: "Summer 2022",
          impact: "Developed features that improved user engagement by 25%"
        }],
        skills: ["JavaScript", "React", "Python", "SQL"]
      };

      dispatch({ type: 'SET_PROFILE', payload: mockProfile });
      dispatch({ type: 'SET_STAGE', payload: 'chat' });
      setUploadStatus('success');
    } catch (error) {
      setUploadStatus('error');
    }
  };

  const handleSkip = () => {
    dispatch({ type: 'SET_STAGE', payload: 'chat' });
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadStatus('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Upload Your Resume
        </h2>
        <p className="text-lg text-gray-600">
          Start by uploading your existing resume, or skip to build from scratch
        </p>
      </div>

      <div className="space-y-6">
        {/* Upload Area */}
        <div
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
            ${isDragging 
              ? 'border-blue-400 bg-blue-50' 
              : uploadStatus === 'success'
              ? 'border-green-400 bg-green-50'
              : uploadStatus === 'error'
              ? 'border-red-400 bg-red-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
            }
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
          />

          {uploadStatus === 'uploading' && (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600">Analyzing your resume...</p>
            </div>
          )}

          {uploadStatus === 'success' && uploadedFile && (
            <div className="space-y-4">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
              <div>
                <p className="text-green-700 font-medium">Resume uploaded successfully!</p>
                <p className="text-sm text-gray-600 mt-1">{uploadedFile.name}</p>
              </div>
              <button
                onClick={removeFile}
                className="text-red-600 hover:text-red-700 text-sm flex items-center justify-center space-x-1"
              >
                <X className="h-4 w-4" />
                <span>Remove</span>
              </button>
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="space-y-4">
              <AlertCircle className="h-12 w-12 text-red-600 mx-auto" />
              <div>
                <p className="text-red-700 font-medium">Upload failed</p>
                <p className="text-sm text-gray-600 mt-1">Please try again with a valid resume file</p>
              </div>
              <button
                onClick={removeFile}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                Try again
              </button>
            </div>
          )}

          {uploadStatus === 'idle' && (
            <div className="space-y-4">
              <Upload className="h-12 w-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-xl font-medium text-gray-900 mb-2">
                  Drop your resume here
                </p>
                <p className="text-gray-600 mb-4">
                  or click to select a file
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Choose File
                </button>
              </div>
              <p className="text-sm text-gray-500">
                Supports PDF, DOC, DOCX formats
              </p>
            </div>
          )}
        </div>

        {/* Skip Option */}
        {uploadStatus !== 'success' && (
          <div className="text-center">
            <p className="text-gray-600 mb-4">Don't have a resume yet?</p>
            <button
              onClick={handleSkip}
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              disabled={uploadStatus === 'uploading'}
            >
              Start from scratch
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadSection;
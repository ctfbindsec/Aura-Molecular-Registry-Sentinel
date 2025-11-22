
import React, { useState, useCallback } from 'react';
import { analyzeImage } from '../services/geminiService';
import Spinner from './shared/Spinner';
import ReactMarkdown from 'react-markdown';
import { UploadCloud, FileImage, X } from 'lucide-react';

const ImageAnalyzer: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if(imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
  }

  const handleAnalyze = async () => {
    if (!imageFile || !prompt.trim()) {
      setError('Please provide an image and a descriptive prompt for analysis.');
      return;
    }
    setError('');
    setIsLoading(true);
    setResult('');
    try {
      const response = await analyzeImage(prompt, imageFile);
      setResult(response);
    } catch (err) {
      setError('An error occurred during analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setError('');
    }
  }, []);

  return (
    <div className="flex h-full p-6 gap-6 bg-slate-900 overflow-hidden">
      <div className="flex-1 flex flex-col gap-4 max-w-md">
        <h2 className="text-2xl font-bold text-cyan-400">Image Analysis Core</h2>
        <p className="text-slate-400 text-sm">Upload a molecular structure image for verification and analysis against the blockchain registry.</p>
        
        {imagePreview ? (
            <div className="relative aspect-square bg-slate-800/50 rounded-lg p-2 border-2 border-dashed border-slate-600">
                <img src={imagePreview} alt="Image preview" className="w-full h-full object-contain rounded" />
                <button onClick={handleRemoveImage} className="absolute top-2 right-2 bg-slate-900/80 rounded-full p-1.5 text-slate-300 hover:text-red-400 transition-colors">
                    <X className="w-5 h-5"/>
                </button>
            </div>
        ) : (
            <div 
                onDrop={onDrop} 
                onDragOver={onDragOver}
                className="relative aspect-square flex flex-col items-center justify-center bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-600 hover:border-cyan-500 transition-colors"
            >
              <UploadCloud className="w-12 h-12 text-slate-500 mb-2" />
              <p className="text-slate-400">Drag & drop an image or click to upload</p>
              <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isLoading}
              />
            </div>
        )}

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your analysis prompt, e.g., 'Verify this molecular structure and identify anomalies.'"
          className="w-full h-24 bg-slate-800 border border-slate-600 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-none"
          disabled={isLoading}
        />
        <button
          onClick={handleAnalyze}
          disabled={isLoading || !imageFile || !prompt.trim()}
          className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
        >
          {isLoading ? <><Spinner /> Analyzing...</> : 'Initiate Analysis'}
        </button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>

      <div className="flex-1 bg-slate-800/50 rounded-lg p-6 overflow-y-auto border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-300 mb-4">Analysis Result:</h3>
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
                <Spinner size="lg" />
                <p className="mt-4 text-slate-400">Processing image against registry...</p>
            </div>
          </div>
        )}
        {result && <ReactMarkdown className="prose prose-invert prose-sm max-w-none">{result}</ReactMarkdown>}
        {!isLoading && !result && <p className="text-slate-500 italic">Analysis output will appear here.</p>}
      </div>
    </div>
  );
};

export default ImageAnalyzer;

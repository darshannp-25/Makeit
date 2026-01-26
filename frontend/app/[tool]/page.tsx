"use client";

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Dropzone from '@/components/Dropzone';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Download, AlertCircle, ArrowLeft, FileText } from 'lucide-react';
import Link from 'next/link';

// Map URL slug to backend conversion type and readable title
const TOOL_CONFIG: Record<string, { title: string; apiType: string; accept: any }> = {
    'pdf-to-word': {
        title: 'PDF to Word',
        apiType: 'pdf-to-word',
        accept: { 'application/pdf': ['.pdf'] }
    },
    'word-to-pdf': {
        title: 'Word to PDF',
        apiType: 'word-to-pdf',
        accept: { 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] }
    },
    'image-to-pdf': {
        title: 'Image to PDF',
        apiType: 'jpg-to-pdf', // default, checks mime later
        accept: { 'image/*': ['.jpg', '.jpeg', '.png'] }
    },
    'image-convert': {
        title: 'Image Converter',
        apiType: 'image-convert',
        accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }
    },
    'compress-image': {
        title: 'Compress Image',
        apiType: 'compress-image',
        accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }
    },
    'merge-pdf': {
        title: 'Merge PDF',
        apiType: 'merge-pdf',
        accept: { 'application/pdf': ['.pdf'] }
    }
};

export default function ToolPage() {
    const params = useParams();
    const tool = params.tool as string;
    const config = TOOL_CONFIG[tool];
    const router = useRouter();

    const [files, setFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [outputFilename, setOutputFilename] = useState<string | null>(null);
    const [targetFormat, setTargetFormat] = useState('JPG');

    if (!config) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <h1 className="text-2xl font-bold mb-4">Tool not found</h1>
                <Link href="/" className="text-blue-600 hover:underline">Go Home</Link>
            </div>
        );
    }

    const handleUpload = async () => {
        if (files.length === 0) return;

        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        files.forEach(file => {
            formData.append('file', file);
        });
        formData.append('type', config.apiType);

        if (tool === 'image-convert') {
            formData.append('format', targetFormat);
        }

        try {
            const response = await axios.post('http://localhost:5000/convert', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.download_url) {
                setDownloadUrl(response.data.download_url);
                setOutputFilename(response.data.filename);
            }
        } catch (err: any) {
            setError(err.response?.data?.error || "An error occurred during conversion.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <Link href="/" className="inline-flex items-center text-slate-500 hover:text-slate-800 mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tools
            </Link>

            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{config.title}</h1>
                <p className="text-slate-500">Fast, secure, and free.</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-8">

                {!downloadUrl ? (
                    <AnimatePresence mode='wait'>
                        {files.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                key="dropzone"
                            >
                                <Dropzone
                                    onFileSelect={(selected) => setFiles(selected)}
                                    accept={config.accept}
                                    maxFiles={tool === 'merge-pdf' ? 10 : 1}
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                key="selected"
                                className="text-center py-10"
                            >
                                <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 p-4 rounded-xl inline-block mb-4">
                                    <FileText size={48} />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">
                                    {files.length > 1 ? `${files.length} files selected` : files[0].name}
                                </h3>
                                <p className="text-slate-500 mb-8">
                                    {(files.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024).toFixed(2)} MB Total
                                </p>

                                {files.length > 1 && (
                                    <div className="mb-6 max-h-40 overflow-y-auto text-sm text-slate-500">
                                        {files.map((f, i) => (
                                            <div key={i}>{f.name}</div>
                                        ))}
                                    </div>
                                )}

                                {tool === 'image-convert' && (
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Convert to:</label>
                                        <select
                                            value={targetFormat}
                                            onChange={(e) => setTargetFormat(e.target.value)}
                                            className="block w-40 mx-auto rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="JPG">JPG</option>
                                            <option value="PNG">PNG</option>
                                            <option value="WEBP">WEBP</option>
                                        </select>
                                    </div>
                                )}

                                <div className="flex justify-center space-x-4">
                                    <button
                                        onClick={() => setFiles([])}
                                        className="px-6 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleUpload}
                                        disabled={isUploading}
                                        className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                                    >
                                        {isUploading ? (
                                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Converting...</>
                                        ) : (
                                            <>Convert File{files.length > 1 ? 's' : ''}</>
                                        )}
                                    </button>
                                </div>

                                {error && (
                                    <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
                                        <AlertCircle className="w-4 h-4 mr-2" />
                                        {error}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-10"
                    >
                        <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Download className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Conversion Complete!</h2>
                        <p className="text-slate-500 mb-8">Your file is ready to download.</p>

                        <a
                            href={downloadUrl}
                            className="inline-block px-8 py-3 bg-green-500 text-white rounded-xl shadow-lg shadow-green-500/30 hover:bg-green-600 transition-all transform hover:-translate-y-1"
                        >
                            Download {outputFilename}
                        </a>

                        <div className="mt-8">
                            <button
                                onClick={() => {
                                    setDownloadUrl(null);
                                    setFiles([]);
                                }}
                                className="text-slate-500 hover:text-slate-700 text-sm"
                            >
                                Convert another file
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

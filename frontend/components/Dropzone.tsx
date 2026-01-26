import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';

interface DropzoneProps {
    onFileSelect: (files: File[]) => void;
    accept: Record<string, string[]>;
    maxFiles?: number;
}

const Dropzone = ({ onFileSelect, accept, maxFiles = 1 }: DropzoneProps) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles?.length > 0) {
            onFileSelect(acceptedFiles);
        }
    }, [onFileSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        maxFiles,
    });

    return (
        <div
            {...getRootProps()}
            className={`relative border-2 border-dashed rounded-2xl p-10 transition-colors cursor-pointer
        ${isDragActive
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500'
                }
      `}
        >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center text-center space-y-4">
                <motion.div
                    animate={{ y: isDragActive ? -10 : 0 }}
                    className="p-4 bg-blue-100 dark:bg-blue-900/50 rounded-full"
                >
                    <UploadCloud className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </motion.div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                        {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400">
                        or click to select files
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dropzone;

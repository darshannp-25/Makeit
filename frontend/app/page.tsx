"use client";

import { FileText, FileImage, FileType, Scissors, Layers, Minimize2 } from 'lucide-react';
import ToolCard from '@/components/ToolCard';
import { motion } from 'framer-motion';

const tools = [
  {
    title: 'PDF to Word',
    description: 'Convert PDF documents to editable Word files.',
    icon: FileText,
    href: '/pdf-to-word',
    color: 'bg-blue-500',
  },
  {
    title: 'Word to PDF',
    description: 'Convert Word documents to PDF format.',
    icon: FileType,
    href: '/word-to-pdf',
    color: 'bg-indigo-500',
  },
  {
    title: 'Image to PDF',
    description: 'Convert JPG, PNG images to PDF documents.',
    icon: FileImage,
    href: '/image-to-pdf',
    color: 'bg-purple-500',
  },
  {
    title: 'Image Converter',
    description: 'Convert between JPG, PNG, and WEBP formats.',
    icon: Layers,
    href: '/image-convert',
    color: 'bg-pink-500',
  },
  {
    title: 'Compress Image',
    description: 'Reduce image file size while maintaining quality.',
    icon: Minimize2,
    href: '/compress-image',
    color: 'bg-orange-500',
  },
  {
    title: 'Merge PDF',
    description: 'Combine multiple PDFs into one document.',
    icon: Layers,
    href: '/merge-pdf',
    color: 'bg-red-500',
  },
];

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6"
        >
          Every tool you need to work with files
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto"
        >
          100% free and secure file tools. Convert, compress, and edit documents in your browser.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {tools.map((tool) => (
          <ToolCard key={tool.title} {...tool} />
        ))}
      </motion.div>
    </div>
  );
}

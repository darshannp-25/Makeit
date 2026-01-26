"use client";

import Link from 'next/link';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    // Basic dark mode toggle implementation request
    // For a real app, we'd use a context or next-themes
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                            M
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                            MakeIt
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                            Tools
                        </Link>
                        <Link href="/pricing" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                            Pricing
                        </Link>
                        <button className="px-4 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium hover:opacity-90 transition-opacity">
                            Get Started
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-600 dark:text-slate-300">
                            {isMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        <Link href="/" className="block py-2 text-slate-600 dark:text-slate-300 font-medium">
                            Tools
                        </Link>
                        <Link href="/pricing" className="block py-2 text-slate-600 dark:text-slate-300 font-medium">
                            Pricing
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

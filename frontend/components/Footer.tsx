const Footer = () => {
    return (
        <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center text-white font-bold text-sm">
                                M
                            </div>
                            <span className="text-lg font-bold text-slate-900 dark:text-white">
                                MakeIt
                            </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">
                            Professional file conversion tools for everyone. Fast, secure, and easy to use.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Tools</h4>
                        <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                            <li>PDF to Word</li>
                            <li>Word to PDF</li>
                            <li>Image Converter</li>
                            <li>Compress PDF</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                            <li>Privacy Policy</li>
                            <li>Terms of Service</li>
                            <li>Contact Us</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400 text-sm">
                    &copy; {new Date().getFullYear()} MakeIt. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;

import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface ToolCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    href: string;
    color: string;
}

const ToolCard = ({ title, description, icon: Icon, href, color }: ToolCardProps) => {
    return (
        <Link href={href} className="block group">
            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-slate-100 dark:border-slate-700 h-full`}
            >
                <div className={`p-3 rounded-lg w-fit mb-4 ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                    {title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                    {description}
                </p>
            </motion.div>
        </Link>
    );
};

export default ToolCard;

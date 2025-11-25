// src/pages/NotFoundPage.tsx
import { Link } from 'react-router-dom';
import Button from '@/components/core/Button';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center px-4">
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
                <h1 className="text-8xl font-bold text-light-accent dark:text-dark-accent">404</h1>
            </motion.div>
            
            <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-4 text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary"
            >
                Page Not Found. Oops.
            </motion.h2>
            
            <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-2 text-light-text-secondary dark:text-dark-text-secondary"
            >
                Looks like you've discovered a corner of LockTalk that doesn't exist.
                <br/>
                Maybe it's a secret page? (It's not. We checked.)
            </motion.p>
            
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8"
            >
                <Link to="/">
                    <Button size="lg">Go back to safety</Button>
                </Link>
            </motion.div>
        </div>
    );
};

export default NotFoundPage;

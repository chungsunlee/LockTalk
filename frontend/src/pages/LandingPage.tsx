// src/pages/LandingPage.tsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '@/components/core/Button';
import DeviceMockup from '@/components/core/DeviceMockup';
import ChatPane from '@/components/chat/ChatPane'; // Use ChatPane as mock content


const LandingPage = () => {


    return (
        <div className="pt-16">
            <section className="text-center py-20 lg:py-32 px-4">
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-4xl lg:text-6xl font-bold tracking-tight text-light-text-primary dark:text-dark-text-primary"
                >
                    Secure Chat.
                    <br />
                    <span className="text-light-accent dark:text-dark-accent">Playfully Private.</span>
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="mt-6 max-w-2xl mx-auto text-lg lg:text-xl text-light-text-secondary dark:text-dark-text-secondary"
                >
                    LockTalk is a fun, hyper-secure messaging app that works on your local network. No cloud, no accounts, just pure, encrypted fun.
                </motion.p>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link to="/app">
                        <Button size="lg">Launch App</Button>
                    </Link>

                </motion.div>
            </section>

            <DeviceMockup>
                {/* We can reuse the ChatPane as a realistic looking mockup screen */}
                <div className="h-full w-full select-none pointer-events-none">
                     <ChatPane selectedPeerId={null} />
                </div>
            </DeviceMockup>

             <section className="py-20 lg:py-32 px-4">
                <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 text-center">
                    <div className="p-4">
                        <h3 className="text-xl font-bold">Zero Cloud</h3>
                        <p className="mt-2 text-light-text-secondary dark:text-dark-text-secondary">Your messages never touch the internet. Everything stays on your local network, making it ridiculously private.</p>
                    </div>
                    <div className="p-4">
                        <h3 className="text-xl font-bold">End-to-End Encrypted</h3>
                        <p className="mt-2 text-light-text-secondary dark:text-dark-text-secondary">Using serious cryptography so only you and your peer can read the messages. Not even your cat can spy on you.</p>
                    </div>
                    <div className="p-4">
                        <h3 className="text-xl font-bold">Learn as You Go</h3>
                        <p className="mt-2 text-light-text-secondary dark:text-dark-text-secondary">An interactive tutorial teaches you about networking and cryptography in a way that's actually fun.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;

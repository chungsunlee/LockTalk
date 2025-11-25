// src/components/settings/KeyManager.tsx
import { useState } from 'react';
import Button from '@/components/core/Button';

// This is a MOCK key. In a real app, this would be fetched securely.
// DO NOT expose real private keys to the frontend.
const MOCK_PUBLIC_KEY = "04:C4:B3:9C:F8:E9:A2:DB:9C:F3:3F:A7:B3:DC:64:9C:89:B1:B2:71:32:0A:C4:22:E1:B3:7F:C1:A3:D2:C3:A2";

const KeyManager = () => {
    const [isRevealed, setIsRevealed] = useState(false);

    return (
        <div id="key-manager" className="p-6 bg-light-surface dark:bg-dark-surface rounded-lg shadow-apple-light dark:shadow-apple-dark">
            <h3 className="text-xl font-bold mb-4">Your Identity</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
                        Your Public Key
                    </label>
                    <div className="mt-1 flex items-center space-x-2 p-3 bg-light-bg dark:bg-dark-bg rounded-md">
                        <pre className={`flex-1 font-mono text-sm truncate ${isRevealed ? '' : 'blur-sm select-none'}`}>
                            {MOCK_PUBLIC_KEY}
                        </pre>
                         <Button variant="secondary" size="sm" onClick={() => setIsRevealed(!isRevealed)}>
                            {isRevealed ? 'Hide' : 'Reveal'}
                        </Button>
                    </div>
                    <p className="mt-2 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                        This is your public identity on the LockTalk network. Think of it like a very, very secure phone number. Your private key, which is used for decryption, is safely stored by the backend and is never shown here.
                    </p>
                </div>
                <div className="text-center pt-4">
                    <Button variant="ghost" onClick={() => alert("Psych! This button is just for show. Key rotation happens automatically in the backend... or it would, if this wasn't a demo.")}>
                        Rotate Keys
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default KeyManager;

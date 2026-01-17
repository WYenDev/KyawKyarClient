import React from 'react';
import { useGetApiAuthRecoverCodes } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Clipboard, DownloadCloud, Check } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RecoverCodesPage: React.FC = () => {
        const { data, isLoading, isError } = useGetApiAuthRecoverCodes();
        const { user, markRecoverCodesSaved } = useAuth();
        const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
        const navigate = useNavigate();

        if (isLoading) return <div className="text-sm text-slate-600">Loading recovery codes...</div>;
        if (isError) return <div className="text-sm text-red-600">Error loading recovery codes. Please try again later.</div>;

        const codes: string[] = data?.codes ?? [];

        const copy = async (text: string, idx?: number) => {
            try {
                await navigator.clipboard.writeText(text);
                setCopiedIndex(idx ?? null);
                setTimeout(() => setCopiedIndex(null), 2000);
            } catch (err) {
                console.error('Copy failed', err);
            }
        };

        const copyAll = () => {
            copy(codes.join('\n'));
        };

        const download = () => {
            const blob = new Blob([codes.join('\n')], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `recovery-codes-${user?.username ?? 'codes'}.txt`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        };

        const markSaved = () => {
            markRecoverCodesSaved();
            navigate('/admin');
            
        };

        return (
            <div className="bg-[#F8F9FB] p-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm max-w-3xl">
                    <h1 className="text-xl font-semibold mb-2">Recovery Codes Setup</h1>
                    <p className="text-sm text-slate-600 mb-4">Please save these recovery codes in a secure location. They can be used to access your account if you lose access to your primary authentication method.</p>

                    {codes.length === 0 ? (
                        <div className="text-sm text-slate-500">No recovery codes available.</div>
                    ) : (
                        <div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                {codes.map((c, idx) => (
                                    <div key={idx} className="flex items-center justify-between border rounded-lg px-4 py-3 bg-gray-50">
                                        <div className="font-mono text-sm text-slate-800 break-all">{c}</div>
                                        <div className="flex items-center gap-2 ml-4">
                                            <button onClick={() => copy(c, idx)} className="text-slate-600 hover:text-slate-800 p-1">
                                                <Clipboard className="h-4 w-4" />
                                            </button>
                                            {copiedIndex === idx && <span className="text-sm text-green-600 flex items-center"><Check className="h-4 w-4 mr-1"/>Copied</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center gap-3">
                                <button onClick={copyAll} className="px-3 py-2 bg-indigo-600 text-white rounded flex items-center gap-2">
                                    <Clipboard className="h-4 w-4" /> Copy all
                                </button>

                                <button onClick={download} className="px-3 py-2 border rounded flex items-center gap-2">
                                    <DownloadCloud className="h-4 w-4" /> Download
                                </button>

                                <button
                                    onClick={markSaved}
                                    className="ml-auto px-3 py-2 bg-green-600 text-white rounded disabled:opacity-60"
                                >
                                    I have saved these codes
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
};

export default RecoverCodesPage;

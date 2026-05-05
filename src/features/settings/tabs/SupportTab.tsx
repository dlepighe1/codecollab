import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

export const SupportTab = ({ user, theme }: any) => {
    const [subject, setSubject] = useState(''); const [message, setMessage] = useState(''); const [isSent, setIsSent] = useState(false); const [isSending, setIsSending] = useState(false);
    const handleSend = () => { if (!subject || !message) return; setIsSending(true); setTimeout(() => { setIsSending(false); setIsSent(true); setSubject(''); setMessage(''); setTimeout(() => setIsSent(false), 5000); }, 1500); };
    return (
        <div className="flex flex-col h-full w-full max-w-4xl mx-auto animate-fade-in relative pb-10">
            <div className="mb-8 text-center md:text-left">
                <h3 className={`text-3xl font-bold mb-2 ${theme.textPrimary}`}>Support Center</h3>
                <p className={`text-sm ${theme.textSecondary}`}>Have a question or feedback? We're here to help.</p>
            </div>

            {isSent ? (
                <div className={`flex flex-col items-center justify-center p-16 text-center animate-fade-in ${theme.cardBg} border ${theme.cardBorder} rounded-3xl shadow-xl`}>
                    <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6 animate-blob">
                        <CheckCircle className="w-10 h-10" />
                    </div>
                    <h4 className={`text-2xl font-bold mb-3 ${theme.textPrimary}`}>Message Sent!</h4>
                    <p className={`text-sm max-w-md mx-auto ${theme.textSecondary} leading-relaxed`}>
                        Thank you for contacting us. Your inquiry (Ticket #9238) has been received and our team will review it shortly.
                    </p>
                    <button onClick={() => setIsSent(false)} className={`mt-8 px-6 py-2.5 rounded-xl font-bold text-sm transition ${theme.buttonSecondary}`}>
                        Send another message
                    </button>
                </div>
            ) : (
                <div className={`space-y-8 flex-1`}>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className={`text-xs font-bold uppercase tracking-wider ${theme.textTertiary} ml-1`}>Your Name</label>
                            <div className={`w-full px-5 py-4 rounded-2xl border ${theme.cardBg} ${theme.cardBorder} ${theme.textPrimary} opacity-80 cursor-not-allowed font-medium`}>{user?.name}</div>
                        </div>
                        <div className="space-y-3">
                            <label className={`text-xs font-bold uppercase tracking-wider ${theme.textTertiary} ml-1`}>Email Address</label>
                            <div className={`w-full px-5 py-4 rounded-2xl border ${theme.cardBg} ${theme.cardBorder} ${theme.textPrimary} opacity-80 cursor-not-allowed font-medium`}>{user?.email}</div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className={`text-xs font-bold uppercase tracking-wider ${theme.textTertiary} ml-1`}>Subject</label>
                        <input
                            type="text"
                            placeholder="e.g., Billing Issue or Feature Request"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className={`w-full border rounded-2xl px-5 py-4 outline-none transition-all shadow-sm focus:shadow-md ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary}`}
                        />
                    </div>

                    <div className="space-y-3">
                        <label className={`text-xs font-bold uppercase tracking-wider ${theme.textTertiary} ml-1`}>Message</label>
                        <textarea
                            rows={8}
                            placeholder="Describe your issue or question in detail..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className={`w-full border rounded-2xl px-5 py-4 outline-none transition-all resize-none shadow-sm focus:shadow-md ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary}`}
                        />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            onClick={handleSend}
                            disabled={!subject || !message || isSending}
                            className={`px-10 py-4 rounded-2xl text-sm font-bold transition-all transform hover:-translate-y-1 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${theme.buttonPrimary}`}
                        >
                            {isSending ? 'Sending...' : <><Send className="w-4 h-4" /> Send Message</>}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

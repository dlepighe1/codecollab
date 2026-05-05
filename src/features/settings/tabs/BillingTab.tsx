import React, { useState } from 'react';
import { CreditCard, Calendar, Eye, EyeOff, Trash2, Check, ChevronDown, AlertTriangle } from 'lucide-react';
import { UserTier } from '../../../types';

export const BillingTab = ({ user, updateTier, theme }: any) => {
    const billing = user?.billing;
    const [showCard, setShowCard] = useState(false);
    const [showPlans, setShowPlans] = useState(false);
    const [pendingPlan, setPendingPlan] = useState<UserTier | null>(null);

    const handleSwitchPlan = (plan: UserTier) => {
        if (plan === user?.tier) return;
        setPendingPlan(plan);
    };

    const confirmSwitch = () => {
        if (pendingPlan) {
            updateTier(pendingPlan);
            setPendingPlan(null);
            setShowPlans(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div>
                <h3 className={`text-2xl font-bold mb-2 ${theme.textPrimary}`}>Billing & Plans</h3>
                <p className={`text-sm ${theme.textSecondary}`}>Manage your subscription and payment methods.</p>
            </div>

            {/* Current Plan Card */}
            <div className={`bg-gradient-to-br ${theme.appBg === 'bg-slate-50' ? 'from-blue-500 to-indigo-600' : 'from-slate-900 to-slate-800'} border border-white/10 rounded-2xl p-6 relative overflow-hidden shadow-2xl`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className={`text-sm font-bold mb-1 uppercase tracking-wider ${theme.appBg === 'bg-slate-50' ? 'text-blue-100' : 'text-blue-400'}`}>Current Plan</div>
                        <h2 className="text-3xl font-bold text-white mb-2">{billing?.currentPlan} Plan</h2>
                        <p className={`${theme.appBg === 'bg-slate-50' ? 'text-blue-50' : 'text-slate-400'} text-sm`}>Next billing date: <span className="text-white">{billing?.nextBillingDate}</span></p>
                    </div>
                    <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                        <span className="text-2xl font-bold text-white">${billing?.currentPlan === 'Pro' ? '19' : billing?.currentPlan === 'Team' ? '49' : '0'} <span className={`text-sm font-normal ${theme.appBg === 'bg-slate-50' ? 'text-blue-100' : 'text-slate-500'}`}>/ mo</span></span>
                        <button
                            onClick={() => setShowPlans(!showPlans)}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition shadow-lg w-full md:w-auto flex justify-center items-center gap-2 ${theme.appBg === 'bg-slate-50' ? 'bg-white text-blue-600 hover:bg-blue-50' : 'bg-white text-slate-900 hover:bg-slate-200'}`}
                        >
                            Manage Subscription {showPlans ? <ChevronDown className="w-4 h-4 rotate-180" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Collapsible Plans */}
            <div className={`grid md:grid-cols-3 gap-4 transition-all duration-500 ease-in-out overflow-hidden ${showPlans ? 'max-h-[600px] opacity-100 mb-8' : 'max-h-0 opacity-0 mb-0'}`}>
                {['Free', 'Pro', 'Team'].map(plan => (
                    <div key={plan} className={`p-5 rounded-xl border flex flex-col gap-3 transition-all ${user?.tier === plan ? 'bg-blue-600/10 border-blue-500/50 shadow-xl ring-1 ring-blue-500/30' : `${theme.cardBg} ${theme.cardBorder} hover:bg-white/5`}`}>
                        <div className="flex justify-between items-center">
                            <h4 className={`font-bold ${theme.textPrimary}`}>{plan}</h4>
                            {user?.tier === plan && <Check className="w-4 h-4 text-blue-400" />}
                        </div>
                        <div className={`text-2xl font-bold ${theme.textPrimary}`}>
                            {plan === 'Free' ? '$0' : plan === 'Pro' ? '$19' : '$49'}
                            <span className={`text-xs font-normal ${theme.textSecondary}`}>/mo</span>
                        </div>
                        <ul className={`text-xs space-y-2 mb-4 ${theme.textSecondary}`}>
                            {plan === 'Free' && <li>• 3 Collaborative Rooms</li>}
                            {plan === 'Free' && <li>• Community Support</li>}
                            {plan === 'Pro' && <li>• Unlimited Rooms</li>}
                            {plan === 'Pro' && <li>• AI Code Reviews</li>}
                            {plan === 'Team' && <li>• Dedicated Support</li>}
                            {plan === 'Team' && <li>• SSO & Audit Logs</li>}
                        </ul>
                        <button
                            onClick={() => handleSwitchPlan(plan as any)}
                            disabled={user?.tier === plan}
                            className={`w-full py-2 rounded-lg text-xs font-bold transition ${user?.tier === plan ? 'bg-blue-500/20 text-blue-300 cursor-default' : `${theme.cardBg} border ${theme.cardBorder} ${theme.textPrimary} hover:bg-white/10`}`}
                        >
                            {user?.tier === plan ? 'Current Plan' : 'Switch Plan'}
                        </button>
                    </div>
                ))}
            </div>

            {/* Switch Confirmation Modal/Overlay */}
            {pendingPlan && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setPendingPlan(null)} />
                    <div className={`relative border rounded-2xl p-6 w-full max-w-sm animate-slide-in-up ${theme.modalBg} ${theme.cardBorder}`}>
                        <div className="flex items-center gap-3 mb-4 text-amber-400">
                            <AlertTriangle className="w-6 h-6" />
                            <h3 className={`text-lg font-bold ${theme.textPrimary}`}>Confirm Plan Switch</h3>
                        </div>
                        <p className={`text-sm mb-6 ${theme.textSecondary}`}>
                            Are you sure you want to switch to the <span className={`font-bold ${theme.textPrimary}`}>{pendingPlan}</span> plan?
                            The changes will be effective immediately, and you will be billed a prorated amount.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setPendingPlan(null)} className={`flex-1 py-2.5 rounded-xl font-bold transition ${theme.buttonSecondary}`}>Cancel</button>
                            <button onClick={confirmSwitch} className={`flex-1 py-2.5 rounded-xl font-bold transition shadow-lg ${theme.buttonPrimary}`}>Confirm & Switch</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Method */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h4 className={`text-sm font-bold flex items-center gap-2 ${theme.textPrimary}`}><CreditCard className="w-4 h-4"/> Payment Method</h4>
                    <button className="text-xs text-blue-400 font-bold hover:underline">Add New</button>
                </div>
                <div className={`border rounded-xl p-4 flex items-center justify-between ${theme.cardBg} ${theme.cardBorder}`}>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-8 bg-slate-700 rounded flex items-center justify-center text-xs font-bold text-white">VISA</div>
                        <div>
                            <div className={`text-sm font-bold flex items-center gap-2 ${theme.textPrimary}`}>
                                •••• •••• •••• {showCard ? billing?.paymentMethod.last4 : '••••'}
                                <button onClick={() => setShowCard(!showCard)} className={`${theme.textTertiary} hover:text-blue-400 transition`}>
                                    {showCard ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                            <div className={`text-xs ${theme.textTertiary}`}>Expires {showCard ? billing?.paymentMethod.expiry : '••/••'}</div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className={`text-xs font-medium ${theme.textSecondary} hover:underline`}>Update</button>
                        <button className="text-xs text-red-400 hover:text-red-300 font-medium">Remove</button>
                    </div>
                </div>
            </div>

            {/* Billing History */}
            <div className="space-y-4">
                <h4 className={`text-sm font-bold flex items-center gap-2 ${theme.textPrimary}`}><Calendar className="w-4 h-4"/> Billing History</h4>
                <div className={`border rounded-xl overflow-hidden ${theme.cardBorder}`}>
                    <table className={`w-full text-left text-sm ${theme.textSecondary}`}>
                        <thead className={`text-xs uppercase font-bold ${theme.textTertiary} ${theme.appBg === 'bg-white' ? 'bg-slate-100' : 'bg-white/5'}`}>
                            <tr>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Amount</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Invoice</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${theme.appBg === 'bg-white' ? 'divide-slate-200' : 'divide-white/5'}`}>
                            {billing?.history.map((item: any) => (
                                <tr key={item.id} className={`hover:bg-opacity-50 transition ${theme.appBg === 'bg-white' ? 'hover:bg-slate-50' : 'hover:bg-white/5'}`}>
                                    <td className="px-4 py-3">{item.date}</td>
                                    <td className={`px-4 py-3 font-bold ${theme.textPrimary}`}>${item.amount.toFixed(2)}</td>
                                    <td className="px-4 py-3"><span className="bg-green-500/10 text-green-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{item.status}</span></td>
                                    <td className="px-4 py-3 text-right"><button className="text-blue-400 hover:underline">Download</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Cancel Subscription */}
            <div className={`pt-8 border-t flex justify-end ${theme.panelBorder}`}>
                <button className="text-red-400 hover:text-red-300 text-sm font-medium flex items-center gap-2 opacity-60 hover:opacity-100 hover:bg-red-500/10 px-4 py-2 rounded-lg transition">
                    <Trash2 className="w-4 h-4" /> Cancel Subscription
                </button>
            </div>
        </div>
    );
};

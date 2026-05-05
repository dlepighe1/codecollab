import React from 'react';
import { Check } from 'lucide-react';

const PLANS = [
    {
        name: 'Free',
        price: '$0',
        period: 'forever',
        description: 'Perfect for learning and solo projects.',
        features: [
            'Unlimited playgrounds',
            '3 collab rooms',
            'Community support',
            'Basic code execution',
        ],
        cta: 'Get Started',
        highlighted: false,
    },
    {
        name: 'Pro',
        price: '$12',
        period: '/month',
        description: 'For developers who want more power.',
        features: [
            'Unlimited collab rooms',
            'AI code reviews',
            'Priority execution',
            'Custom themes',
            'Advanced analytics',
        ],
        cta: 'Start Free Trial',
        highlighted: true,
    },
    {
        name: 'Team',
        price: '$29',
        period: '/seat/month',
        description: 'For teams building together.',
        features: [
            'Everything in Pro',
            'Team management',
            'Mock interview suite',
            'SSO & admin controls',
            'Dedicated support',
            'Custom integrations',
        ],
        cta: 'Contact Sales',
        highlighted: false,
    },
];

export const PricingSection = () => {
    return (
        <section id="pricing" className="py-24 px-6 relative">
            <div className="max-w-5xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        Simple, transparent pricing
                    </h2>
                    <p className="text-slate-400 text-lg max-w-xl mx-auto">
                        Start free. Upgrade when you need more.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {PLANS.map((plan) => (
                        <div
                            key={plan.name}
                            className={`rounded-2xl p-6 border transition-all duration-300 relative ${
                                plan.highlighted
                                    ? 'bg-gradient-to-b from-blue-600/20 to-indigo-600/10 border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.15)]'
                                    : 'bg-white/[0.03] border-white/[0.06] hover:border-white/[0.12]'
                            }`}
                        >
                            {plan.highlighted && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                                    Most Popular
                                </div>
                            )}
                            <div className="mb-6">
                                <h3 className="text-white font-bold text-lg mb-1">{plan.name}</h3>
                                <p className="text-slate-400 text-sm">{plan.description}</p>
                            </div>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-bold text-white">{plan.price}</span>
                                <span className="text-slate-400 text-sm">{plan.period}</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                                        <Check className="w-4 h-4 text-blue-400 shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <button
                                className={`w-full py-3 rounded-xl font-bold text-sm transition ${
                                    plan.highlighted
                                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                                        : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                                }`}
                            >
                                {plan.cta}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

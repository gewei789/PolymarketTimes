import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Project Sponsorship - The Polymarket Times",
    description: "Support The Polymarket Times through project sponsorship.",
};

export default function SponsorPage() {
    return (
        <div className="min-h-screen bg-[#f4f1ea] font-serif">
            <Header />

            <main className="max-w-6xl mx-auto px-4 py-12">
                {/* Ornamental Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-6 gap-4">
                        <div className="text-2xl">※</div>
                        <div className="h-px flex-1 bg-black max-w-xs"></div>
                        <div className="text-3xl">✾</div>
                        <div className="h-px flex-1 bg-black max-w-xs"></div>
                        <div className="text-2xl">※</div>
                    </div>
                    <h1 className="font-blackletter text-6xl mb-4">Project Sponsorship</h1>
                    <p className="text-sm uppercase tracking-[0.3em] text-gray-600 mb-2">Est. 2025</p>
                </div>

                {/* Solana Address */}
                <div className="max-w-3xl mx-auto mb-12">
                    <div className="border-4 border-double border-black bg-[#f4f1ea] p-8 text-center">
                        <p className="text-xl font-serif leading-relaxed break-words" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                            <span className="font-bold">Solana Address:</span> <span className="font-mono font-bold text-[#1a1a1a]">2bDQtFkEArZEwYW1sHQH1HvzhQQAFPL7D8WGchyq2ws4</span>
                        </p>
                    </div>
                </div>

                {/* Decorative Footer Element */}
                <div className="flex items-center justify-center mt-12 gap-4 opacity-50">
                    <div className="text-xl">❦</div>
                    <div className="h-px w-24 bg-black"></div>
                    <div className="text-xl">❦</div>
                    <div className="h-px w-24 bg-black"></div>
                    <div className="text-xl">❦</div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

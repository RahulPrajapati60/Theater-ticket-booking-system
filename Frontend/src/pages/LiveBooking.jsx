// src/pages/LiveBooking.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function LiveBooking() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [selected, setSelected] = useState([]);

    const vipPrice = 3500;     // VIP left side seat
    const otherPrice = 1800;   // Right side normal
    const standingPrice = 1200; // Front standing 
    const vipRows = ['VIP1', 'VIP2', 'VIP3']; // 3 curved rows left
    const otherRows = ['R1', 'R2', 'R3', 'R4']; // 4 rows right
    const seatsPerRow = 8;

    const toggleSeat = (type, row, num) => {
        const id = `${type}-${row}-${num}`;
        setSelected(prev =>
            prev.some(s => s.id === id)
                ? prev.filter(s => s.id !== id)
                : [...prev, { id, type, price: type === 'vip' ? vipPrice : otherPrice }]
        );
    };

    const toggleStanding = () => {
        const already = selected.some(s => s.type === 'standing');
        setSelected(prev =>
            already ? prev.filter(s => s.type !== 'standing') : [...prev, { id: 'standing-1', type: 'standing', price: standingPrice }]
        );
    };

    const total = selected.reduce((sum, s) => sum + s.price, 0);

    return (
        <div className="pt-28 pb-40 bg-gradient-to-b from-gray-950 to-black min-h-screen text-white">
            <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-center">
                    Live Show Booking – {eventId.toUpperCase().replace('-', ' ')}
                </h1>
                <p className="text-center text-xl mb-10 text-gray-400">
                    VIP Left • Normal Right • Standing Front Only
                </p>

                {/* Stage */}
                <div className="mb-16 text-center">
                    <div className="inline-block bg-gradient-to-r from-purple-900 to-indigo-900 px-32 py-6 rounded-2xl text-3xl font-bold tracking-widest shadow-2xl">
                        STAGE
                    </div>
                    <div className="w-full h-3 bg-purple-700 mt-4 rounded-full max-w-5xl mx-auto"></div>
                </div>

                <div className="relative overflow-x-auto pb-10">
                    <div className="flex justify-between gap-8 min-w-[1100px]">
                        {/* LEFT: VIP Seat */}
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold mb-6 text-amber-400 text-center">VIP Section (Left)</h3>
                            <div className="flex flex-col items-end gap-5">
                                {vipRows.map((row, idx) => {
                                    const curve = (idx + 1) * 18;
                                    return (
                                        <div key={row} className="flex gap-2">
                                            {Array.from({ length: seatsPerRow }, (_, i) => {
                                                const num = i + 1;
                                                const id = `vip-${row}-${num}`;
                                                const sel = selected.some(s => s.id === id);
                                                return (
                                                    <button
                                                        key={id}
                                                        onClick={() => toggleSeat('vip', row, num)}
                                                        className={`
                                                                    w-11 h-11 rounded-t-full text-sm font-medium flex flex-col items-center justify-center border border-amber-700 shadow-md
                                                                    transition-all ${sel ? 'bg-amber-600 scale-110 shadow-amber-500/60' : 'bg-amber-950 hover:bg-amber-900'}
                                                                `}
                                                        style={{ transform: `translateX(-${curve}px) rotate(-8deg)` }}
                                                    >
                                                        <span>{num}</span>
                                                        <span className="text-[9px] opacity-80">₹{vipPrice}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* CENTER-FRONT: Standing Area (no seats) */}
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <div
                                onClick={toggleStanding}
                                className={`
                                            w-full max-w-md h-64 rounded-3xl flex items-center justify-center text-center cursor-pointer transition-all border-4
                                            ${selected.some(s => s.type === 'standing')
                                        ? 'bg-green-700 border-green-400 scale-105 shadow-green-600/50'
                                        : 'bg-gradient-to-b from-red-950 to-rose-950 border-red-700 hover:border-red-500 hover:scale-105'}
                                `}
                                >
                                <div>
                                    <div className="text-3xl font-bold mb-3">STANDING PIT</div>
                                    <div className="text-xl">Front of Stage</div>
                                    <div className="text-sm mt-4 opacity-90">No Seat • Dance Zone</div>
                                    <div className="text-lg font-semibold mt-3">₹{standingPrice}</div>
                                    {selected.some(s => s.type === 'standing') && (
                                        <div className="mt-4 text-green-300 font-bold">SELECTED</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Normal Seat */}
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold mb-6 text-blue-400 text-center">Normal Section (Right)</h3>
                            <div className="flex flex-col items-start gap-5">
                                {otherRows.map((row, idx) => {
                                    const curve = (idx + 1) * 15;
                                    return (
                                        <div key={row} className="flex gap-2">
                                            {Array.from({ length: seatsPerRow }, (_, i) => {
                                                const num = i + 1;
                                                const id = `other-${row}-${num}`;
                                                const sel = selected.some(s => s.id === id);
                                                return (
                                                    <button
                                                        key={id}
                                                        onClick={() => toggleSeat('other', row, num)}
                                                        className={`
                                                                    w-11 h-11 rounded-t-full text-sm font-medium flex flex-col items-center justify-center border border-blue-700 shadow-md
                                                                    transition-all ${sel ? 'bg-blue-600 scale-110 shadow-blue-500/60' : 'bg-blue-950 hover:bg-blue-900'}
                                                        `}
                                                        style={{ transform: `translateX(${curve}px) rotate(8deg)` }}
                                                    >
                                                        <span>{num}</span>
                                                        <span className="text-[9px] opacity-80">₹{otherPrice}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Summary */}
                <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-t border-gray-700 p-5 z-50">
                    <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-5">
                        <div className="text-center sm:text-left">
                            <div className="text-xl font-bold">
                                Selected: {selected.length} {selected.length === 1 ? 'ticket' : 'tickets'}
                            </div>
                            <div className="text-lg text-green-400">Total: ₹{total}</div>
                            <div className="text-sm text-gray-500 mt-1">
                                {selected.map(s => s.id || s.type).join(', ') || 'Nothing selected'}
                            </div>
                        </div>

                        <button
                            disabled={total === 0}
                            onClick={() => navigate(`/payment/live/${eventId}`, { state: { selections: selected } })}
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-12 py-4 rounded-xl font-bold text-lg disabled:opacity-50 transition-all shadow-xl"
                        >
                            Proceed to Pay ₹{total}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LiveBooking;
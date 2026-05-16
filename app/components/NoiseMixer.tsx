"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./NoiseMixer.module.css";

type NoiseType = "none" | "white" | "pink" | "brown" | "rain";

interface NoiseMixerProps {
    isRacing?: boolean;
}

export const NoiseMixer = ({ isRacing }: NoiseMixerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeNoise, setActiveNoise] = useState<NoiseType>("none");
    const [volume, setVolume] = useState(0.3);
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);

    const noiseTypes: { id: NoiseType; label: string; icon: string }[] = [
        { id: "none", label: "Off", icon: "⏸" },
        { id: "white", label: "White", icon: "〰" },
        { id: "pink", label: "Pink", icon: "🎨" },
        { id: "brown", label: "Brown", icon: "☁" },
        { id: "rain", label: "Rain", icon: "🌧" },
    ];

    const createNoiseBuffer = (type: NoiseType) => {
        if (!audioContextRef.current) return null;
        const bufferSize = 2 * audioContextRef.current.sampleRate;
        const buffer = audioContextRef.current.createBuffer(1, bufferSize, audioContextRef.current.sampleRate);
        const output = buffer.getChannelData(0);

        if (type === "white") {
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }
        } else if (type === "pink") {
            let b0, b1, b2, b3, b4, b5, b6;
            b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                output[i] *= 0.11; // (roughly) compensate for gain
                b6 = white * 0.115926;
            }
        } else if (type === "brown") {
            let lastOut = 0.0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                output[i] = (lastOut + (0.02 * white)) / 1.02;
                lastOut = output[i];
                output[i] *= 3.5; // (roughly) compensate for gain
            }
        } else if (type === "rain") {
            // Pseudo-rain: filtered pink noise with "droplets"
            let b0, b1, b2, b3, b4, b5, b6;
            b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                let val = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                val *= 0.11;
                b6 = white * 0.115926;

                // Add some random "droplets"
                if (Math.random() > 0.999) {
                    val += (Math.random() * 0.5);
                }
                output[i] = val;
            }
        }

        return buffer;
    };

    const stopNoise = () => {
        if (sourceNodeRef.current) {
            sourceNodeRef.current.stop();
            sourceNodeRef.current.disconnect();
            sourceNodeRef.current = null;
        }
    };

    const playNoise = (type: NoiseType) => {
        stopNoise();
        if (type === "none") return;

        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        if (audioContextRef.current.state === "suspended") {
            audioContextRef.current.resume();
        }

        const buffer = createNoiseBuffer(type);
        if (!buffer) return;

        const source = audioContextRef.current.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        if (!gainNodeRef.current) {
            gainNodeRef.current = audioContextRef.current.createGain();
            gainNodeRef.current.connect(audioContextRef.current.destination);
        }

        gainNodeRef.current.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
        source.connect(gainNodeRef.current);
        source.start();
        sourceNodeRef.current = source;
    };

    const handleNoiseSelect = (type: NoiseType) => {
        setActiveNoise(type);
        playNoise(type);
    };

    useEffect(() => {
        if (gainNodeRef.current && audioContextRef.current) {
            gainNodeRef.current.gain.setTargetAtTime(volume, audioContextRef.current.currentTime, 0.1);
        }
    }, [volume]);

    return (
        <div id="noise-mixer" className={styles.container}>
            <button 
                className={`${styles.toggleBtn} ${isOpen ? styles.active : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                title="Background Audio"
            >
                {activeNoise === 'none' ? '🔇' : '🔊'}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, x: 20, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.9 }}
                        className={styles.mixerContent}
                    >
                        <div className={styles.header}>
                            <span className={styles.title}>BACKGROUND FOCUS</span>
                            <div className={styles.volumeControl}>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={volume}
                                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                                    className={styles.volumeSlider}
                                />
                            </div>
                        </div>

                        <div className={styles.controls}>
                            {noiseTypes.map((noise) => (
                                <button
                                    key={noise.id}
                                    onClick={() => handleNoiseSelect(noise.id)}
                                    className={`${styles.noiseBtn} ${activeNoise === noise.id ? styles.active : ""}`}
                                    title={noise.label}
                                >
                                    <span className={styles.icon}>{noise.icon}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

"use client";

import { useEffect, useState } from "react";

export const AutoPilot = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [status, setStatus] = useState("Ready");
    const [elapsedTime, setElapsedTime] = useState(0);

    const setReactValue = (selector: string, value: string) => {
        const el = document.querySelector(selector) as HTMLInputElement;
        if (!el) return;
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
        nativeInputValueSetter?.call(el, value);
        el.dispatchEvent(new Event('input', { bubbles: true }));
    };

    const typeText = (selector: string, text: string, delay: number, onComplete: () => void) => {
        let i = 0;
        const interval = setInterval(() => {
            setReactValue(selector, text.slice(0, i + 1));
            i++;
            if (i >= text.length) {
                clearInterval(interval);
                onComplete();
            }
        }, delay);
    };

    const clickEl = (selector: string) => {
        const el = document.querySelector(selector) as HTMLElement;
        if (el) el.click();
    };

    const clickByText = (tag: string, text: string) => {
        const elements = Array.from(document.querySelectorAll(tag));
        const el = elements.find(e => e.textContent?.includes(text));
        if (el) (el as HTMLElement).click();
    };

    useEffect(() => {
        if (!isRunning) return;

        // Visual timer for recording monitoring
        const timerInterval = setInterval(() => {
            setElapsedTime(prev => prev + 1);
        }, 1000);

        // Override confirm for the demo
        window.confirm = () => true;

        const sequence = [
            // SPEAKER 1: The Problem (0:00 - 0:50)
            { time: 1000, action: () => setStatus("Speaker 1: Home Dashboard"), fn: () => {} },

            // SPEAKER 2: Setting Up (0:50 - 2:00)
            { time: 50000, action: () => setStatus("Typing task..."), fn: () => typeText('input[placeholder="What are you focusing on?"]', "Biology", 100, () => {}) },
            { time: 60000, action: () => setStatus("Typing cargo..."), fn: () => typeText('input[placeholder*="CARGO"]', "Finish 5 practice problems", 50, () => {}) },
            { time: 75000, action: () => setStatus("Selecting Session Strategy"), fn: () => clickByText('button', 'SESSION STRATEGY') },
            { time: 90000, action: () => setStatus("Selecting Pacer"), fn: () => clickByText('button', 'PACER') },
            { time: 105000, action: () => setStatus("Toggling Research Mode"), fn: () => clickByText('button', 'RESEARCH:') },
            { time: 115000, action: () => setStatus("Starting Race!"), fn: () => clickByText('button', 'GO') },
            
            // SPEAKER 3: Race & Focus System (2:00 - 3:15)
            // Wait for 3-2-1 countdown (Race starts ~118s)
            { time: 145000, action: () => setStatus("Simulating Distraction (Tab Away)"), fn: () => { (window as any).forceDrift = true; } },
            { time: 155000, action: () => setStatus("Recovering Focus"), fn: () => { (window as any).forceDrift = false; } },
            { time: 165000, action: () => setStatus("Activating Shield"), fn: () => clickByText('button', 'SHIELD') },
            { time: 185000, action: () => setStatus("Completing Stint"), fn: () => clickEl('#complete-stint-btn') },
            
            // Pit Stop (approx 185s to 195s)
            { time: 188000, action: () => setStatus("Pit Stop: Hydrate"), fn: () => clickByText('span', 'HYDRATE') },
            { time: 190000, action: () => setStatus("Pit Stop: Stretch"), fn: () => clickByText('span', 'STRETCH') },
            { time: 192000, action: () => setStatus("Pit Stop: 20-20-20"), fn: () => clickByText('span', '20-20-20 RULE') },
            { time: 195000, action: () => setStatus("Returning to Track"), fn: () => clickByText('button', 'RETURN TO TRACK') },
            
            // SPEAKER 4: Rewards, Garage & Closing (3:15 - 4:15)
            // Race lap 2 starts, instantly finish early to go to Results Modal
            { time: 198000, action: () => setStatus("Finishing Early to Results"), fn: () => clickByText('button', 'FINISH EARLY') },
            
            // Results Modal
            { time: 205000, action: () => setStatus("Rating 5 Stars"), fn: () => {
                const stars = document.querySelectorAll('button');
                const starBtns = Array.from(stars).filter(b => b.textContent?.includes('★'));
                if (starBtns[4]) (starBtns[4] as HTMLElement).click();
            }},
            { time: 215000, action: () => setStatus("Continuing to Dashboard"), fn: () => clickByText('button', 'CONTINUE TO DASHBOARD') },
            
            // Garage, Calendar, Mixer
            { time: 220000, action: () => setStatus("Opening Garage"), fn: () => clickEl('#garage-btn') },
            { time: 225000, action: () => setStatus("Garage: Track Tab"), fn: () => clickByText('button', 'TRACK') },
            { time: 230000, action: () => setStatus("Garage: Safe List Tab"), fn: () => clickByText('button', 'SAFE LIST') },
            { time: 235000, action: () => setStatus("Closing Garage"), fn: () => clickByText('button', '×') },
            
            { time: 238000, action: () => setStatus("Opening Calendar"), fn: () => clickEl('#calendar-btn') },
            { time: 245000, action: () => setStatus("Closing Calendar"), fn: () => clickByText('button', '×') },
            
            { time: 248000, action: () => setStatus("Opening Noise Mixer"), fn: () => clickEl('button[title="Background Audio"]') },
            { time: 255000, action: () => setStatus("Demo Complete!"), fn: () => setIsRunning(false) },
        ];

        const timeouts = sequence.map(step => 
            setTimeout(() => {
                step.action();
                step.fn();
            }, step.time)
        );

        return () => {
            timeouts.forEach(clearTimeout);
            clearInterval(timerInterval);
        };
    }, [isRunning]);

    // Format time helper MM:SS
    const formatElapsed = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    if (!isRunning && status === "Ready") {
        return (
            <button 
                onClick={() => setIsRunning(true)}
                style={{
                    position: "fixed", bottom: 20, right: 20, zIndex: 99999,
                    background: "#00E5FF", color: "#000", padding: "12px 24px",
                    borderRadius: "8px", fontWeight: "bold", border: "none",
                    cursor: "pointer", boxShadow: "0 4px 15px rgba(0,229,255,0.4)"
                }}
            >
                ▶ START EXACT 4:15 TIMED DEMO
            </button>
        );
    }

    if (isRunning) {
        return (
            <div style={{
                position: "fixed", bottom: 20, right: 20, zIndex: 99999,
                background: "rgba(0,0,0,0.8)", color: "#00E5FF", padding: "12px 24px",
                borderRadius: "8px", border: "1px solid #00E5FF",
                fontFamily: "monospace", fontSize: "14px"
            }}>
                🔴 REC {formatElapsed(elapsedTime)} / 4:15 | {status}
            </div>
        );
    }

    return null;
};

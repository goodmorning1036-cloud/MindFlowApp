import { useState, useRef, useEffect, useCallback } from 'react';

export const useTimer = () => {
    const [elapsed, setElapsed] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [speedMultiplier, setSpeedMultiplier] = useState(1);

    const lastTimeRef = useRef<number | null>(null);
    const requestIdRef = useRef<number | null>(null);
    const speedRef = useRef(1);

    // Update ref when state changes so the loop can see it
    useEffect(() => {
        speedRef.current = speedMultiplier;
    }, [speedMultiplier]);

    const update = useCallback(() => {
        const now = Date.now();
        if (lastTimeRef.current !== null) {
            const deltaTime = now - lastTimeRef.current;
            setElapsed(prev => prev + deltaTime * speedRef.current);
            lastTimeRef.current = now;
            requestIdRef.current = requestAnimationFrame(update);
        }
    }, []);

    const start = useCallback(() => {
        if (!isRunning) {
            setIsRunning(true);
            lastTimeRef.current = Date.now();
            requestIdRef.current = requestAnimationFrame(update);
        }
    }, [isRunning, update]);

    const stop = useCallback(() => {
        setIsRunning(false);
        if (requestIdRef.current) {
            cancelAnimationFrame(requestIdRef.current);
            requestIdRef.current = null;
        }
        lastTimeRef.current = null;
    }, []);

    const reset = useCallback(() => {
        stop();
        setElapsed(0);
    }, [stop]);

    useEffect(() => {
        return () => {
            if (requestIdRef.current) {
                cancelAnimationFrame(requestIdRef.current);
            }
        };
    }, []);

    return { elapsed, isRunning, speedMultiplier, setSpeedMultiplier, start, stop, reset };
};

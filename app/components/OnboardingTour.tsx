"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./OnboardingTour.module.css";

interface Step {
    id: string;
    title: string;
    description: string;
    targetId: string;
    position: "top" | "bottom" | "left" | "right";
}

const TOUR_STEPS: Step[] = [
    {
        id: "welcome",
        title: "WELCOME PILOT",
        description: "Welcome to MindFlow. This is where your focus becomes speed. Let's take a quick look at your dashboard.",
        targetId: "glass-card",
        position: "bottom"
    },
    {
        id: "task",
        title: "THE STARTING LINE",
        description: "Type your main goal here. This is your primary objective for the race. Set a duration and hit START to begin.",
        targetId: "task-input",
        position: "bottom"
    },
    {
        id: "todo",
        title: "THE PIT CREW",
        description: "Use the Todo List for smaller sub-tasks. Crossing these off during your session keeps your momentum high.",
        targetId: "todo-list",
        position: "bottom"
    },
    {
        id: "garage",
        title: "THE GARAGE",
        description: "Customise your ride! Spend the Fuel you earn to unlock neon colors and premium holographic effects.",
        targetId: "garage-btn",
        position: "bottom"
    },
    {
        id: "level",
        title: "PILOT STATUS",
        description: "This shows your current Level and XP. The more you focus, the higher you climb in the global ranks.",
        targetId: "level-badge",
        position: "bottom"
    },
    {
        id: "calendar",
        title: "THE LOGBOOK",
        description: "Track your racing history or use the Exam Planner to map out your long-term focus goals.",
        targetId: "calendar-btn",
        position: "bottom"
    },
    {
        id: "ready",
        title: "READY TO RACE?",
        description: "You're all set. Remember: in MindFlow, distraction is the only friction. Good luck on the track!",
        targetId: "glass-card",
        position: "bottom"
    }
];

export const OnboardingTour = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    useEffect(() => {
        const hasSeenTour = localStorage.getItem("mindflow_tour_complete");
        if (!hasSeenTour) {
            setIsVisible(true);
        }
    }, []);

    useEffect(() => {
        if (isVisible) {
            const updateRect = () => {
                const step = TOUR_STEPS[currentStep];
                const element = document.getElementById(step.targetId);
                if (element) {
                    setTargetRect(element.getBoundingClientRect());
                }
            };

            updateRect();
            window.addEventListener("resize", updateRect);
            return () => window.removeEventListener("resize", updateRect);
        }
    }, [currentStep, isVisible]);

    const handleNext = () => {
        if (currentStep < TOUR_STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleComplete();
        }
    };

    const handleComplete = () => {
        setIsVisible(false);
        localStorage.setItem("mindflow_tour_complete", "true");
    };

    if (!isVisible || !targetRect) return null;

    const step = TOUR_STEPS[currentStep];

    return (
        <div className={styles.overlay}>
            <motion.div 
                className={styles.highlight}
                animate={{
                    top: targetRect.top - 8,
                    left: targetRect.left - 8,
                    width: targetRect.width + 16,
                    height: targetRect.height + 16,
                }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
            />

            <motion.div 
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                    opacity: 1, 
                    y: 0,
                    top: step.position === 'bottom' ? targetRect.bottom + 20 : 'auto',
                    bottom: step.position === 'top' ? (window.innerHeight - targetRect.top) + 20 : 'auto',
                    left: targetRect.left + (targetRect.width / 2) - 160,
                }}
                className={styles.tooltip}
            >
                <div className={styles.tooltipHeader}>
                    <span className={styles.stepIndicator}>STEP {currentStep + 1} OF {TOUR_STEPS.length}</span>
                    <button className={styles.skipBtn} onClick={handleComplete}>SKIP</button>
                </div>
                <h3 className={styles.title}>{step.title}</h3>
                <p className={styles.description}>{step.description}</p>
                <div className={styles.footer}>
                    <div />
                    <button className={styles.nextBtn} onClick={handleNext}>
                        {currentStep === TOUR_STEPS.length - 1 ? "START RACING" : "NEXT"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

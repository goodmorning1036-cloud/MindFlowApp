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
        description: "Type your main goal here. This is your primary objective for the race. Set a duration and hit GO to begin.",
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

export const OnboardingTour = ({ onComplete }: { onComplete?: () => void }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(true); // Always visible when rendered
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    useEffect(() => {
        // We handle visibility from the parent now
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
        if (onComplete) onComplete();
    };

    const step = TOUR_STEPS[currentStep];
    const isWelcome = step.id === "welcome" || step.id === "ready";

    if (!isVisible || (!isWelcome && !targetRect)) return null;
    
    const getTooltipPos = () => {
        if (isWelcome || !targetRect) {
            return {
                top: "50%",
                left: "50%",
                x: "-50%",
                y: "-50%",
                position: "fixed" as const
            };
        }

        const tooltipWidth = 340;
        const tooltipHeight = 220; // approximate
        
        // Decide whether to place above or below
        const spaceBelow = window.innerHeight - targetRect.bottom;
        const spaceAbove = targetRect.top;
        
        let top: string | number = "auto";
        let bottom: string | number = "auto";
        
        if (spaceBelow > tooltipHeight + 40 || spaceBelow > spaceAbove) {
            // Place below
            top = targetRect.bottom + 20;
            // Guard against bottom edge
            if ((top as number) + tooltipHeight > window.innerHeight - 20) {
                top = window.innerHeight - tooltipHeight - 20;
            }
        } else {
            // Place above
            bottom = (window.innerHeight - targetRect.top) + 20;
            // Guard against top edge
            if ((bottom as number) + tooltipHeight > window.innerHeight - 20) {
                bottom = window.innerHeight - tooltipHeight - 20;
            }
        }

        return {
            top,
            bottom,
            left: Math.max(20, Math.min(window.innerWidth - tooltipWidth - 20, targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2))),
            x: 0,
            y: 0,
            position: "absolute" as const
        };
    };

    const tooltipStyles = getTooltipPos();

    return (
        <div className={styles.overlay}>
            <motion.div 
                className={styles.highlight}
                animate={{
                    top: isWelcome ? "50%" : (targetRect as DOMRect).top - 8,
                    left: isWelcome ? "50%" : (targetRect as DOMRect).left - 8,
                    width: isWelcome ? 0 : (targetRect as DOMRect).width + 16,
                    height: isWelcome ? 0 : (targetRect as DOMRect).height + 16,
                    opacity: isWelcome ? 0 : 1
                }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
            />

            <motion.div 
                key={step.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                    opacity: 1, 
                    scale: 1,
                    ...tooltipStyles
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

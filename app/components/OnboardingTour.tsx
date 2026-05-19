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

export type TourContext = 'HOME' | 'RACE' | 'RESULT';

const HOME_STEPS: Step[] = [
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
        id: "strategy",
        title: "SESSION STRATEGY",
        description: "Choose 'Quick Focus' for a single sprint, or 'Session Strategy' to plan a series of laps with scheduled breaks.",
        targetId: "strategy-selector",
        position: "bottom"
    },
    {
        id: "rival",
        title: "RIVAL VS PACER",
        description: "In RIVAL mode, you race against your personal best time. PACER mode gives you a steady target to help you stay on track.",
        targetId: "rival-selector",
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
        id: "sensory",
        title: "SENSORY FOCUS",
        description: "Need total concentration? Use the Noise Mixer to play White Noise or Rain to block out distractions while you race.",
        targetId: "noise-mixer",
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

const RACE_STEPS: Step[] = [
    {
        id: "telemetry",
        title: "TELEMETRY DASHBOARD",
        description: "Monitor your race mode and cargo delivery status here. This panel keeps you connected to your mission objectives.",
        targetId: "telemetry-hub",
        position: "bottom"
    },
    {
        id: "vitals",
        title: "FOCUS STABILITY",
        description: "This is your Tire Health. Staying in the tab keeps it high. Switching tabs causes friction and drains your stability!",
        targetId: "tire-vitals",
        position: "bottom"
    },
    {
        id: "shields",
        title: "FOCUS SHIELDS",
        description: "Need to check a quick message? Activate the Shield to temporarily prevent focus penalties, or use Research Mode.",
        targetId: "shield-btn",
        position: "top"
    },
    {
        id: "finish",
        title: "MISSION COMPLETION",
        description: "Once your task is done, hit COMPLETE STINT to head to the Pit Stop and collect your rewards.",
        targetId: "complete-stint-btn",
        position: "top"
    }
];

const RESULT_STEPS: Step[] = [
    {
        id: "rewards",
        title: "MISSION REWARDS",
        description: "Excellent performance. Here is the Fuel you earned based on your focus stability and time.",
        targetId: "fuel-stats",
        position: "bottom"
    },
    {
        id: "progression",
        title: "PILOT PROGRESSION",
        description: "Your XP contributes to your Pilot Level. Unlock higher ranks and premium garage items by staying consistent.",
        targetId: "level-stats",
        position: "top"
    },
    {
        id: "uplink",
        title: "DATA UPLINK",
        description: "For long missions, upload proof of your work here to verify your progress and unlock the next track.",
        targetId: "evidence-stats",
        position: "top"
    }
];

export const OnboardingTour = ({ onComplete, context = 'HOME' }: { onComplete?: () => void, context?: TourContext }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    const steps = context === 'RACE' ? RACE_STEPS : context === 'RESULT' ? RESULT_STEPS : HOME_STEPS;

    useEffect(() => {
        // We handle visibility from the parent now
    }, []);

    useEffect(() => {
        const step = steps[currentStep];
        if (step.targetId && isVisible) {
            const el = document.getElementById(step.targetId);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [currentStep, isVisible, steps]);

    useEffect(() => {
        const updateRect = () => {
            const step = steps[currentStep];
            if (step && step.targetId) {
                const el = document.getElementById(step.targetId);
                if (el) {
                    setTargetRect(el.getBoundingClientRect());
                }
            } else {
                setTargetRect(null);
            }
        };

        updateRect();
        const timer = setInterval(updateRect, 100);
        return () => clearInterval(timer);
    }, [currentStep, isVisible, steps]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleComplete();
        }
    };

    const handleComplete = () => {
        setIsVisible(false);
        if (context === 'HOME') {
            localStorage.setItem("mindflow_tour_complete", "true");
        } else {
            localStorage.setItem(`mindflow_tour_${context.toLowerCase()}_complete`, "true");
        }
        if (onComplete) onComplete();
    };

    const step = steps[currentStep];
    const isWelcome = step?.id === "welcome" || step?.id === "ready";

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
                    <span className={styles.stepIndicator}>STEP {currentStep + 1} OF {steps.length}</span>
                    <button className={styles.skipBtn} onClick={handleComplete}>SKIP</button>
                </div>
                <h3 className={styles.title}>{step.title}</h3>
                <p className={styles.description}>{step.description}</p>
                <div className={styles.footer}>
                    <div />
                    <button className={styles.nextBtn} onClick={handleNext}>
                        {currentStep === steps.length - 1 ? (context === 'HOME' ? "START RACING" : context === 'RACE' ? "BEGIN STINT" : "CONTINUE") : "NEXT"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

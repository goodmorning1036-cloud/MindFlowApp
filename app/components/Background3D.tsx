import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './Background3D.module.css';
import { GhostlyTreeIcon } from './Assets';
import { GhostService } from '../services/ghostService';
import { TRACK_THEMES } from './CustomizationModal';

interface Background3DProps {
    blur?: boolean;
}

export const Background3D = ({ blur = false }: Background3DProps) => {
    const [trackTheme, setTrackTheme] = useState("cyber");

    useEffect(() => {
        const syncTheme = () => {
            const custom = GhostService.getCustomization();
            if (custom.trackTheme) setTrackTheme(custom.trackTheme);
        };

        syncTheme();
        window.addEventListener('customization-updated', syncTheme);
        return () => window.removeEventListener('customization-updated', syncTheme);
    }, []);

    const getThemeColor = () => {
        const theme = TRACK_THEMES[trackTheme] || TRACK_THEMES.cyber;
        return theme.roadBorder;
    };

    const accentColor = getThemeColor();

    return (
        <div className={`${styles.envWrapper} ${blur ? styles.blurred : ''}`}>
            {/* Speed Lines — vanishing point origin, fan to both sides */}
            <div className={styles.speedLinesOverlay}>
                {/* LEFT: 100°→178° */}
                {Array.from({ length: 13 }, (_, i) => (
                    <div
                        key={`sl-l-${i}`}
                        className={styles.speedLine}
                        style={{
                            '--angle': `${100 + i * 6}deg`,
                            '--delay': `${-(i * 0.13)}s`,
                            '--dur': `${1.0 + i * 0.04}s`,
                            '--len': `${150 + i * 20}px`,
                        } as React.CSSProperties}
                    />
                ))}
                {/* RIGHT: 80°→2° */}
                {Array.from({ length: 13 }, (_, i) => (
                    <div
                        key={`sl-r-${i}`}
                        className={styles.speedLine}
                        style={{
                            '--angle': `${80 - i * 6}deg`,
                            '--delay': `${-(i * 0.13 + 0.06)}s`,
                            '--dur': `${1.0 + i * 0.04}s`,
                            '--len': `${150 + i * 20}px`,
                        } as React.CSSProperties}
                    />
                ))}
            </div>

            <div className={styles.roadGroup}>
                <div className={styles.roadFloor}>
                    <div className={styles.roadCenterLine}></div>
                </div>

                {/* Moving Trees - Left Side */}
                {[0, 1, 2, 3].map((i) => (
                    <motion.div
                        key={`tree-l-${i}`}
                        className={styles.treeItem}
                        style={{ left: 'calc(50% - 220px)' }}
                        variants={{
                            initial: { x: 0, y: 0, scale: 0.5, opacity: 0 },
                            animate: {
                                x: -50,
                                y: 800,
                                scale: 3,
                                opacity: [0, 1, 1, 0],
                                transition: { duration: 2, repeat: Infinity, ease: "linear", delay: i * 0.5 }
                            }
                        }}
                        initial="initial"
                        animate="animate"
                    >
                        <div className={styles.treeVisual} style={{ opacity: 1 }}><GhostlyTreeIcon color={accentColor} /></div>
                    </motion.div>
                ))}

                {/* Moving Trees - Right Side */}
                {[0, 1, 2, 3].map((i) => (
                    <motion.div
                        key={`tree-r-${i}`}
                        className={styles.treeItem}
                        style={{ left: 'calc(50% + 220px)' }}
                        variants={{
                            initial: { x: 0, y: 0, scale: 0.5, opacity: 0 },
                            animate: {
                                x: 50,
                                y: 800,
                                scale: 3,
                                opacity: [0, 1, 1, 0],
                                transition: { duration: 2, repeat: Infinity, ease: "linear", delay: i * 0.5 + 0.25 }
                            }
                        }}
                        initial="initial"
                        animate="animate"
                    >
                        <div className={styles.treeVisual} style={{ opacity: 1 }}><GhostlyTreeIcon color={accentColor} /></div>
                    </motion.div>
                ))}

                {/* Neon Gates - Left Side */}
                {[0, 1, 2, 3].map((i) => (
                    <motion.div
                        key={`gate-l-${i}`}
                        className={styles.neonGate}
                        style={{ top: '50%', left: 'calc(50% - 170px)' }}
                        variants={{
                            initial: { x: 0, y: 0, scale: 0.12, opacity: 0 },
                            animate: {
                                x: -200,
                                y: 750,
                                scale: 4,
                                opacity: [0, 1, 1, 0],
                                transition: { duration: 2, repeat: Infinity, ease: 'linear', delay: i * 0.5 }
                            }
                        }}
                        initial="initial"
                        animate="animate"
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: i * 0.5 }}
                    >
                        <div className={styles.neonGateBar} style={{ background: accentColor, boxShadow: `0 0 15px ${accentColor}` }} />
                        <div className={styles.neonGatePost} style={{ background: `linear-gradient(to top, transparent, ${accentColor})` }} />
                    </motion.div>
                ))}

                {/* Neon Gates - Right Side */}
                {[0, 1, 2, 3].map((i) => (
                    <motion.div
                        key={`gate-r-${i}`}
                        className={styles.neonGate}
                        style={{ top: '50%', left: 'calc(50% + 170px)' }}
                        variants={{
                            initial: { x: 0, y: 0, scale: 0.12, opacity: 0 },
                            animate: {
                                x: 200,
                                y: 750,
                                scale: 4,
                                opacity: [0, 1, 1, 0],
                                transition: { duration: 2, repeat: Infinity, ease: 'linear', delay: i * 0.5 + 0.25 }
                            }
                        }}
                        initial="initial"
                        animate="animate"
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: i * 0.5 + 0.25 }}
                    >
                        <div className={styles.neonGateBar} style={{ background: accentColor, boxShadow: `0 0 15px ${accentColor}` }} />
                        <div className={styles.neonGatePost} style={{ background: `linear-gradient(to top, transparent, ${accentColor})` }} />
                    </motion.div>
                ))}

                {/* ── Light Poles - Left Side ── */}
                {[0, 1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                        key={`pole-l-${i}`}
                        className={styles.lightPole}
                        style={{ 
                            top: '50%', 
                            left: 'calc(50% - 220px)',
                            background: `linear-gradient(to top, transparent, ${accentColor})`,
                            boxShadow: `0 0 10px ${accentColor}`
                        }}
                        variants={{
                            initial: { x: 0, y: 0, scale: 0.08, opacity: 0 },
                            animate: {
                                x: -320,
                                y: 800,
                                scale: 5,
                                opacity: [0, 0.9, 0.9, 0],
                                transition: { duration: 2, repeat: Infinity, ease: 'linear', delay: i * 0.33 }
                            }
                        }}
                        initial="initial"
                        animate="animate"
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: i * 0.33 }}
                    />
                ))}

                {/* ── Light Poles - Right Side ── */}
                {[0, 1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                        key={`pole-r-${i}`}
                        className={styles.lightPole}
                        style={{ 
                            top: '50%', 
                            left: 'calc(50% + 220px)',
                            background: `linear-gradient(to top, transparent, ${accentColor})`,
                            boxShadow: `0 0 10px ${accentColor}`
                        }}
                        variants={{
                            initial: { x: 0, y: 0, scale: 0.08, opacity: 0 },
                            animate: {
                                x: 320,
                                y: 800,
                                scale: 5,
                                opacity: [0, 0.9, 0.9, 0],
                                transition: { duration: 2, repeat: Infinity, ease: 'linear', delay: i * 0.33 + 0.16 }
                            }
                        }}
                        initial="initial"
                        animate="animate"
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: i * 0.33 + 0.16 }}
                    />
                ))}
            </div>
        </div>
    );
};

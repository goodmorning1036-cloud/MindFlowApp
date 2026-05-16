"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GhostService, CustomizationState, getLevelInfo } from "../services/ghostService";
import { CarIcon, GhostIcon } from "./Assets";
import styles from "./CustomizationModal.module.css";

interface GarageProps {
    onClose: () => void;
}

interface Unlockable {
    id: string;
    name: string;
    cost: number;
    type: "color" | "ghost" | "track";
    value: string;
    emoji?: string;
    description?: string;
}

const UNLOCKABLES: Unlockable[] = [
    // Car Colors — escalating rarity
    { id: "default_cyan", name: "Cyan Neon", cost: 0, type: "color", value: "#00E5FF" },
    { id: "volt_yellow", name: "Volt Yellow", cost: 50, type: "color", value: "#CCFF00" },
    { id: "crimson_pulse", name: "Crimson Pulse", cost: 100, type: "color", value: "#FF2A6D" },
    { id: "obsidian", name: "Obsidian", cost: 200, type: "color", value: "#222222" },
    { id: "phantom_violet", name: "Phantom Violet", cost: 350, type: "color", value: "#8B5CF6" },
    { id: "solar_orange", name: "Solar Flare", cost: 500, type: "color", value: "#FF6B00" },
    { id: "arctic_white", name: "Arctic White", cost: 750, type: "color", value: "#E8F0FE" },
    { id: "emerald_rush", name: "Emerald Rush", cost: 1000, type: "color", value: "#00FF87" },
    { id: "rose_gold", name: "Rose Gold", cost: 1500, type: "color", value: "#E8A0BF" },
    { id: "holographic", name: "Holographic", cost: 3000, type: "color", value: "#C0C0FF" },

    // Ghost Entities — escalating rarity
    { id: "default_ghost", name: "Wisp", cost: 0, type: "ghost", value: "default" },
    { id: "phantom_ghost", name: "Phantom", cost: 150, type: "ghost", value: "phantom" },
    { id: "reaper_ghost", name: "Reaper", cost: 500, type: "ghost", value: "reaper" },
    { id: "wraith_ghost", name: "Wraith", cost: 1200, type: "ghost", value: "wraith" },
    { id: "spectre_ghost", name: "Spectre", cost: 2500, type: "ghost", value: "spectre" },
    { id: "eternal_ghost", name: "Eternal", cost: 5000, type: "ghost", value: "eternal" },

    // Track Environments
    { id: "track_cyber", name: "Cyberpunk", cost: 0, type: "track", value: "cyber", emoji: "🌆", description: "Neon city at midnight" },
    { id: "track_desert", name: "Neon Desert", cost: 300, type: "track", value: "desert", emoji: "🌵", description: "Scorched dunes at dusk" },
    { id: "track_storm", name: "Storm Circuit", cost: 600, type: "track", value: "storm", emoji: "⚡", description: "Race through the lightning" },
    { id: "track_forest", name: "Ghost Forest", cost: 1000, type: "track", value: "forest", emoji: "🌲", description: "Ancient glowing woods" },
    { id: "track_space", name: "Orbital", cost: 2000, type: "track", value: "space", emoji: "🌌", description: "Deep space superhighway" },
    { id: "track_volcano", name: "Magma Run", cost: 4000, type: "track", value: "volcano", emoji: "🌋", description: "Race above molten rock" },
];

// Track theme visual configs — used by RaceView too (exported for use there)
export const TRACK_THEMES: Record<string, { label: string; roadColor: string; roadBorder: string; skyBackground: string; horizonGlow: string; glowColor: string; lineColor: string }> = {
    cyber: {
        label: "Cyberpunk",
        roadColor: "#020408",
        roadBorder: "#00E5FF",
        skyBackground: "radial-gradient(circle at 50% 0%, #060e1a 0%, #010204 100%)",
        horizonGlow: "radial-gradient(ellipse 70% 18% at 50% 46%, rgba(255,170,50,0.35) 0%, rgba(255,210,80,0.12) 50%, transparent 100%)",
        glowColor: "rgba(0,229,255,0.25)",
        lineColor: "rgba(0,229,255,0.12)",
    },
    desert: {
        label: "Neon Desert",
        roadColor: "#1a0e00",
        roadBorder: "#FF8C00",
        skyBackground: "radial-gradient(circle at 50% 0%, #1a0800 0%, #0a0400 100%)",
        horizonGlow: "radial-gradient(ellipse 90% 20% at 50% 50%, rgba(255,120,20,0.4) 0%, rgba(255,60,0,0.15) 60%, transparent 100%)",
        glowColor: "rgba(255,140,0,0.25)",
        lineColor: "rgba(255,140,0,0.12)",
    },
    storm: {
        label: "Storm Circuit",
        roadColor: "#050510",
        roadBorder: "#7B61FF",
        skyBackground: "radial-gradient(circle at 50% 0%, #080515 0%, #020208 100%)",
        horizonGlow: "radial-gradient(ellipse 70% 25% at 50% 45%, rgba(120,80,255,0.3) 0%, rgba(60,20,200,0.1) 60%, transparent 100%)",
        glowColor: "rgba(123,97,255,0.25)",
        lineColor: "rgba(123,97,255,0.12)",
    },
    forest: {
        label: "Ghost Forest",
        roadColor: "#020a04",
        roadBorder: "#00FF87",
        skyBackground: "radial-gradient(circle at 50% 0%, #020a04 0%, #010502 100%)",
        horizonGlow: "radial-gradient(ellipse 80% 16% at 50% 42%, rgba(0,200,80,0.25) 0%, rgba(0,100,40,0.1) 60%, transparent 100%)",
        glowColor: "rgba(0,255,135,0.2)",
        lineColor: "rgba(0,255,135,0.1)",
    },
    space: {
        label: "Orbital",
        roadColor: "#020010",
        roadBorder: "#C0C0FF",
        skyBackground: "radial-gradient(circle at 50% 0%, #020010 0%, #010008 100%)",
        horizonGlow: "radial-gradient(ellipse 60% 20% at 50% 40%, rgba(150,100,255,0.2) 0%, rgba(80,50,200,0.08) 60%, transparent 100%)",
        glowColor: "rgba(192,192,255,0.2)",
        lineColor: "rgba(192,192,255,0.1)",
    },
    volcano: {
        label: "Magma Run",
        roadColor: "#150500",
        roadBorder: "#FF4400",
        skyBackground: "radial-gradient(circle at 50% 0%, #150200 0%, #080100 100%)",
        horizonGlow: "radial-gradient(ellipse 90% 30% at 50% 55%, rgba(255,80,0,0.5) 0%, rgba(200,20,0,0.2) 60%, transparent 100%)",
        glowColor: "rgba(255,80,0,0.3)",
        lineColor: "rgba(255,80,0,0.15)",
    },
};

export const CustomizationModal = ({ onClose }: GarageProps) => {
    const [fuel, setFuel] = useState(0);
    const [unlocks, setUnlocks] = useState<string[]>([]);
    const [customization, setCustomization] = useState<CustomizationState>({
        carColor: "#00E5FF",
        ghostType: "default",
        trackTheme: "cyber",
        safeList: [],
        gracePeriod: 30,
    });
    const [activeTab, setActiveTab] = useState<"color" | "ghost" | "track">("color");

    useEffect(() => {
        setFuel(GhostService.getFuel());
        setUnlocks(GhostService.getUnlocks());
        setCustomization(GhostService.getCustomization());
    }, []);

    const handleUnlock = (item: Unlockable) => {
        if (GhostService.unlockItem(item.id, item.cost)) {
            setFuel(GhostService.getFuel());
            setUnlocks(GhostService.getUnlocks());
        }
    };

    const handleSelect = (item: Unlockable) => {
        if (!unlocks.includes(item.id)) return;

        let updates: Partial<CustomizationState> = {};
        if (item.type === "color") updates = { carColor: item.value };
        else if (item.type === "ghost") updates = { ghostType: item.value };
        else if (item.type === "track") updates = { trackTheme: item.value };

        GhostService.updateCustomization(updates);
        setCustomization({ ...customization, ...updates });
    };

    const tabs: { key: "color" | "ghost" | "track" | "safe"; label: string; emoji: string }[] = [
        { key: "color", label: "CHASSIS", emoji: "🚗" },
        { key: "ghost", label: "GHOST", emoji: "👻" },
        { key: "track", label: "TRACK", emoji: "🛣️" },
        { key: "safe", label: "SAFE LIST", emoji: "🛡️" },
    ];

    const [newAppName, setNewAppName] = useState("");

    const addSafeApp = () => {
        if (!newAppName.trim()) return;
        const newList = [...customization.safeList, newAppName.trim()];
        GhostService.updateCustomization({ safeList: newList });
        setCustomization({ ...customization, safeList: newList });
        setNewAppName("");
    };

    const removeSafeApp = (name: string) => {
        const newList = customization.safeList.filter(n => n !== name);
        GhostService.updateCustomization({ safeList: newList });
        setCustomization({ ...customization, safeList: newList });
    };

    const updateGracePeriod = (val: number) => {
        GhostService.updateCustomization({ gracePeriod: val });
        setCustomization({ ...customization, gracePeriod: val });
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={styles.overlay}
        >
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <h2 className={styles.title}>MY GARAGE</h2>
                        <div className={styles.fuelCount}>
                            <span className={styles.fuelLabel}>FUEL RESERVE</span>
                            <span className={styles.fuelValue}>{fuel} XP</span>
                            <span className={styles.levelLabel} style={{ marginTop: '0.25rem', color: '#00E5FF', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em' }}>
                                LVL {getLevelInfo(GhostService.getTotalXpEarned()).level} · {getLevelInfo(GhostService.getTotalXpEarned()).title.toUpperCase()}
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className={styles.closeButton}>×</button>
                </div>

                {/* Tabs */}
                <div className={styles.tabs}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ""}`}
                            onClick={() => setActiveTab(tab.key as any)}
                        >
                            <span>{tab.emoji}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Car Chassis */}
                {activeTab === "color" && (
                    <div className={styles.section}>
                        <div className={styles.grid}>
                            {UNLOCKABLES.filter(u => u.type === "color").map(item => {
                                const isUnlocked = unlocks.includes(item.id);
                                const isActive = customization.carColor === item.value;
                                return (
                                    <div
                                        key={item.id}
                                        className={`${styles.card} ${isActive ? styles.active : ""} ${!isUnlocked ? styles.locked : ""}`}
                                        onClick={() => isUnlocked ? handleSelect(item) : handleUnlock(item)}
                                    >
                                        <div className={styles.preview}>
                                            <CarIcon color={item.value} />
                                        </div>
                                        <div className={styles.info}>
                                            <span className={styles.itemName}>{item.name}</span>
                                            {!isUnlocked && <span className={styles.cost}>{item.cost} XP</span>}
                                            {isActive && <span className={styles.statusLabel}>ACTIVE</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Ghost Entity */}
                {activeTab === "ghost" && (
                    <div className={styles.section}>
                        <div className={styles.grid}>
                            {UNLOCKABLES.filter(u => u.type === "ghost").map(item => {
                                const isUnlocked = unlocks.includes(item.id);
                                const isActive = customization.ghostType === item.value;
                                return (
                                    <div
                                        key={item.id}
                                        className={`${styles.card} ${isActive ? styles.active : ""} ${!isUnlocked ? styles.locked : ""}`}
                                        onClick={() => isUnlocked ? handleSelect(item) : handleUnlock(item)}
                                    >
                                        <div className={styles.preview}>
                                            <GhostIcon />
                                        </div>
                                        <div className={styles.info}>
                                            <span className={styles.itemName}>{item.name}</span>
                                            {!isUnlocked && <span className={styles.cost}>{item.cost} XP</span>}
                                            {isActive && <span className={styles.statusLabel}>ACTIVE</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Track Environment */}
                {activeTab === "track" && (
                    <div className={styles.section}>
                        <div className={styles.trackGrid}>
                            {UNLOCKABLES.filter(u => u.type === "track").map(item => {
                                const isUnlocked = unlocks.includes(item.id);
                                const isActive = customization.trackTheme === item.value;
                                const theme = TRACK_THEMES[item.value];
                                return (
                                    <div
                                        key={item.id}
                                        className={`${styles.trackCard} ${isActive ? styles.active : ""} ${!isUnlocked ? styles.locked : ""}`}
                                        onClick={() => isUnlocked ? handleSelect(item) : handleUnlock(item)}
                                        style={isUnlocked ? { borderColor: theme.roadBorder + "55" } : {}}
                                    >
                                        <div
                                            className={styles.trackPreview}
                                            style={{
                                                background: `${theme.horizonGlow}, ${theme.skyBackground}`,
                                            }}
                                        >
                                            <div className={styles.trackRoadPreview} style={{
                                                borderColor: theme.roadBorder,
                                                background: theme.roadColor,
                                                boxShadow: `0 0 12px ${theme.roadBorder}66`,
                                            }}>
                                                <div className={styles.trackLinePreview} style={{ background: theme.roadBorder + "44" }} />
                                            </div>
                                            <div className={styles.trackEmoji}>{item.emoji}</div>
                                        </div>

                                        <div className={styles.trackInfo}>
                                            <span className={styles.itemName}>{item.name}</span>
                                            <span className={styles.trackDesc}>{item.description}</span>
                                            {!isUnlocked && <span className={styles.cost}>{item.cost} XP</span>}
                                            {isActive && <span className={styles.statusLabel}>ACTIVE</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Safe List Tab */}
                {activeTab === ("safe" as any) && (
                    <div className={styles.section}>
                        <div className={styles.safeContainer}>
                            <div className={styles.safeHeader}>
                                <div className={styles.safeTitleGroup}>
                                    <h3 className={styles.safeTitle}>ALLOWED STUDY TOOLS</h3>
                                    <p className={styles.safeDesc}>Note: Browsers prevent auto-detecting other apps. These tools activate your <strong>Grace Period</strong> when you leave this tab.</p>
                                </div>
                                <div className={styles.graceControl}>
                                    <span className={styles.graceLabel}>GRACE PERIOD: <strong>{customization.gracePeriod}s</strong></span>
                                    <input
                                        type="range"
                                        min="5"
                                        max="120"
                                        step="5"
                                        value={customization.gracePeriod}
                                        onChange={(e) => updateGracePeriod(parseInt(e.target.value))}
                                        className={styles.rangeInput}
                                    />
                                </div>
                            </div>

                            <div className={styles.safeInputGroup}>
                                <input
                                    type="text"
                                    placeholder="Add app (e.g. Google Docs)..."
                                    value={newAppName}
                                    onChange={(e) => setNewAppName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addSafeApp()}
                                    className={styles.safeInput}
                                />
                                <button onClick={addSafeApp} className={styles.safeAddBtn}>ADD</button>
                            </div>

                            <div className={styles.safeList}>
                                {customization.safeList.map(item => (
                                    <div key={item} className={styles.safeItem}>
                                        <span>{item}</span>
                                        <button onClick={() => removeSafeApp(item)} className={styles.safeRemoveBtn}>✕</button>
                                    </div>
                                ))}
                                {customization.safeList.length === 0 && (
                                    <div className={styles.safeEmpty}>No allowed apps yet.</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

# MindFlow Design Standards

## Color Palette

### Dark Mode (Default)
- **Primary Background:** `#0B0E14` (Midnight Black)
- **Secondary Background:** `#1A1F29` (Deep Charcoal)
- **Accent Color:** `#00E5FF` (Neon Cyan)
- **Glass Card:** `rgba(255, 255, 255, 0.05)` with 20px blur

### Light Mode (Latte Cream / Soft White)
- **Primary Background:** `#F9F9F8` (Soft White) — **NEW STANDARD**
- **Secondary Background:** `#F4F4F3` (Alabaster)
- **Text Color:** `#1A1C1E` (Onyx)
- **Main Card Background:** `#F9F9F8` (Solid Soft White)
- **Accent Color:** `#0CA4A5` (Deep Teal)

## Typography
- **Primary Font:** Inter (Sans-serif)
- **Data Font:** Space Grotesk / Monospace (for stats and timer)

## UI Philosophy
1. **Glassmorphism:** Use semi-transparent surfaces with heavy blur and sharp borders to create a premium, layered feel.
2. **Minimalism:** No unnecessary buttons. If a feature doesn't contribute to focus, it is removed.
3. **High Contrast Data:** Telemetry data (XP, RPM, Multipliers) must be easy to read at a glance during a "race."
4. **Motion:** Use smooth `framer-motion` transitions to make the UI feel alive and responsive.

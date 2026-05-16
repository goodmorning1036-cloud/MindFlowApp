'use client';
import { useEffect, useRef, useState } from 'react';

interface TransparentImageProps {
    src: string;
    alt: string;
    className?: string;
    width?: number;
    height?: number;
    threshold?: number; // How aggressively to remove background (0-255)
}

/**
 * Renders an image with its background removed at runtime using canvas.
 * Detects the background color from the corner pixels and makes similar pixels transparent.
 */
export const TransparentImage = ({
    src,
    alt,
    className,
    width = 140,
    height,
    threshold = 40,
}: TransparentImageProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const w = img.naturalWidth;
            const h = img.naturalHeight;
            canvas.width = w;
            canvas.height = h;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, w, h);
            const data = imageData.data;

            // Sample background color from the four corners
            const corners = [
                0,                         // top-left
                (w - 1) * 4,               // top-right
                (h - 1) * w * 4,           // bottom-left
                ((h - 1) * w + (w - 1)) * 4 // bottom-right
            ];

            let bgR = 0, bgG = 0, bgB = 0;
            for (const i of corners) {
                bgR += data[i];
                bgG += data[i + 1];
                bgB += data[i + 2];
            }
            bgR = Math.round(bgR / 4);
            bgG = Math.round(bgG / 4);
            bgB = Math.round(bgB / 4);

            // Remove pixels similar to the background color
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                const diff = Math.abs(r - bgR) + Math.abs(g - bgG) + Math.abs(b - bgB);

                if (diff < threshold) {
                    // Make fully transparent
                    data[i + 3] = 0;
                } else if (diff < threshold * 2) {
                    // Partial transparency for anti-aliased edges
                    const alpha = Math.min(255, ((diff - threshold) / threshold) * 255);
                    data[i + 3] = Math.round(alpha);
                }
            }

            ctx.putImageData(imageData, 0, 0);
            setLoaded(true);
        };
        img.src = src;
    }, [src, threshold]);

    return (
        <canvas
            ref={canvasRef}
            className={className}
            style={{
                width: width,
                height: height || 'auto',
                display: 'block',
                opacity: loaded ? 1 : 0,
                transition: 'opacity 0.3s ease',
            }}
            aria-label={alt}
        />
    );
};

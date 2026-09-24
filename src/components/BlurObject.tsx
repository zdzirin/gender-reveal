import clsx from "clsx";
import { useCallback, useLayoutEffect, useState } from "react";

type Pos = {
    x: number;
    y: number;
};

type Color = "cotton-candy" | "wisteria-blue";

const SPEED = 1;

export default function BlurObject({
    color,
    delay = 0,
}: {
    color?: Color;
    delay?: number;
}) {
    const [pos, setPos] = useState<Pos | null>(null);
    const [size, setSize] = useState<number | null>(null);
    // Only rolled when no colour is given, and only once: a random value read
    // during render would pick a new colour on every render.
    const [fallback] = useState(() =>
        Math.random() < 0.5 ? "bg-cotton-candy" : "bg-wisteria-blue",
    );
    const bg = color ? `bg-${color}` : fallback;

    const randomWalk = useCallback(() => {
        if (!size) return;

        setPos((prev) => {
            if (!prev) return prev;
            const x = prev.x + Math.random() * SPEED - SPEED / 2;
            const y = prev.y + Math.random() * SPEED - SPEED / 2;
            return { x, y };
        });
    }, [size]);

    useLayoutEffect(() => {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        setPos({ x, y });

        const size = Math.round(
            Math.max(window.innerHeight, window.innerWidth) / 4,
        );
        setSize(size);

        const interval = setInterval(randomWalk, 100);
        return () => clearInterval(interval);
    }, [randomWalk]);

    if (!pos || !size) return null;
    return (
        <div
            className={clsx(
                "rounded-full absolute blur-3xl breathe opacity-50 transition-colors duration-[1600ms] ease-out",
                bg,
            )}
            style={{
                top: pos.y,
                left: pos.x,
                height: size,
                width: size,
                transitionDelay: `${delay}ms`,
            }}
        ></div>
    );
}

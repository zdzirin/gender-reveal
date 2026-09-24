import { useEffect, useMemo } from "react";

/* Five shades rather than one flat colour: a single hue reads as a graphic,
   a spread reads as a hundred separate pieces of paper. The darkest is
   pulled from the navy coat in the pram illustration so the shower belongs
   to this page and not to a generic party. */
const BLUES = ["#c5d0ec", "#a9b8e3", "#7f95d1", "#5b70a8", "#3d4f7d"];

const PIECES = 110;

const rand = (min: number, max: number) => Math.random() * (max - min) + min;
const pick = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];

export default function Confetti({ onDone }: { onDone: () => void }) {
    // Frozen at mount. Re-rolling on a render would teleport the shower.
    const pieces = useMemo(
        () =>
            Array.from({ length: PIECES }, (_, id) => ({
                id,
                style: {
                    left: `${rand(-2, 102)}vw`,
                    // Spread over three seconds so it falls as weather rather
                    // than as one dumped bucketful.
                    "--delay": `${rand(0, 3)}s`,
                    "--fall": `${rand(3.4, 5.2)}s`,
                    "--dy": "125vh",
                    "--dx": `${rand(-70, 70)}px`,
                    "--sway": `${rand(1.6, 3.4)}s`,
                    "--spin": `${rand(0.6, 1.8)}s`,
                    "--axis": `${rand(0.2, 1)} ${rand(0.2, 1)} 0`,
                    "--w": `${rand(6, 11)}px`,
                    "--h": `${rand(8, 16)}px`,
                    "--tint": pick(BLUES),
                } as React.CSSProperties,
            })),
        [],
    );

    useEffect(() => {
        const t = setTimeout(onDone, 8500);
        return () => clearTimeout(t);
    }, [onDone]);

    return (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-50 overflow-clip"
        >
            {pieces.map((p) => (
                <span key={p.id} className="confetti" style={p.style}>
                    <span className="confetti-piece" />
                </span>
            ))}
        </div>
    );
}

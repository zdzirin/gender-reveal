import clsx from "clsx";
import { useCallback, useState } from "react";

import BlurObject from "./components/BlurObject";
import Confetti from "./components/Confetti";
import Reveal from "./components/Reveal";
import baby from "./assets/images/baby.webp";

const DOTS = 16;

/* Displacement noise that chews an irregular edge into anything it filters.
   Two seeds so no two torn sheets on the page tear identically. */
function PaperTears() {
    return (
        <svg aria-hidden="true" className="pointer-events-none absolute h-0 w-0">
            <defs>
                <filter id="torn-a">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.012 0.04"
                        numOctaves="4"
                        seed="8"
                        result="noise"
                    />
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="noise"
                        scale="14"
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                </filter>
                <filter id="torn-b">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.015 0.03"
                        numOctaves="4"
                        seed="23"
                        result="noise"
                    />
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="noise"
                        scale="11"
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                </filter>
                <filter id="torn-tape" colorInterpolationFilters="sRGB">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.1"
                        numOctaves="3"
                        seed="12"
                        result="noise"
                    />
                    {/* Flattens R to a constant 0.5, which feDisplacementMap
                        reads as "no horizontal shift". Only G still varies, so
                        the tear runs along the strip and the sides stay clean. */}
                    <feColorMatrix
                        in="noise"
                        type="matrix"
                        values="0 0 0 0 0.5
                                0 1 0 0 0
                                0 0 1 0 0
                                0 0 0 1 0"
                        result="lengthwise"
                    />
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="lengthwise"
                        scale="9"
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                </filter>
                <filter id="torn-c">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.02 0.05"
                        numOctaves="3"
                        seed="41"
                        result="noise"
                    />
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="noise"
                        scale="8"
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                </filter>
            </defs>
        </svg>
    );
}

/* asking -> falling -> revealed. The middle phase exists only to let the
   question fall off the screen before it stops occupying layout. */
type Phase = "asking" | "falling" | "revealed";

const FALL_MS = 1100;

function App() {
    const [phase, setPhase] = useState<Phase>("asking");
    const [raining, setRaining] = useState(false);
    const [refusing, setRefusing] = useState(false);

    const answer = useCallback(() => {
        setPhase("falling");
        setRaining(true);
        setTimeout(() => setPhase("revealed"), FALL_MS);
    }, []);

    const stopRain = useCallback(() => setRaining(false), []);

    return (
        <>
            <PaperTears />
            <div className="fixed inset-0 overflow-clip">
                {new Array(Math.round(DOTS / 2)).fill("").map((_, i) => (
                    <BlurObject key={`blue-${i}`} color="wisteria-blue" />
                ))}
                {/* Half the page is still undecided until the answer lands,
                    then washes blue one dot at a time rather than all at once. */}
                {new Array(Math.round(DOTS / 2)).fill("").map((_, i) => (
                    <BlurObject
                        key={`pink-${i}`}
                        color={phase === "asking" ? "cotton-candy" : "wisteria-blue"}
                        delay={i * 110}
                    />
                ))}
            </div>
            <div className="fixed inset-0 canvas" />

            {phase === "revealed" ? (
                <Reveal />
            ) : (
                <main
                    className={clsx(
                        "relative mx-auto flex min-h-dvh max-w-5xl flex-col items-center justify-center gap-12 px-4 py-10 sm:gap-16",
                        // Transforms still count toward scrollable overflow, so
                        // without this the fall flashes a scrollbar.
                        phase === "falling" && "overflow-clip",
                    )}
                >
                    <header
                        className={clsx(
                            "max-w-105 -rotate-2",
                            phase === "falling" &&
                                "drop-away [--drop-delay:170ms] [--drop-spin:-11deg]",
                        )}
                    >
                        <div className="mat tear-b [--mat-pad:1.75rem] text-center">
                            <h1 className="ink text-2xl leading-snug sm:text-3xl">
                                <span className="mb-1 block">
                                    <span className="inline-block -rotate-2 text-xl sm:text-2xl">
                                        I think
                                    </span>
                                </span>
                                <span className="washi washi-pink -rotate-1">
                                    Madison 💃
                                </span>{" "}
                                <span className="mx-0.5 text-xl sm:text-2xl">
                                    and
                                </span>{" "}
                                <span className="washi washi-blue rotate-1">
                                    Zachary 🤓
                                </span>
                                <span className="ink-loud mt-3 block text-3xl sm:text-4xl">
                                    will have a…
                                </span>
                            </h1>
                        </div>
                    </header>

                    {/* The dial: buttons centered on the mount's 10:30 and 1:30,
                        each tilted along the arc. Below sm there is no room for
                        that, so they pair up above. */}
                    <div className="relative mx-auto flex w-full max-w-sm flex-col items-center gap-10 sm:mt-16 sm:block md:max-w-md lg:max-w-lg">
                        <div className="flex w-full justify-center gap-3 sm:contents">
                            <button
                                onClick={answer}
                                className={clsx(
                                    "choice dial dial-left paper tape ink flex-1 -rotate-6 cursor-pointer py-6 text-2xl text-vintage-grape shadow-lg bg-wisteria-blue hover:-translate-y-1 hover:shadow-xl active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-vintage-grape",
                                    phase === "falling" &&
                                        "drop-away [--drop-delay:60ms] [--drop-spin:-22deg]",
                                )}
                            >
                                Boy!
                            </button>
                            <button
                                onClick={() => setRefusing(true)}
                                onAnimationEnd={() => setRefusing(false)}
                                className={clsx(
                                    "choice dial dial-right paper tape ink flex-1 rotate-6 cursor-pointer py-6 text-2xl text-vintage-grape shadow-lg bg-cotton-candy hover:-translate-y-1 hover:shadow-xl active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-vintage-grape",
                                    refusing && "shake-no",
                                    phase === "falling" &&
                                        "drop-away [--drop-delay:110ms] [--drop-spin:26deg]",
                                )}
                            >
                                Girl!
                            </button>
                        </div>

                        <figure
                            className={clsx(
                                "w-full rotate-2",
                                phase === "falling" &&
                                    "drop-away [--drop-spin:9deg]",
                            )}
                        >
                            <div className="mat mat-round mat-seagrass [--mat-pad:1.5rem] aspect-square">
                                <div className="mat mat-round tear-c [--mat-pad:1.25rem] flex h-full items-center justify-center">
                                    <img
                                        src={baby}
                                        alt="A vintage illustration of four women in hats leaning over a baby carriage while a small dog watches"
                                        className="cutout w-full"
                                    />
                                </div>
                            </div>
                        </figure>
                    </div>
                </main>
            )}

            {raining && <Confetti onDone={stopRain} />}
        </>
    );
}

export default App;

import { useRef } from "react";

import babyZ from "../assets/images/baby-z.webp";
import mag1 from "../assets/images/baby-boy-ladies-mag-1.webp";
import mag2 from "../assets/images/baby-boy-ladies-mag-2.webp";
import mag3 from "../assets/images/baby-boy-ladies-mag-3.webp";
import mag4 from "../assets/images/baby-boy-ladies-mag-4.webp";

/* Four clippings, each on its own tear seed and its own tilt. Repeating
   either would give the collage a rhythm that reads as laid out rather
   than collected. */
const CLIPPINGS = [
    {
        src: mag1,
        alt: "A vintage illustration of a baby in a white gown propped against a cushion, chewing on a shoe",
        className:
            "clipping -rotate-3 drop-in [--drop-delay:140ms] [--drop-spin:-11deg]",
    },
    {
        src: mag2,
        alt: "A vintage illustration of a baby in a bib eating from a bowl with a spoon",
        className:
            "clipping tear-b rotate-2 drop-in [--drop-delay:210ms] [--drop-spin:9deg]",
    },
    {
        src: mag3,
        alt: "A vintage illustration of a baby lying down with its feet in the air, holding a rattle",
        className:
            "clipping tear-c rotate-3 drop-in [--drop-delay:280ms] [--drop-spin:10deg]",
    },
    {
        src: mag4,
        alt: "A vintage illustration of a baby sitting in a washtub with a toy duck",
        className:
            "clipping tear-b -rotate-2 drop-in [--drop-delay:350ms] [--drop-spin:-8deg]",
    },
];

/* The mount is the same at both sizes, so it lives in one place. */
function MountedScan({ pad }: { pad: string }) {
    return (
        <div className={`mat mat-blue mat-lift tear-c ${pad}`}>
            <div className="relative bg-floral-white p-2">
                <img
                    src={babyZ}
                    alt="An ultrasound photograph of the baby in profile"
                    className="w-full"
                />
                <div className="photo-corners pointer-events-none absolute inset-0" />
            </div>
        </div>
    );
}

export default function Reveal() {
    const zoom = useRef<HTMLDialogElement>(null);

    return (
        <main className="relative mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-center gap-10 px-4 py-12">
            <div className="mat mat-blue tear-b [--mat-pad:2rem] drop-in [--drop-spin:-7deg] -rotate-2 text-center">
                <p className="ink-loud text-4xl text-vintage-grape sm:text-5xl">
                    It’s a boy!
                </p>
            </div>

            <div className="relative w-full max-w-lg">
                <div className="grid grid-cols-2 items-center gap-5 sm:gap-7">
                    {CLIPPINGS.map((c) => (
                        <img
                            key={c.src}
                            src={c.src}
                            alt={c.alt}
                            className={`${c.className} w-full`}
                        />
                    ))}
                </div>

                {/* The only real photograph here, so it gets the only formal
                    mounting: a printed white border, held down by corners,
                    on its own coloured sheet, lying over everything else. */}
                <figure className="absolute top-1/2 left-1/2 z-10 w-[42%] -translate-x-1/2 -translate-y-1/2 rotate-3 drop-in [--drop-delay:450ms] [--drop-spin:13deg]">
                    <button
                        onClick={() => zoom.current?.showModal()}
                        aria-label="View the ultrasound larger"
                        className="block w-full cursor-zoom-in transition-transform duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-floral-white"
                    >
                        <MountedScan pad="[--mat-pad:0.7rem]" />
                    </button>
                </figure>
            </div>

            <div className="tape drop-in [--drop-delay:560ms] [--drop-spin:-10deg] -rotate-2">
                <div className="mat tear-b [--mat-pad:1.1rem]">
                    <p className="ink text-xl sm:text-2xl">See you April 8th</p>
                </div>
            </div>

            {/* Esc closes it natively; a click anywhere closes it too, which
                is what people reach for first in a photo viewer. */}
            <dialog ref={zoom} className="lightbox">
                <div
                    onClick={() => zoom.current?.close()}
                    className="flex h-full w-full cursor-zoom-out items-center justify-center p-4"
                >
                    <div className="w-[min(86vw,25rem)] rotate-1">
                        <MountedScan pad="[--mat-pad:1rem]" />
                    </div>
                </div>
            </dialog>
        </main>
    );
}

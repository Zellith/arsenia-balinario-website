"use client";

import Image from "next/image";
import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export type AirlineLogo = {
  name: string;
  src: string;
  width: number;
  height: number;
};

type AirlineCarouselProps = {
  airlines: AirlineLogo[];
  category: "local" | "international";
  heading: string;
};

function ArrowIcon({ direction }: Readonly<{ direction: "left" | "right" }>) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d={direction === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function AirlineCarousel({
  airlines,
  category,
  heading,
}: Readonly<AirlineCarouselProps>) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateControlState = useCallback(() => {
    const track = trackRef.current;

    if (!track) return;

    const maxScrollLeft = track.scrollWidth - track.clientWidth;
    setAtStart(track.scrollLeft <= 2);
    setAtEnd(maxScrollLeft <= 2 || track.scrollLeft >= maxScrollLeft - 2);
  }, []);

  useEffect(() => {
    updateControlState();
    window.addEventListener("resize", updateControlState);

    return () => window.removeEventListener("resize", updateControlState);
  }, [updateControlState]);

  const scrollTrack = useCallback((direction: -1 | 1) => {
    const track = trackRef.current;

    if (!track) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    track.scrollBy({
      behavior: reduceMotion ? "auto" : "smooth",
      left: direction * Math.max(track.clientWidth * 0.82, 240),
    });
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    scrollTrack(event.key === "ArrowLeft" ? -1 : 1);
  };

  return (
    <div className="airline-carousel" data-airline-carousel={category}>
      <div className="mb-4 flex items-end justify-between gap-5">
        <div>
          <h3 className="text-lg font-semibold tracking-[-0.02em] text-ink">
            {heading}
          </h3>
          <p className="mt-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
            {airlines.length} airlines
          </p>
        </div>

        <div className="flex gap-2">
          <button
            aria-label={`Previous ${category} airlines`}
            className="airline-carousel-control"
            disabled={atStart}
            onClick={() => scrollTrack(-1)}
            type="button"
          >
            <ArrowIcon direction="left" />
          </button>
          <button
            aria-label={`Next ${category} airlines`}
            className="airline-carousel-control"
            disabled={atEnd}
            onClick={() => scrollTrack(1)}
            type="button"
          >
            <ArrowIcon direction="right" />
          </button>
        </div>
      </div>

      <ul
        aria-label={`${heading} airline carousel`}
        className="airline-carousel-track"
        onKeyDown={handleKeyDown}
        onScroll={updateControlState}
        ref={trackRef}
        tabIndex={0}
      >
        {airlines.map((airline) => (
          <li
            className="airline-carousel-cell group"
            data-airline-logo={airline.name}
            key={airline.name}
          >
            <span aria-hidden="true" className="airline-logo-frame">
              <Image
                alt=""
                className="airline-logo-image"
                height={airline.height}
                src={airline.src}
                unoptimized
                width={airline.width}
              />
            </span>
            <span className="text-center font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-muted transition-colors duration-200 group-hover:text-ink">
              {airline.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

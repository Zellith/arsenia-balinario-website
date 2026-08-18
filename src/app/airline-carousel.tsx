"use client";

import Image from "next/image";
import {
  type FocusEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { getNextCarouselScrollLeft } from "./airline-carousel-motion";

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

const AUTOPLAY_DELAY_MS = 2_800;

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
  const interactionRef = useRef({ hasFocus: false, isHovered: false });
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

  useEffect(() => {
    const track = trackRef.current;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    if (!track || reducedMotion.matches) return;

    const intervalId = window.setInterval(() => {
      const { hasFocus, isHovered } = interactionRef.current;

      if (hasFocus || isHovered || document.hidden) return;

      const maxScrollLeft = track.scrollWidth - track.clientWidth;
      const scrollStep = Math.max(track.clientWidth * 0.82, 240);
      const nextScrollLeft = getNextCarouselScrollLeft(
        track.scrollLeft,
        maxScrollLeft,
        scrollStep,
      );

      track.scrollTo({
        behavior: nextScrollLeft === 0 ? "auto" : "smooth",
        left: nextScrollLeft,
      });
    }, AUTOPLAY_DELAY_MS);

    return () => window.clearInterval(intervalId);
  }, []);

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

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      interactionRef.current.hasFocus = false;
    }
  };

  return (
    <div
      className="airline-carousel"
      data-airline-carousel={category}
      data-autoplay="right"
      onBlurCapture={handleBlur}
      onFocusCapture={() => {
        interactionRef.current.hasFocus = true;
      }}
      onMouseEnter={() => {
        interactionRef.current.isHovered = true;
      }}
      onMouseLeave={() => {
        interactionRef.current.isHovered = false;
      }}
    >
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
        aria-live="off"
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

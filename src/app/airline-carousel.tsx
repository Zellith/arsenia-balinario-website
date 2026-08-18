"use client";

import Image from "next/image";
import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  easeOutCubic,
  getIntroCarouselScrollLeft,
} from "./airline-carousel-motion";

export type AirlineLogo = {
  name: string;
  src: string;
  width: number;
  height: number;
};

type AirlineCategory = "local" | "international";

export type AirlineGroup = {
  airlines: AirlineLogo[];
  category: AirlineCategory;
  label: string;
};

type AirlineCarouselProps = {
  groups: AirlineGroup[];
};

const INTRO_DRIFT_DURATION_MS = 900;

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

export function AirlineCarousel({ groups }: Readonly<AirlineCarouselProps>) {
  const rootRef = useRef<HTMLDivElement>(null);
  const tracksRef = useRef<Record<AirlineCategory, HTMLUListElement | null>>({
    international: null,
    local: null,
  });
  const tabsRef = useRef<Record<AirlineCategory, HTMLButtonElement | null>>({
    international: null,
    local: null,
  });
  const introHasRunRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const [activeCategory, setActiveCategory] =
    useState<AirlineCategory>("local");
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const activeGroup =
    groups.find((group) => group.category === activeCategory) ?? groups[0];
  const airlineCount = groups.reduce(
    (count, group) => count + group.airlines.length,
    0,
  );

  const updateControlState = useCallback(() => {
    const track = tracksRef.current[activeCategory];

    if (!track) return;

    const maxScrollLeft = track.scrollWidth - track.clientWidth;
    setAtStart(track.scrollLeft <= 2);
    setAtEnd(maxScrollLeft <= 2 || track.scrollLeft >= maxScrollLeft - 2);
  }, [activeCategory]);

  useEffect(() => {
    const track = tracksRef.current[activeCategory];

    track?.scrollTo({ behavior: "auto", left: 0 });
    updateControlState();
    window.addEventListener("resize", updateControlState);

    return () => window.removeEventListener("resize", updateControlState);
  }, [activeCategory, updateControlState]);

  useEffect(() => {
    const root = rootRef.current;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    if (
      !root ||
      reducedMotion.matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || introHasRunRef.current) return;

        const track = tracksRef.current.local;
        const firstCell = track?.firstElementChild as HTMLElement | null;

        introHasRunRef.current = true;
        observer.disconnect();

        if (!track || !firstCell) return;

        const start = track.scrollLeft;
        const maxScrollLeft = track.scrollWidth - track.clientWidth;
        const target = getIntroCarouselScrollLeft(
          start,
          maxScrollLeft,
          firstCell.getBoundingClientRect().width,
        );

        if (target <= start) return;

        let startTime: number | null = null;

        const drift = (timestamp: number) => {
          startTime ??= timestamp;
          const progress = Math.min(
            (timestamp - startTime) / INTRO_DRIFT_DURATION_MS,
            1,
          );
          track.scrollLeft = start + (target - start) * easeOutCubic(progress);

          if (progress < 1) {
            animationFrameRef.current = window.requestAnimationFrame(drift);
          } else {
            animationFrameRef.current = null;
            updateControlState();
          }
        };

        animationFrameRef.current = window.requestAnimationFrame(drift);
      },
      { threshold: 0.35 },
    );

    observer.observe(root);

    return () => {
      observer.disconnect();
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [updateControlState]);

  const scrollTrack = useCallback(
    (direction: -1 | 1) => {
      const track = tracksRef.current[activeCategory];

      if (!track) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      track.scrollBy({
        behavior: reduceMotion ? "auto" : "smooth",
        left: direction * Math.max(track.clientWidth * 0.82, 240),
      });
    },
    [activeCategory],
  );

  const handleTrackKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    scrollTrack(event.key === "ArrowLeft" ? -1 : 1);
  };

  const handleTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    category: AirlineCategory,
  ) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    const categories = groups.map((group) => group.category);
    const currentIndex = categories.indexOf(category);
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (currentIndex + direction + categories.length) % categories.length;
    const nextCategory = categories[nextIndex];

    setActiveCategory(nextCategory);
    tabsRef.current[nextCategory]?.focus();
  };

  return (
    <div
      className="airline-carousel"
      data-airline-carousel="segmented"
      ref={rootRef}
    >
      <div className="mb-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brass">
            {airlineCount} airlines
          </p>
          <div
            aria-label="Airline categories"
            className="airline-carousel-tabs mt-3"
            role="tablist"
          >
            {groups.map((group) => {
              const isActive = group.category === activeCategory;

              return (
                <button
                  aria-controls={`airline-panel-${group.category}`}
                  aria-selected={isActive}
                  className="airline-carousel-tab"
                  id={`airline-tab-${group.category}`}
                  key={group.category}
                  onClick={() => setActiveCategory(group.category)}
                  onKeyDown={(event) =>
                    handleTabKeyDown(event, group.category)
                  }
                  ref={(node) => {
                    tabsRef.current[group.category] = node;
                  }}
                  role="tab"
                  tabIndex={isActive ? 0 : -1}
                  type="button"
                >
                  {group.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-2 self-end sm:self-auto">
          <button
            aria-label={`Previous ${activeGroup.label.toLowerCase()} airlines`}
            className="airline-carousel-control"
            disabled={atStart}
            onClick={() => scrollTrack(-1)}
            type="button"
          >
            <ArrowIcon direction="left" />
          </button>
          <button
            aria-label={`Next ${activeGroup.label.toLowerCase()} airlines`}
            className="airline-carousel-control"
            disabled={atEnd}
            onClick={() => scrollTrack(1)}
            type="button"
          >
            <ArrowIcon direction="right" />
          </button>
        </div>
      </div>

      {groups.map((group) => (
        <div
          aria-labelledby={`airline-tab-${group.category}`}
          hidden={group.category !== activeCategory}
          id={`airline-panel-${group.category}`}
          key={group.category}
          role="tabpanel"
        >
          <ul
            aria-label={`${group.label} airline carousel`}
            aria-live="off"
            className="airline-carousel-track"
            data-airline-category={group.category}
            onKeyDown={handleTrackKeyDown}
            onScroll={
              group.category === activeCategory ? updateControlState : undefined
            }
            ref={(node) => {
              tracksRef.current[group.category] = node;
            }}
            tabIndex={0}
          >
            {group.airlines.map((airline) => (
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
      ))}
    </div>
  );
}

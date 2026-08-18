"use client";

import { useEffect, useRef } from "react";

export function FlightPath() {
  const routeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const route = routeRef.current;
    if (!route || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    route.dataset.flightState = "waiting";
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        frame = requestAnimationFrame(() => {
          route.dataset.flightState = "running";
        });
        observer.disconnect();
      },
      { threshold: 0.5 },
    );

    observer.observe(route);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="trip-route"
      data-flight-path=""
      data-flight-state={undefined}
      ref={routeRef}
    >
      <svg
        className="trip-route-line"
        preserveAspectRatio="none"
        viewBox="0 0 144 32"
      >
        <path d="M4 16 C44 5 100 27 140 16" />
      </svg>
      <span className="trip-route-plane">
        <svg fill="none" viewBox="0 0 24 24">
          <path
            d="m3.5 13.25 7.4-2.05 3.57-7.04c.22-.43.67-.7 1.15-.7h.3c.52 0 .9.5.76 1l-1.72 6.01 4.73-1.31c.78-.22 1.59.13 1.98.84.45.84.11 1.88-.75 2.28l-5.15 2.41.9 4.94c.09.5-.3.96-.8.96h-.35c-.42 0-.81-.2-1.05-.55l-2.97-4.31-4.35 2.03-1.53 1.89c-.23.28-.57.44-.93.44h-.17c-.43 0-.74-.42-.61-.83l.9-2.82-2.02-1.8c-.47-.42-.04-1.18.58-1.01Z"
            fill="currentColor"
          />
        </svg>
      </span>
    </div>
  );
}

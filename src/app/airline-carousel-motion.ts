export function getIntroCarouselScrollLeft(
  currentScrollLeft: number,
  maxScrollLeft: number,
  cellWidth: number,
) {
  if (maxScrollLeft <= 0 || cellWidth <= 0) return currentScrollLeft;

  return Math.min(currentScrollLeft + cellWidth, maxScrollLeft);
}

export function easeOutCubic(progress: number) {
  return 1 - Math.pow(1 - progress, 3);
}

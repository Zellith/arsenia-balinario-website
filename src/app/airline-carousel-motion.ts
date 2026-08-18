const END_TOLERANCE_PX = 2;

export function getNextCarouselScrollLeft(
  currentScrollLeft: number,
  maxScrollLeft: number,
  scrollStep: number,
) {
  if (
    maxScrollLeft <= END_TOLERANCE_PX ||
    currentScrollLeft >= maxScrollLeft - END_TOLERANCE_PX
  ) {
    return 0;
  }

  return Math.min(currentScrollLeft + scrollStep, maxScrollLeft);
}

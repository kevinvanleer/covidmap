export const factorial = (input) => {
  if (input === 0) {
    return 1;
  } else {
    return input * factorial(input - 1);
  }
};

export const nCi = (n, i) => {
  return factorial(n) / (factorial(i) * factorial(n - i));
};

export const bezierTerm = (t, i, pi) =>
  nCi(3, i) * Math.pow(1 - t, 3 - i) * Math.pow(t, i) * pi;

export const cubicBezier = (values) => (t) => {
  return values.reduce((sum, pi, i) => sum + bezierTerm(t, i, pi));
};

export const cubicBezier2D = (
  anchorStart,
  controlStart,
  controlEnd,
  anchorEnd
) => (t) => {
  const { x: p0x, y: p0y } = anchorStart;
  const { x: p1x, y: p1y } = controlStart;
  const { x: p2x, y: p2y } = controlEnd;
  const { x: p3x, y: p3y } = anchorEnd;

  return {
    x: cubicBezier([p0x, p1x, p2x, p3x])(t),
    y: cubicBezier([p0y, p1y, p2y, p3y])(t),
  };
};

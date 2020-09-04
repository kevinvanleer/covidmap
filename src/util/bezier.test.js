import {
  factorial,
  nCi,
  bezierTerm,
  cubicBezier,
  cubicBezier2D,
  cubicBezierFindY,
} from './bezier.js';

test('factorial', () => {
  expect(factorial(0)).toBe(1);
  expect(factorial(1)).toBe(1);
  expect(factorial(2)).toBe(2);
  expect(factorial(3)).toBe(6);
});

test('nCi', () => {
  expect(nCi(3, 0)).toBe(1);
  expect(nCi(3, 1)).toBe(3);
  expect(nCi(3, 2)).toBe(3);
  expect(nCi(3, 3)).toBe(1);
});

//t,i,pi
test('bezierTerm', () => {
  expect(bezierTerm(0, 0, 0)).toBe(0);
  expect(bezierTerm(0, 0, 1)).toBe(1);
  expect(bezierTerm(0, 0, 0.5)).toBe(0.5);
  expect(bezierTerm(0, 1, 0.5)).toBe(0);
  expect(bezierTerm(0, 2, 0.5)).toBe(0);
  expect(bezierTerm(0, 3, 0.5)).toBe(0);

  expect(bezierTerm(0.5, 0, 0.5)).toBe(0.0625);
  expect(bezierTerm(0.5, 1, 0.5)).toBe(0.1875);
  expect(bezierTerm(0.5, 2, 0.5)).toBe(0.1875);
  expect(bezierTerm(0.5, 3, 0.5)).toBe(0.0625);

  expect(bezierTerm(0.2, 0, 0.5)).toBeCloseTo(0.256, 6);
  expect(bezierTerm(0.2, 1, 0.5)).toBeCloseTo(0.192, 6);
  expect(bezierTerm(0.2, 2, 0.5)).toBeCloseTo(0.048, 6);
  expect(bezierTerm(0.2, 3, 0.5)).toBeCloseTo(0.004, 6);

  expect(bezierTerm(0, 0, 0.75)).toBe(0.75);
  expect(bezierTerm(0, 1, 0.75)).toBe(0);
  expect(bezierTerm(0, 2, 0.75)).toBe(0);
  expect(bezierTerm(0, 3, 0.75)).toBe(0);

  expect(bezierTerm(0.4, 0, 0.75)).toBeCloseTo(0.162, 6);
  expect(bezierTerm(0.4, 1, 0.75)).toBeCloseTo(0.324, 6);
  expect(bezierTerm(0.4, 2, 0.75)).toBeCloseTo(0.216, 6);
  expect(bezierTerm(0.4, 3, 0.75)).toBeCloseTo(0.048, 6);
});

test('cubicBezier', () => {
  expect(cubicBezier([0, 0.1, 0.1, 1])(0)).toBe(0);
  expect(cubicBezier([0, 0.1, 0.9, 1])(0.5)).toBe(0.5);
  expect(cubicBezier([0, 0.1, 0.9, 1])(1)).toBe(1);
  expect(cubicBezier([0, 1, 1, 1])(0)).toBe(0);
  expect(cubicBezier([0, 1, 1, 1])(1)).toBe(1);
  expect(cubicBezier([0, 0.2, 0.4, 1])(0)).toBe(0);
  expect(cubicBezier([0, 0.1231, 0.7, 1])(1)).toBe(1);
  expect(cubicBezier([0, 1, 0.9, 1])(0.5)).toBe(0.8375);
});

test('cubicBezier2D', () => {
  expect(cubicBezier2D({}, {}, {}, {})(0)).toEqual({ x: NaN, y: NaN });
  let result = cubicBezier2D(
    { x: 0, y: 0 },
    { x: 0.1, y: 0.1 },
    { x: 0.9, y: 0.9 },
    { x: 1, y: 1 }
  )(0);
  expect(result.x).toBeCloseTo(0, 6);
  expect(result.y).toBeCloseTo(0, 6);

  result = cubicBezier2D(
    { x: 0, y: 0 },
    { x: 0.1, y: 0.1 },
    { x: 0.9, y: 0.9 },
    { x: 1, y: 1 }
  )(1);
  expect(result.x).toBeCloseTo(1, 6);
  expect(result.y).toBeCloseTo(1, 6);

  result = cubicBezier2D(
    { x: 0, y: 0 },
    { x: 0.1, y: 0.1 },
    { x: 0.9, y: 0.9 },
    { x: 1, y: 1 }
  )(0.5);
  expect(result.x).toBeCloseTo(0.5, 6);
  expect(result.y).toBeCloseTo(0.5, 6);

  result = cubicBezier2D(
    { x: 0, y: 0 },
    { x: 0.2, y: 0.4 },
    { x: 0.6, y: 0.8 },
    { x: 1, y: 1 }
  )(0.5);
  expect(result.x).toBeCloseTo(0.425, 6);
  expect(result.y).toBeCloseTo(0.575, 6);

  result = cubicBezier2D(
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0.17, y: 0.9 },
    { x: 1, y: 1 }
  )(0.5);
  expect(result.x).toBeCloseTo(0.18875, 6);
  expect(result.y).toBeCloseTo(0.8375, 6);
});

test('cubicBezierFindY', () => {
  expect(
    cubicBezierFindY(
      { x: 0, y: 0 },
      { x: 0, y: 0.8 },
      { x: 1.7e6, y: 0.72 },
      { x: 1e7, y: 0.8 }
    )(1e4)
  ).toBeCloseTo(0.1, 2);
  expect(
    cubicBezierFindY(
      { x: 0, y: 0 },
      { x: 0, y: 0.8 },
      { x: 1.7e6, y: 0.72 },
      { x: 1e7, y: 0.8 }
    )(1e5)
  ).toBeCloseTo(0.27, 2);
  expect(
    cubicBezierFindY(
      { x: 0, y: 0 },
      { x: 0, y: 0.8 },
      { x: 1.7e6, y: 0.72 },
      { x: 1e7, y: 0.8 }
    )(1e6)
  ).toBeCloseTo(0.587, 2);
  expect(
    cubicBezierFindY(
      { x: 0, y: 0 },
      { x: 0, y: 0.8 },
      { x: 1.7e11, y: 0.72 },
      { x: 1e12, y: 0.8 }
    )(1e6)
  ).toBeCloseTo(0.0046, 2);
});

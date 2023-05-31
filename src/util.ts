type Point = [number, number]
type RGB = [number, number, number]

function interpolate(p0: Point, p1: Point): Point[] {
  if (p0[0] > p1[0]) [p0, p1] = [p1, p0]
  const [i0, d0] = p0
  const [i1, d1] = p1
  if (i0 === i1) return [p0]
  const k = (d1 - d0) / (i1 - i0)
  const values: [number, number][] = []
  for (let i = i0, d = d0; i <= i1; i++, d += k) {
    values.push([i, d])
  }
  return values
}

function groupBy<T, A extends string | number | symbol>(arr: T[], mapFn: (t: T) => A): Record<A, T[]> {
  const record: Record<A, T[]> = {} as Record<A, T[]>
  arr.forEach(x => {
    const key = mapFn(x)
    if (!record[key]) record[key] = []
    record[key].push(x)
  })
  return record
}

const Point = {
  plus(a: Point, b: Point): Point {
    return a.map((_,i) => a[i] + b[i]) as Point
  },
  minus(a: Point, b: Point): Point {
    return a.map((_,i) => a[i] - b[i]) as Point
  },
  multiply(a: Point, n: number): Point {
    return a.map(d => d * n) as Point
  },
  dist(a: Point, b: Point): number {
    return Math.sqrt(Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2))
  }
}

function getColor(a: Point, b: Point, c0: RGB, c1: RGB, x: Point): RGB {
  // x = a * |XB| / |AB| + b * |XA| / |AB|
  const xbDist = Point.dist(x, b)
  const abDist = Point.dist(a, b)
  const xaDist = Point.dist(x, a)
  return c0.map((_, i) => c0[i] * xbDist / abDist + c1[i] * xaDist / abDist).map(x => Math.floor(x)) as RGB
}
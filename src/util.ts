function interpolate(p0: [number, number], p1: [number, number]): [number, number][] {
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
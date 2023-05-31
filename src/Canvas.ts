type Pen = {
  putPixel(x: number, y: number, color?: [number, number, number]): void
  putLine(p0: [number, number], p1: [number, number], color?: [number, number, number]): void
  putTriangleWireframe(p0: [number, number], p1: [number, number], p2: [number, number], color?: [number, number, number]): void
  putGradientLine(p0: Point, p1: Point, c0: RGB, c1: RGB): void
  drawFilledTriangle(p0: [number, number], p1: [number, number], p2: [number, number], color?: [number, number, number]): void
  drawGradientTriangle(p0: Point, p1: Point, p2: Point, c0: RGB, c1: RGB, c2: RGB): void
}

class Canvas {
  private readonly canvas: HTMLCanvasElement
  constructor(elem: HTMLElement) {
    if (elem instanceof HTMLCanvasElement) {
      this.canvas = elem
    } else {
      this.canvas = document.createElement('canvas')
      elem.appendChild(this.canvas)
    }
  }
  get width():number {
    return this.canvas.width
  }
  set width(n: number) {
    this.canvas.width = n
  }
  get height():number {
    return this.canvas.height
  }
  set height(n: number) {
    this.canvas.height = n
  }
  
  /**
   * 对每个pixel，坐标原点为左上
   * @param fn 
   */
  forEachPixel(fn: (x: number, y: number) => void): void {
    const halfW = Math.floor(this.width / 2)
    const halfH = Math.floor(this.height / 2)
    for (let x = -halfW; x < halfW; x++) {
      for (let y = -halfH; y < halfH; y++) {
        fn(x, y)
      }
    }
  }

  draw(body: (pen: Pen) => void): void {
    const canvas = this.canvas
    const canvasContext = canvas.getContext("2d")!;
    const canvasBuffer = canvasContext.getImageData(0, 0, canvas.width, canvas.height)
    const canvasPitch = canvasBuffer.width * 4;
    const pen: Pen = {
      putPixel(x, y, color = [0, 0, 0]) {
        x = Math.floor(canvas.width/2 + x);
        y = Math.floor(canvas.height/2 - y - 1);
        if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) {
          return;
        }
        let offset = 4*x + canvasPitch*y;
        canvasBuffer.data[offset++] = color[0];
        canvasBuffer.data[offset++] = color[1];
        canvasBuffer.data[offset++] = color[2];
        canvasBuffer.data[offset++] = 255; // Alpha = 255 (full opacity)
      },

      putLine(p0, p1, color = [0, 0, 0]) {
        const [x0, y0] = p0
        const [x1, y1] = p1
        // 直线偏向x轴
        if (Math.abs(x1 - x0) > Math.abs(y1 - y0)) {
          interpolate([x0, y0], [x1, y1]).forEach(([x, y]) => {
            this.putPixel(x, y, color)
          })
        } else {
          // 直线偏向y轴
          interpolate([y0, x0], [y1, x1]).forEach(([y, x]) => {
            this.putPixel(x, y, color)
          })
        }
      },
      putTriangleWireframe(p0, p1, p2, color = [0, 0, 0]) {
        this.putLine(p0, p1, color)
        this.putLine(p1, p2, color)
        this.putLine(p2, p0, color)
      },

      drawFilledTriangle(p0, p1, p2, color = [0, 0, 0]) {
        const allPoints: [number, number][] = [...interpolate(p0, p1), ...interpolate(p1, p2), ...interpolate(p2, p0)]
        const x2Points = groupBy(allPoints, ([x, y]) => x)
        Object.entries(x2Points).forEach(([x, ps]) => {
          if (ps.length <= 1) return
          const ys = ps.map(([x, y]) => y).sort()
          const yBottom = ys[0]
          const yTop = ys[ys.length - 1]
          this.putLine([+x, yBottom], [+x, yTop], color)
        })
      },
      
      putGradientLine(p0, p1, c0, c1) {
        const [x0, y0] = p0
        const [x1, y1] = p1
        // 直线偏向x轴
        if (Math.abs(x1 - x0) > Math.abs(y1 - y0)) {
          interpolate([x0, y0], [x1, y1]).forEach(([x, y]) => {
            this.putPixel(x, y, getColor(p0, p1, c0, c1, [x, y]))
          })
        } else {
          // 直线偏向y轴
          interpolate([y0, x0], [y1, x1]).forEach(([y, x]) => {
            this.putPixel(x, y, getColor([y0, x0], [y1, x1], c0, c1, [y, x]))
          })
        }
      },

      drawGradientTriangle(p0, p1, p2, c0, c1, c2) {
        // x和rgb的关系其实也可以直接使用interpolate计算，只需要将rgb转换为一个整数作为因变量即可
        const p01s = interpolate(p0, p1).map((x) => {
          const color = getColor(p0, p1, c0, c1, x)
          return [x, color] as [Point, RGB]
        })
        const p02s = interpolate(p0, p2).map((x) => {
          const color = getColor(p0, p2, c0, c2, x)
          return [x, color] as [Point, RGB]
        })
        const p12s = interpolate(p1, p2).map((x) => {
          const color = getColor(p1, p2, c1, c2, x)
          return [x, color] as [Point, RGB]
        })
        const x2Points = groupBy([...p01s, ...p02s, ...p12s], ([[x, y]]) => x)
        Object.entries(x2Points).forEach(([x, ps]) => {
          if (ps.length <= 1) return
          const ys = ps.sort(([[,y0]], [[,y1]]) => y0 - y1)
          const [[, yBottom], cBottom] = ys[0]
          const  [[, yTop], cTop] = ys[ys.length - 1]
          this.putGradientLine([+x, yBottom], [+x, yTop], cBottom, cTop)
        })
      },
    }
    body(pen)
    canvasContext.putImageData(canvasBuffer, 0, 0)
  }
}
const lineExamples = {
    "0.5x+10": (canvas: Canvas) => {
        canvas.draw(pen => {
            pen.putLine([-1000, -490], [1000, 510])
        })
    },
    "10x+10": (canvas: Canvas) => {
        canvas.draw(pen => {
            pen.putLine([-100, -990], [100, 1010])
        })
    },
    "0.1x+10": (canvas: Canvas) => {
        canvas.draw(pen => {
            pen.putLine([-1000, -90], [1000, 110])
        })
    }
}
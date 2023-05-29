type Example = (pen: Pen) => void

window.onload = async () => {
    const canvas = new Canvas(document.querySelector('#root')!)
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    canvas.draw(pen => {
        pen.drawFilledTriangle([0, 0], [10, -300], [120, 370], [0, 255, 0])
        pen.putTriangleWireframe([0, 0], [10, -300], [120, 370], [0, 0, 0])
        pen.drawFilledTriangle([100, 0], [110, -300], [220, 370], [0, 255, 0])
        
        pen.drawFilledTriangle([-200, 370], [-110, -300], [20, 370], [0, 255, 0])
        pen.putTriangleWireframe([-200, 370], [-110, -300], [20, 370], [0, 0, 0])
        pen.drawFilledTriangle([-420, 370], [-330, -300], [-200, 370], [0, 255, 0])
    })
}
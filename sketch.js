const canvasSize = [1350, 1350]
const canvasCenter = [canvasSize[0] / 2, canvasSize[1] / 2]

const EARTH_RADIUS = 6371
const EARTH_CIRCUMFERENCE = Math.PI * 2 * EARTH_RADIUS
const KM_PER_PIXEL = 37 // found via testing
const EARTH_VISUAL_RADIUS = EARTH_RADIUS / KM_PER_PIXEL
const EARTH_VISUAL_DIAMETER = EARTH_VISUAL_RADIUS * 2
const EARTH_RIGHT_EDGE_POSITION = [canvasCenter[0] + EARTH_VISUAL_RADIUS, canvasCenter[1]]
const fontSize = canvasSize[0] * (22 / 800)

let viewerHeight = 0
let viewerVisualHeight = 0

function setup() {
  createCanvas(...canvasSize)

  ellipseMode(CENTER)
  textAlign(LEFT, TOP)
  frameRate(60)
}

function draw() {
  background(51, 51, 51)
  // viewerHeight = max(0, (canvasSize[1] - mouseY) - (EARTH_VISUAL_DIAMETER + ((canvasSize[1] - EARTH_VISUAL_DIAMETER) / 2))) * KM_PER_PIXEL
  viewerHeight = lerp(
    viewerHeight, 
    max(0, (canvasSize[1] - mouseY) - (EARTH_VISUAL_DIAMETER + ((canvasSize[1] - EARTH_VISUAL_DIAMETER) / 2))) * KM_PER_PIXEL, 
    0.20
  )
  viewerVisualHeight = canvasCenter[0] - ((viewerHeight + EARTH_RADIUS) / KM_PER_PIXEL)
  viewerVisualPosition = [canvasCenter[0], viewerVisualHeight]
  const distanceToHorizon = sqrt(((EARTH_RADIUS + viewerHeight) ** 2) - (EARTH_RADIUS ** 2))
  const visualHorizonPoint = [viewerVisualPosition[0] + distanceToHorizon / KM_PER_PIXEL, viewerVisualPosition[1]]
  console.log(distanceToHorizon, "km to horizon")

  // work out what angle to use to render the line tangentially
  // cos(theta) = adjacent / hypotenuse
  // theta = cos^-1(adjacent / hypotenuse)
  //
  // adjacent = EARTH_RADIUS + viewerHeight
  // hypotenuse = distanceToHorizon
  // const hypotenuseAngle = Math.acos((EARTH_RADIUS + viewerHeight) / distanceToHorizon)
  // const hypotenuseAngle = -1 * (Math.acos(distanceToHorizon / (EARTH_RADIUS + viewerHeight)))
  const hypotenuseAngle = Math.acos(distanceToHorizon / (EARTH_RADIUS + viewerHeight))
  const hypotenuseEndPoint = [
    viewerVisualPosition[0] + ((distanceToHorizon / KM_PER_PIXEL) * Math.sin(hypotenuseAngle)),
    viewerVisualPosition[1] + ((distanceToHorizon / KM_PER_PIXEL) * Math.cos(hypotenuseAngle))
  ]
  console.log(hypotenuseAngle, (EARTH_RADIUS + viewerHeight), (EARTH_RADIUS + viewerHeight) / distanceToHorizon, hypotenuseEndPoint)

  ellipse(...canvasCenter, EARTH_VISUAL_DIAMETER, EARTH_VISUAL_DIAMETER)

  push()
  fill(255, 0, 0)
  ellipse(...viewerVisualPosition, 15, 15)
  pop()

  push()
  strokeWeight(5)
  line(...canvasCenter, ...viewerVisualPosition)
  line(...viewerVisualPosition, ...hypotenuseEndPoint)
  line(...canvasCenter, ...hypotenuseEndPoint)
  pop()

  push()
  // Render Text
  textSize(fontSize)
  fill(255, 255, 255)

  let lineIndex = 0
  text(`Elavation: ${round(viewerHeight, 2)} km`, 0, 10 + (fontSize * lineIndex)); lineIndex ++
  text(`Dist. to horizon: ${round(distanceToHorizon, 2)} km`, 0, 10 + (fontSize * lineIndex)); lineIndex ++

  pop()


  // viewerHeight ++
}


chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "extractSVG") {
        let svgScale = document.querySelector("#scale")
        let scale = parseFloat(svgScale.value) // mm / px
        // norm to new pixel size
        // scale = 96 / 25.4 / scale
        scale = 72 / 25.4 / scale

        const gears = document.querySelectorAll('#screen .svggear')
        let svgGears = []
        for (let gear of gears) {

            if (gear.querySelector('path').classList.contains('chainpoly')) {
                continue
            }

            let svgGear = new XMLSerializer().serializeToString(gear)
            if (svgScale) {
                svgGear = resizeSVGWithFactor(svgGear, scale)
            }
            svgGears.push(svgGear)
        }

        chrome.runtime.sendMessage({
            svgGears: svgGears
        })
    }
})

function resizeSVGWithFactor(svgIn, scale) {
    if (isNaN(scale) || scale <= 0 || scale === 1.0) {
        return svgIn
    }

    let parser = new DOMParser()
    let svgDoc = parser.parseFromString(svgIn, "image/svg+xml")

    let svg = svgDoc.querySelector("svg")
    scaleSVG(svg, scale)

    let path = svgDoc.querySelector("path")
    scalePath(path, scale)

    let circles = svgDoc.querySelectorAll("circle")
    for (let circle of circles) {
        scaleCircle(circle, scale)
    }

    let polylines = svgDoc.querySelectorAll("polyline")
    for (let polyline of polylines) {
        scalePolyline(polyline, scale)
    }

    return new XMLSerializer().serializeToString(svgDoc)
}

function scaleSVG(svg, scale) {
    if (svg) {
        let width = parseFloat(svg.getAttribute("width"))
        svg.setAttribute("width", `${width * scale}px`)
        let height = parseFloat(svg.getAttribute("height"))
        svg.setAttribute("height", `${height * scale}px`)
        let viewBox = svg.getAttribute("viewBox")
        if (viewBox) {
            let viewBoxParts = viewBox.split(" ").map(part => parseFloat(part) * scale)
            svg.setAttribute("viewBox", viewBoxParts.join(" "))
        }
    }
}

function scalePath(path, scale) {
    if (path) {
        let d = path.getAttribute("d")

        let points = d
            .split(/[\s,]+/) // Remove spaces and commas
            .filter(Boolean) // Remove empty items
            .flatMap(item => item.split(/(?<=\d)(?=[a-zA-Z])|(?<=[a-zA-Z])(?=[-]?\d)/));

        let afterA = 0
        let newPoints = points.map(point => {

            if (point === "A" || point === "a") {
                afterA = 1
                return point
            }

            if (isNaN(parseFloat(point))) {
                afterA = 0
                return point
            }

            if (afterA > 0) {
                afterA++
            }
            if (afterA > 8) {
                afterA = 0
            }

            // afterA   1 2  3  4                 5                6          7 8
            //          A rx ry x-axis-rotation   large-arc-flag   sweep-flag x y
            // do not scale     x-axis-rotation / large-arc-flag / sweep-flag
            if (afterA === 4 || afterA === 5 || afterA === 6) {
                return point
            }
            return parseFloat(point) * scale
        })
        path.setAttribute("d", newPoints.join(" "))
    }
}

function scaleCircle(circle, scale) {
    let cx = parseFloat(circle.getAttribute("cx")) * scale
    let cy = parseFloat(circle.getAttribute("cy")) * scale
    let r = parseFloat(circle.getAttribute("r")) * scale
    circle.setAttribute("cx", cx)
    circle.setAttribute("cy", cy)
    circle.setAttribute("r", r)
}

function scalePolyline(polyline, scale) {
    let points = polyline.getAttribute("points")
    let pointArray = points.split(/[\s,]+/)
    let newPoints = pointArray.map(f => {
        if (isNaN(parseFloat(f))) {
            return f
        }
        return parseFloat(f) * scale
    })
    points = newPoints.join(" ")
    polyline.setAttribute("points", points)
}


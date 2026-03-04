/**
 * Render a pie chart onto a <canvas> element using the native Canvas 2D API.
 *
 * @param {HTMLCanvasElement} canvas - Target canvas element
 * @param {object[]} slices - Array of { label: string, value: number, color: string }
 * @param {object} [options]
 * @param {string} [options.title] - Optional chart title
 * @param {boolean} [options.showLegend=true]
 * @param {boolean} [options.showPercentages=true]
 * @param {boolean} [options.showValues=true]
 */
export function renderPieChart(canvas, slices, options = {}) {
    const {
        title = '',
        showLegend = true,
        showPercentages = true,
        showValues = true
    } = options

    const dpr = window.devicePixelRatio || 1
    const displayW = canvas.clientWidth || 300
    const displayH = canvas.clientHeight || 300

    canvas.width = displayW * dpr
    canvas.height = displayH * dpr

    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, displayW, displayH)

    const total = slices.reduce((s, d) => s + d.value, 0)
    if (total === 0) {
        ctx.fillStyle = '#8C4F3E'
        ctx.font = '500 14px Manrope, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('Sem dados', displayW / 2, displayH / 2)
        return
    }

    // Layout constants
    const titleHeight = title ? 32 : 0
    const legendHeight = showLegend ? Math.ceil(slices.length / 2) * 28 + 16 : 0
    const availableH = displayH - titleHeight - legendHeight
    const radius = Math.min(displayW * 0.32, availableH * 0.42)
    const cx = displayW / 2
    const cy = titleHeight + availableH / 2

    // Draw title
    if (title) {
        ctx.fillStyle = '#591C0B'
        ctx.font = 'bold 15px Manrope, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(title, displayW / 2, 22)
    }

    // Draw slices
    let startAngle = -Math.PI / 2
    const sliceAngles = []

    slices.forEach((slice) => {
        const sliceAngle = (slice.value / total) * 2 * Math.PI
        sliceAngles.push({ start: startAngle, end: startAngle + sliceAngle, slice })

        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle)
        ctx.closePath()
        ctx.fillStyle = slice.color
        ctx.fill()

        // White separator
        ctx.strokeStyle = '#FFFFFF'
        ctx.lineWidth = 2
        ctx.stroke()

        // Label on slice
        if (sliceAngle > 0.25) {
            const midAngle = startAngle + sliceAngle / 2
            const labelR = radius * 0.65
            const lx = cx + Math.cos(midAngle) * labelR
            const ly = cy + Math.sin(midAngle) * labelR
            const pct = Math.round((slice.value / total) * 100)

            ctx.fillStyle = '#FFFFFF'
            ctx.font = 'bold 13px Manrope, sans-serif'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'

            if (showPercentages && showValues) {
                ctx.fillText(`${pct}%`, lx, ly - 7)
                ctx.font = '500 11px Manrope, sans-serif'
                ctx.fillText(`(${slice.value})`, lx, ly + 9)
            } else if (showPercentages) {
                ctx.fillText(`${pct}%`, lx, ly)
            } else if (showValues) {
                ctx.fillText(`${slice.value}`, lx, ly)
            }
        }

        startAngle += sliceAngle
    })

    // Draw legend
    if (showLegend) {
        const legendY = displayH - legendHeight + 12
        const cols = Math.min(slices.length, 2)
        const colW = displayW / cols

        slices.forEach((slice, i) => {
            const col = i % cols
            const row = Math.floor(i / cols)
            const lx = col * colW + 16
            const ly = legendY + row * 26

            // Color dot
            ctx.beginPath()
            ctx.arc(lx + 6, ly + 6, 6, 0, Math.PI * 2)
            ctx.fillStyle = slice.color
            ctx.fill()

            // Label text
            const pct = Math.round((slice.value / total) * 100)
            ctx.fillStyle = '#591C0B'
            ctx.font = '500 12px Manrope, sans-serif'
            ctx.textAlign = 'left'
            ctx.textBaseline = 'middle'
            ctx.fillText(`${slice.label}: ${slice.value} (${pct}%)`, lx + 18, ly + 7)
        })
    }
}

/**
 * Predefined brand-consistent color palette for pie charts.
 */
export const CHART_COLORS = [
    '#EA5B0C', // primary orange
    '#591C0B', // dark brown
    '#F4965B', // light orange
    '#8C4F3E', // medium brown
    '#FFB380', // peach
    '#2D8B75', // teal
    '#4A90D9', // blue
    '#D94577', // rose
    '#7B61FF', // purple
    '#33B679', // green
]

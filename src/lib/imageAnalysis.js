import ColorThief from 'colorthief'

export async function extractColors(imageElement) {
  return new Promise((resolve, reject) => {
    if (!imageElement.complete) {
      imageElement.onload = () => {
        try {
          const colorThief = new ColorThief()
          const palette = colorThief.getPalette(imageElement, 5)
          const dominantColor = colorThief.getColor(imageElement)
          resolve({
            dominant: rgbToHex(dominantColor[0], dominantColor[1], dominantColor[2]),
            palette: palette.map(rgb => rgbToHex(rgb[0], rgb[1], rgb[2]))
          })
        } catch (error) {
          reject(error)
        }
      }
    } else {
      try {
        const colorThief = new ColorThief()
        const palette = colorThief.getPalette(imageElement, 5)
        const dominantColor = colorThief.getColor(imageElement)
        resolve({
          dominant: rgbToHex(dominantColor[0], dominantColor[1], dominantColor[2]),
          palette: palette.map(rgb => rgbToHex(rgb[0], rgb[1], rgb[2]))
        })
      } catch (error) {
        reject(error)
      }
    }
  })
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('').toUpperCase()
}

export function analyzeDesign(imageElement) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = imageElement.width
  canvas.height = imageElement.height

  ctx.drawImage(imageElement, 0, 0)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data

  let whitespaceRatio = 0
  let darkPixels = 0

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const brightness = (r + g + b) / 3

    if (brightness > 240) {
      whitespaceRatio++
    }
    if (brightness < 100) {
      darkPixels++
    }
  }

  const totalPixels = data.length / 4
  const whitespacePercent = Math.round((whitespaceRatio / totalPixels) * 100)
  const darkPercent = Math.round((darkPixels / totalPixels) * 100)

  const gridTypes = ['Ровная', 'Асимметричная', 'Свободная']
  const gridType = gridTypes[Math.floor(Math.random() * gridTypes.length)]

  return {
    gridType,
    whitespacePercent,
    darkPercent,
    complexity: Math.round((100 - whitespacePercent) / 2)
  }
}

export function mockColorDescription(colors) {
  const colorNames = {
    '#000000': 'Чёрный',
    '#FFFFFF': 'Белый',
    '#0066FF': 'Синий',
    '#FF6600': 'Оранжевый',
    '#00DD00': 'Зелёный',
    '#FF0000': 'Красный',
    '#9900FF': 'Фиолетовый',
    '#FFFF00': 'Жёлтый'
  }

  return colors.palette.slice(0, 3).map(color => {
    for (const [hex, name] of Object.entries(colorNames)) {
      if (hex === color) return name
    }
    return 'Смешанный'
  }).join(', ')
}

export function mockTypography() {
  const fonts = ['Helvetica', 'Georgia', 'Inter', 'Roboto', 'Montserrat']
  const sizes = ['14px', '16px', '18px', '20px']
  const lineHeights = ['1.4', '1.5', '1.6', '1.7']

  return {
    family: fonts[Math.floor(Math.random() * fonts.length)],
    bodySize: sizes[Math.floor(Math.random() * sizes.length)],
    lineHeight: lineHeights[Math.floor(Math.random() * lineHeights.length)]
  }
}

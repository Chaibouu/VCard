export const useUtils = () => {
  const getTitle = (e: string) => {
    return e.toLowerCase().split(' ').join('_')
  }

  const getFullname = (fname: string, lname: string) => {
    return (fname + lname).length ? `${fname ? fname : ''}${lname ? ' ' + lname : ''}` : null
  }

  const hasLightBG = (hex: string) => {
    hex = hex.slice(1)
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
    }
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    const brightness = Math.round(
      (parseInt(r.toString()) * 299 + parseInt(g.toString()) * 587 + parseInt(b.toString()) * 114) / 1000
    )
    return brightness > 125
  }

  const resizeImage = async (type: string, mime: string, index1?: number, index2?: number) => {
    // Implementation for image resizing
    // This would contain the canvas-based image resizing logic
    return new Promise((resolve) => {
      resolve(true)
    })
  }

  return {
    getTitle,
    getFullname,
    hasLightBG,
    resizeImage
  }
}

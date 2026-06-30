export const renderCss = (properties) => {
  const cssObject = {}
  if(properties.width) {
    cssObject.width = properties.width
  } else {
    cssObject.width = '100%'
  }
  if(properties.height) {
    cssObject.height = properties.height
  } else {
    cssObject.minHeight = '200px'
  }
  if(properties.display) {
    Object.assign(cssObject, JSON.parse(properties.display))
  }
  if(properties.backgroundColor) {
    cssObject.backgroundColor = properties.backgroundColor
  }
  if(properties.boxShadow) {
    cssObject.boxShadow = properties.boxShadow
  }
  return cssObject
}

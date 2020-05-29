export function getPath(path) {
  return obj => {
    const [step, ...rest] = path
    if (rest.length > 0) {
      return getPath(rest)(obj[step])
    } else {
      return obj[step]
    }
  }
}

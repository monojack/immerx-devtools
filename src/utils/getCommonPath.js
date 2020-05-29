export function getCommonPath(paths) {
  if (paths.length === 0) return

  const max = Math.min(...paths.map(p => p.length))

  function push(path) {
    const idx = path.length
    const p = paths[0][idx]

    const bool = paths.every(path => {
      return path[idx] === p
    })

    bool && path.push(p)

    if (path.length < max && bool) {
      return push(path)
    } else {
      return path
    }
  }

  return push([])
}

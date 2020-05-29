function safeToString(object) {
  switch (typeof object) {
    case 'string':
      return `'${object}'`
    case 'number':
    case 'boolean':
    case 'undefined':
      return String(object)
    case 'object':
      if (object === null) {
        return 'null'
      }
      if (Array.isArray(object)) {
        return `${object.length > 0 ? '[…]' : '[]'}`
      }
      if (object instanceof Map || object instanceof Set) {
        return `${object.constructor.name}(${object.size})`
      }
      if (
        typeof object.constructor.isBuffer === 'function' &&
        object.constructor.isBuffer(object)
      ) {
        return `Buffer[${object.length}]`
      }
      if (object instanceof Date || object instanceof RegExp) {
        return object.toString()
      }
      return `${Object.keys(object).length > 0 ? '{…}' : '{}'}`
    case 'function':
      return `ƒ ${object.name ?? object.displayName ?? 'anonymous'}()`
    case 'bigint':
      return String(object) + 'n'
    case 'symbol':
    default:
      return object.toString()
  }
}

export function buildPreviewString(
  data,
  maxPropertiesCount = 3,
  maxStringLength = 10,
  ellipsis = `, …`,
) {
  if (data == null || typeof data !== 'object') {
    return safeToString(data)
  }

  const isArray = Array.isArray(data)
  const [start, end] = isArray ? ['[ ', ' ]'] : ['{ ', ' }']

  return (
    start +
    Object.entries(data)
      .slice(0, maxPropertiesCount)
      .reduce((acc, [k, v]) => {
        if (typeof v === 'string') {
          const truncated =
            v.length > maxStringLength + 3 ? v.slice(0, maxStringLength) : v
          if (truncated.length < v.length) {
            v = `${truncated}${'…'}`
          }
        }

        acc.push(isArray ? safeToString(v) : `${k}: ${safeToString(v)}`)
        return acc
      }, [])
      .join(', ')
      .concat(Object.keys(data).length > maxPropertiesCount ? ellipsis : '')
      .concat(end)
  )
}

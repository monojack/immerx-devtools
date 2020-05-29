export function objOf(path) {
  return data => {
    let obj = data

    for (const step of [...path].reverse()) {
      obj =
        typeof step === 'number'
          ? (() => {
              const arr = []
              arr[step] = obj
              return arr
            })()
          : {
              [step]: obj,
            }
    }

    return obj
  }
}

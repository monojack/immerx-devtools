function checkForHook(_window) {
  const hook = _window.__IMMERX_DEVTOOLS_HOOK__
  hook && (hook.enabled = true)
  return hook
}

export function createDevToolsMiddleware(options) {
  const defaultOptions = {}

  const opts =
    options !== null && typeof options === 'object'
      ? { ...defaultOptions, ...options }
      : defaultOptions

  let _state$

  const middleware = state$ => {
    if (_state$) {
      if (process.env.NODE_ENV !== 'production') {
        throw new Error(`The middleware is already initialized`)
      } else {
        console.error(`The middleware is already initialized`)
      }
    }

    let _hook = checkForHook(window)
    _state$ = state$
    const init = state$.value
    _hook && _hook.emit([init])
    const buffer = [init]

    return ({ patches }, state) => {
      if (!!opts.ignoreEmptyPatches && patches.length === 0) return
      buffer.push([state, { patches }])

      if (!_hook) {
        _hook = checkForHook(window)
        if (_hook) {
          for (const e of buffer) {
            _hook.emit(...e)
          }
        }
      } else {
        _hook.emit([state, { patches }])
      }
    }
  }

  return middleware
}

export default createDevToolsMiddleware

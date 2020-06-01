/** INLINE */

let loaded = false
let sink = null

function renderUMD(window) {
  function _tryRender() {
    if (window.ImmerxDevTools) {
      window.ImmerxDevTools.render(
        document.getElementById('immerx-devtools-root'),
      )
    } else {
      setTimeout(() => {
        _tryRender()
      }, 100)
    }
  }
  _tryRender()
}

function loadIframe(target) {
  loaded = true

  const iframe = document.createElement('iframe')
  iframe.setAttribute(
    'style',
    'position:absolute;top:0;left:0;width:100%;height:100%',
  )
  target.appendChild(iframe)

  const doc = iframe.contentDocument

  doc.head.innerHTML = `
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    `

  doc.title = 'Immerx DevTools'
  doc.body.innerHTML = `
    <div id="immerx-devtools-root"></div>
  `

  const script = doc.createElement('script')
  script.src =
    'https://unpkg.com/@immerx/devtools@latest/umd/immerx-devtools.min.js'
  doc.body.appendChild(script)

  const renderScript = doc.createElement('script')
  renderScript.textContent = `;(${renderUMD.toString()})(window)`
  doc.body.appendChild(renderScript)
  renderScript.parentNode.removeChild(renderScript)

  return iframe
}

function createSink() {
  sink = {
    listener: null,
    buffer: [],
    subscribe(listener) {
      this.listener = listener

      for (const entry of this.buffer) {
        listener.next(...entry)
      }

      return {
        unsubscribe: () => {
          this.listener = null
          this.buffer.length = 0
        },
      }
    },
    reset() {
      this.listener.reset()
    },
    next(...args) {
      if (this.listener) {
        this.listener.next(...args)
        this.buffer.length = 0
      } else {
        this.buffer.push(args)
      }
    },
  }

  return sink
}

export function createDevToolsInline(target) {
  if (!loaded) {
    const sink = createSink()
    const iframe = loadIframe(target)
    iframe.contentWindow.state$ = sink
  }

  function destroy() {
    target.innerHTML = ''
    loaded = false
    sink = null
  }

  return [{ sink }, destroy]
}

/** MIDDLEWARE */

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

    if (opts.inline) {
      const [{ sink }] = createDevToolsInline(opts.inline)
      _state$.subscribe(sink)
    }

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

function installHook(window) {
  const hook = {
    enabled: false,
    emit(payload) {
      window.postMessage({ source: '@@ImmerxDevTools', payload }, '*')
    },
  }

  Object.defineProperty(window, '__IMMERX_DEVTOOLS_HOOK__', {
    get() {
      return hook
    },
  })
}

if (document instanceof HTMLDocument) {
  const script = document.createElement('script')
  script.textContent = `;(${installHook.toString()})(window)`
  document.documentElement.appendChild(script)
  script.parentNode.removeChild(script)
}

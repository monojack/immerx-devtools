let maxTries = 0

function createPanel() {
  chrome.devtools.inspectedWindow.eval(
    `!!(window.__IMMERX_DEVTOOLS_HOOK__ && window.__IMMERX_DEVTOOLS_HOOK__.enabled);`,
    function(result, isException) {
      // maybe do something wth the error here
      if (isException) console.warn('Got an exception:', isException)

      if (!result && maxTries <= 60) {
        maxTries++
        return setTimeout(createPanel, 1000)
      }

      chrome.devtools.panels.create(
        'Immerx DevTools',
        './icons/logo-64-white.png',
        'panel.html',
        () => {},
      )
    },
  )
}

chrome.devtools.network.onNavigated.addListener(createPanel)
createPanel()

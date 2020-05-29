const ports = {}

setInterval(() => {
  console.log(
    Object.keys(ports).reduce((acc, x) => {
      acc += `${x}: ${Object.keys(ports[x])}`
      return acc
    }, ''),
  )
}, 5000)

chrome.runtime.onConnect.addListener(port => {
  const isTab = isTabPort(port)
  const tabId = isTab ? port.sender.tab.id : port.name
  console.log('isTab', isTab, tabId)

  ports[tabId] = ports[tabId] || {}

  if (isTab) {
    ports[tabId].tab = port
    ports[tabId].onPanelConnect = createChannel(tabId)
  } else {
    ports[tabId].panel = port
    if (ports[tabId].onPanelConnect) {
      ports[tabId].onPanelConnect(port)
    } else {
      // TODO: need to handle this case
    }
  }
})

function isTabPort(port) {
  return port.sender.tab != null
}

function createChannel(tabId) {
  const cache = []
  let { tab, panel } = ports[tabId]

  if (panel) {
    // if panel port is already connected
    onPanelConnect(panel)
  }

  tab.onDisconnect.addListener(destroyChannel)
  tab.onMessage.addListener(handleMessage)

  function handleMessage(payload) {
    cache.push(payload)
    panel && panel.postMessage(payload)
  }

  function destroyChannel() {
    console.log('destroyChannel -> destroyChannel')

    tab.onMessage.removeListener(handleMessage)
    tab.disconnect()
    panel && panel.disconnect()

    delete ports[tabId]
  }

  function onPanelConnect(port) {
    panel = port
    port.onDisconnect.addListener(() => {
      panel = null
      delete ports[tabId].panel
    })
    cache.forEach(payload => port.postMessage(payload))
  }

  return onPanelConnect
}

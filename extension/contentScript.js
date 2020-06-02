const port = chrome.runtime.connect({ name: 'contentScript' })

function sendMessage(event) {
  if (
    event.source === window &&
    event.data.source &&
    event.data.source == '@@ImmerxDevTools'
  ) {
    port.postMessage(event.data.payload)
  }
}

function handleDisconnect() {
  window.removeEventListener('message', sendMessage)
}

window.addEventListener('message', sendMessage)
port.onDisconnect.addListener(handleDisconnect)

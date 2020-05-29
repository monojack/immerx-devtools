import React from 'react'
import ReactDOM from 'react-dom'
import { ImmerxDevTools } from '../src/ImmerxDevTools'

const state$ = {
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

ReactDOM.render(
  <ImmerxDevTools state$={state$} />,
  document.getElementById('root'),
)

function handleMessage(message) {
  console.log('handleMessage -> message', message)
  state$ && state$.next(...message)
}

function connect() {
  // Listen to messages from the background page
  const port = chrome.extension.connect({
    name: `${chrome.devtools.inspectedWindow.tabId}`,
  })

  port.onMessage.addListener(handleMessage)
  port.onDisconnect.addListener(() => {
    state$.reset()
    port.onMessage.removeListener(handleMessage)
    connect()
  })
}

connect()

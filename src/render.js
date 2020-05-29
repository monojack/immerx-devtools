import React from 'react'
import ReactDOM from 'react-dom'
import { ImmerxDevTools } from './ImmerxDevTools'

export function render(target) {
  const state$ = window.state$
  if (state$ == null) {
    throw new Error('[ImmerxDevTools]: no `state$` provided')
  } else {
    ReactDOM.render(<ImmerxDevTools state$={state$} />, target)
  }
}

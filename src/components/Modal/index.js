/* eslint-disable react/jsx-indent */
import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import cn from 'classnames'

import styles from './styles.module.scss'

const container = document.createElement('div')
container.id = styles.devtoolsContainer

function Modal(props) {
  const [isContainerInDOM, setIsContainerInDOM] = useState(false)
  const [show, toggle] = useState(false)

  useEffect(() => {
    document.body.appendChild(container)
    setIsContainerInDOM(true)

    return () => {
      document.body.removeChild(container)
      setIsContainerInDOM(false)
    }
  }, [])

  useEffect(() => {
    function toggleDevtools({ metaKey, shiftKey, ctrlKey, keyCode }) {
      if ((metaKey || ctrlKey) && shiftKey && keyCode === 76) {
        toggle(show => !show)
      }
    }

    window.addEventListener('keydown', toggleDevtools)

    return () => window.removeEventListener('keydown', toggleDevtools)
  }, [])

  return isContainerInDOM
    ? createPortal(
        <div className={cn(styles.devtools, { [styles.show]: show })}>
          {props.children}
        </div>,
        container,
      )
    : null
}

export default Modal

import React from 'react'
import cn from 'classnames'

import styles from './styles.module.scss'

export function Header({ setActiveView, activeView }) {
  return (
    <header className={styles.header}>
      <button
        className={cn(styles.headerButton, {
          [styles.active]: activeView === 'PATCHES',
        })}
        onClick={() => setActiveView('PATCHES')}
      >
        Patches
      </button>
      <button
        className={cn(styles.headerButton, {
          [styles.active]: activeView === 'STATE',
        })}
        onClick={() => setActiveView('STATE')}
      >
        State
      </button>
      <button
        className={cn(styles.headerButton, {
          [styles.active]: activeView === 'DIFF',
        })}
        onClick={() => setActiveView('DIFF')}
      >
        Diff
      </button>
    </header>
  )
}

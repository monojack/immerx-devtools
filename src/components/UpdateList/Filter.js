import React, { useEffect, useState } from 'react'
import cn from 'classnames'

import styles from './styles.module.scss'

export function Filter({ onFilterChange }) {
  const [ops, setOps] = useState({ add: true, replace: true, remove: true })
  const [path, setPath] = useState('')
  const [value, setValue] = useState('')

  const onToggleOp = op => () => {
    setOps(ops => ({ ...ops, [op]: !ops[op] }))
  }

  useEffect(() => {
    const t = setTimeout(() => {
      setPath(value)
    }, 500)

    return () => clearTimeout(t)
  }, [value])

  useEffect(() => {
    onFilterChange({ ops, path })
  }, [ops, path])

  return (
    <div className={styles.updatesFilter}>
      <button
        className={cn(styles.opToggle, ops.add && styles.selected)}
        onClick={onToggleOp('add')}
      >
        Add
      </button>
      <button
        className={cn(styles.opToggle, ops.replace && styles.selected)}
        onClick={onToggleOp('replace')}
      >
        Replace
      </button>
      <button
        className={cn(styles.opToggle, ops.remove && styles.selected)}
        onClick={onToggleOp('remove')}
      >
        Remove
      </button>
      <input
        className={styles.pathInput}
        placeholder="filter..."
        onChange={({ target: { value } }) => setValue(value)}
      />
    </div>
  )
}

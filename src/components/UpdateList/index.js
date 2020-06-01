import React, { useState, useMemo } from 'react'
import cn from 'classnames'

import styles from './styles.module.scss'
import { Filter } from './Filter'

export function UpdateList({
  updates = [],
  active,
  onUpdateClick = () => {},
  className,
  ...props
}) {
  const [{ ops, path }, setFilter] = useState({})

  const visibleUpdates = useMemo(() => {
    return updates.filter(update => {
      if (!path.trim() && ops.add && ops.replace && ops.remove) {
        return true
      }

      const { patches = [] } = update

      return (
        patches.length > 0 &&
        patches.some(patch => {
          return ops[patch.op] && RegExp(`^${path}`).test(patch.path.join('.'))
        })
      )
    })
  }, [updates, ops, path])

  return (
    <nav className={cn(styles.nav, className)} {...props}>
      <Filter onFilterChange={setFilter} />
      <ul className={cn(styles.updateList)}>
        {visibleUpdates.map((update = {}) => (
          <li
            key={update._id}
            className={cn(styles.update, {
              [styles.active]: active === update,
            })}
            onClick={() => onUpdateClick(update)}
          >
            <span className={styles.indicator} />
            <div className={styles.patchOp}>
              {update.ops.join(' | ').toUpperCase() || <em>EMPTY!</em>}
            </div>
            <div className={styles.patchPath}>
              {(update.commonPath || []).join('.') ||
                (update.ops.length > 0 ? '#' : '')}
            </div>
          </li>
        ))}
      </ul>
    </nav>
  )
}

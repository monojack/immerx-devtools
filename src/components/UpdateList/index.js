import React from 'react'
import cn from 'classnames'

import styles from './styles.module.scss'

export function UpdateList({
  updates = [],
  active,
  onUpdateClick = () => {},
  ...props
}) {
  return (
    <ul className={cn(styles.updateList)}>
      {updates.map((update = {}) => (
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
  )
}

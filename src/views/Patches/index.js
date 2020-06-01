import React, { useState, useEffect } from 'react'
import cn from 'classnames'
import { defaultStyles } from 'react-object-view'

import { DiffView } from '../Diff'
import styles from './styles.module.scss'

export function PatchesView({ update, patches, className }) {
  const [selected, toggle] = useState(0)

  useEffect(() => {
    toggle(0)
  }, [patches])

  return (
    <section key="patchesView" className={cn(styles.view, className)}>
      {!!patches && (
        <ul className={styles.patchList}>
          {patches.map((patch, i) => (
            <li
              className={cn(styles.patch, selected === i && styles.selected)}
              key={i}
              onClick={() => toggle(i)}
            >
              <span className={styles.op}>{patch.op}</span>
              <span className={styles.path}>
                {patch.path.join(', ') || '#'}
              </span>
            </li>
          ))}
        </ul>
      )}
      {selected != null && update != null ? (
        <DiffView update={{ ...update, patches: [patches[selected]] }} />
      ) : (
        <span style={{ color: defaultStyles.color }}>(Nothing selected)</span>
      )}
    </section>
  )
}

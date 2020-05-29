import React, { useState, useEffect } from 'react'
import cn from 'classnames'
import { ObjectView, customEntry } from 'react-object-view'

import styles from './styles.module.scss'

const options = {
  displayEntriesMaxCount: 20,
}

const nothingSelected = {
  undefined: customEntry(() => <span>(Nothing selected)</span>),
}

export function PatchesView({ patches, className }) {
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
                [&nbsp;{patch.path.join(', ')}&nbsp;]
              </span>
            </li>
          ))}
        </ul>
      )}
      {selected != null && (
        <div>
          <ObjectView
            key="patchData"
            data={patches ? patches[selected]?.value : nothingSelected}
            options={options}
          />
        </div>
      )}
    </section>
  )
}

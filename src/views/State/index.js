import React from 'react'
import cn from 'classnames'
import { ObjectView } from 'react-object-view'

import styles from './styles.module.scss'

export function StateView({ data, className }) {
  return (
    <section key="stateView" className={cn(className, styles.view)}>
      <ObjectView key="stateData" data={data} />
    </section>
  )
}

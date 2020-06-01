import React, { memo, useMemo } from 'react'
import cn from 'classnames'
import { ObjectView, customEntry } from 'react-object-view'
import { diff as getDiff } from '@immerx/patchdiff'

import { format } from './formatter'

import styles from './styles.module.scss'

const options = {
  hideObjectSize: true,
  expandLevel: 1,
}

export const DiffView = memo(function DiffView({ update, className }) {
  const diff = useMemo(() => {
    if (update == null || !update.patches || update.patches.length === 0) {
      return { '*': customEntry(() => <span>(States are equal)</span>) }
    }

    const d = getDiff(update.patches)(update.state.prev)
    return format(d)
  }, [update])

  return (
    <section key="diffView" className={cn(className, styles.view)}>
      <ObjectView key="diffData" data={diff} options={options} />
    </section>
  )
})

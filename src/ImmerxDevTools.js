import React, { useEffect, useState, useCallback } from 'react'
import { defaultStyles } from 'react-object-view'

import { getCommonPath } from './utils/getCommonPath'

import { UpdateList } from './components/UpdateList'
import { Header } from './components/Header'
import { StateView } from './views/State'
import { DiffView } from './views/Diff'
import { PatchesView } from './views/Patches'

import styles from './styles.module.scss'

function getId() {
  try {
    return window.crypto.getRandomValues(new Uint32Array(1))[0]
  } catch (error) {
    return Date.now()
  }
}

export function ImmerxDevTools({ state$ }) {
  const [allUpdates, addUpdate] = useState([])
  const [state, setState] = useState({})

  const [active, setActive] = useState()
  const [activeView, setActiveView] = useState('DIFF')

  const toggleActiveUpdate = useCallback(function toggleActiveUpdate(update) {
    setActive(active => {
      return active === update ? null : update
    })
  }, [])

  useEffect(() => {
    const sub = state$.subscribe({
      reset: () => {
        addUpdate([])
        setActive(null)
        setState({})
      },
      next: (currState, { patches, inversePatches } = {}) => {
        if (patches) {
          const paths = patches.map(p => p.path)
          const ops = patches.map(p => p.op)

          addUpdate(p => [
            ...p,
            {
              _id: getId(),
              commonPath: getCommonPath(paths),
              state: {
                prev: p[p.length - 1]?.state?.curr,
                curr: currState,
              },
              ops: [...new Set(ops)],
              patches,
            },
          ])
        } else {
          addUpdate([
            {
              _id: getId(),
              commonPath: ['#'],
              state: { curr: currState },
              ops: ['INIT'],
              patches: [
                {
                  op: 'add',
                  path: [],
                  value: currState,
                },
              ],
            },
          ])
        }

        setState(({ curr }) => ({
          prev: curr,
          curr: currState,
        }))
      },
    })

    return () => sub.unsubscribe()
  }, [])

  return (
    <div style={{ ...defaultStyles, display: 'flex', height: '100%' }}>
        <UpdateList
        className={styles.updateList}
          updates={allUpdates}
          active={active}
          onUpdateClick={toggleActiveUpdate}
        />
      <main className={styles.patchView}>
        <Header {...{ setActiveView, activeView }} />
        {activeView === 'STATE' ? (
          <StateView
            className={styles.view}
            data={active?.state?.curr ?? state.curr}
          />
        ) : activeView === 'DIFF' ? (
          <DiffView
            className={styles.view}
            left={active?.state?.prev}
            right={active?.state?.curr}
            update={active}
          />
        ) : activeView === 'PATCHES' ? (
          <PatchesView
            className={styles.view}
            update={active}
            patches={active?.patches}
          />
        ) : null}
      </main>
    </div>
  )
}

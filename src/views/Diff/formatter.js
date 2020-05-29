import React from 'react'
import { customValue, customEntry } from 'react-object-view'
import { isDiff } from '@immerx/patchdiff'

import { buildPreviewString } from './buildPreviewString'

const removeColor = 'rgba(255, 92, 92, 0.4)'
const addColor = 'rgba(101, 198, 89, 0.4)'
const commonStyle = {
  padding: '2px 4px',
  borderRadius: 5,
  color: '#fff',
}

const addStyle = {
  ...commonStyle,
  backgroundColor: addColor,
  textDecoration: 'none',
}
const removeStyle = {
  ...commonStyle,
  backgroundColor: removeColor,
  textDecoration: 'line-through',
}

const arrowStyle = {
  padding: '2px 4px',
  flex: 'none',
  fontWeight: 'bolder',
  color: removeColor,
}

export function getValueDiffDom(value) {
  const isAdd = value.length === 1
  const isReplace = !isAdd && value.length === 2
  const isRemove = value.length === 3 && value[1] === 0 && value[2] === 0

  return isAdd ? (
    <ins style={addStyle}>{buildPreviewString(value[0])}</ins>
  ) : isReplace ? (
    <span>
      <del style={removeStyle}>{buildPreviewString(value[0])}</del>
      &nbsp;
      <span style={arrowStyle}>=></span>
      &nbsp;
      <ins style={addStyle}>{buildPreviewString(value[1])}</ins>
    </span>
  ) : isRemove ? (
    <del style={removeStyle}>{buildPreviewString(value[0])}</del>
  ) : null
}

export function format(d) {
  if (d == null) {
    return { '*': customEntry(() => <span>(States are equal)</span>) }
  }

  if (isDiff(d)) {
    return { '*': customEntry(() => <span>{getValueDiffDom(d)}</span>) }
  }

  const seed = Array.isArray(d) ? [] : {}
  return Object.entries(d).reduce((acc, [k, v]) => {
    acc[k] = isDiff(v) ? customValue(() => getValueDiffDom(v)) : format(v)
    return acc
  }, seed)
}

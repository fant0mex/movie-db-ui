import React from 'react'
import ms from 'modularscale-js'
import { StyleSheet, css } from 'aphrodite/no-important'

const config = {
  base: [16],
  ratio: 1.125
}

const scale = (n, config) => {
  return Math.floor(ms(n, config)) / 16
}

const fontSize = {
  h1: scale(9, config),
  h2: scale(5, config),
  h3: scale(2, config),
  h4: scale(3, config),
  body: scale(2, config)
}

const RegularGTWalsheim = {
  fontFamily: 'gt-walsheim-regular',
  src: `url('src/assets/fonts/gt-walsheim-regular.ttf') format('truetype')`
}

const BoldGTWalsheim = {
  fontFamily: 'gt-walsheim-bold',
  src: `url('src/assets/fonts/gt-walsheim-bold.ttf') format('truetype')`
}

const LightGTWalsheim = {
  fontFamily: 'gt-walsheim-light',
  src: `url('src/assets/fonts/gt-walsheim-light.ttf') format('truetype')`
}

const typographyStyles = {
  h1: {
    fontFamily: BoldGTWalsheim,
    fontSize: `${fontSize.h1}em`,
    lineHeight: 1.175,
    color: '#fff',
    marginBottom: '0.3625em'
  },
  h2: {
    fontFamily: LightGTWalsheim,
    fontSize: `${fontSize.h2}em`,
    lineHeight: 1.175,
    color: '#05aec2',
    marginBottom: '1em'
  },
  h3: {
    fontFamily: LightGTWalsheim,
    fontSize: `${fontSize.h3}em`,
    lineHeight: 1.175,
    color: '#05aec2',
    marginBottom: '0.3625em'
  },
  h4: {
    fontFamily: RegularGTWalsheim,
    fontSize: `${fontSize.h4}em`,
    lineHeight: 1.175,
    color: '#fff'
  },
  body: {
    fontFamily: LightGTWalsheim,
    fontSize: `${fontSize.body}em`,
    lineHeight: 1.5,
    color: '#fff'
  }
}

export function H1 (props) {
  const classNames = css(styles.h1)
  return (
    <h1 className={classNames}>{props.children}</h1>
  )
}

export function H2 (props) {
  const classNames = css(styles.h2)
  return (
    <h2 className={classNames}>{props.children}</h2>
  )
}

export function H3 (props) {
  const classNames = css(styles.h3, props.white && styles.white)
  return (
    <h3 className={classNames}>{props.children}</h3>
  )
}

export function H4 (props) {
  const classNames = css(styles.h4, props.inline && styles.inline)
  return (
    <h4 className={classNames}>{props.children}</h4>
  )
}

export function Body (props) {
  const classNames = css(styles.body,
    props.white && styles.white,
    props.bold && styles.bold)
  return (
    <div className={classNames}>{props.children}</div>
  )
}

const styles = StyleSheet.create(typographyStyles)

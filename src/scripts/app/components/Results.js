import React from 'react'
import { StyleSheet, css } from 'aphrodite/no-important'
import { Body } from 'app/widgets/typography'

const Results = props => (
  <div className={css(styles.results)} onKeyDown={props.onKeyDown}>
    {props.data.map((item, i) => (
      <div
        key={i}
        className={css(styles.result, props.cursor === i && styles.cursor)}
        onClick={() => { props.handleSelect(item) }}>
        <Body>{item.name || item.original_title}</Body>
      </div>
    ))}
  </div>
)

export default Results

const styles = StyleSheet.create({
  results: {
    position: 'absolute',
    overflow: 'scroll',
    top: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    width: '100%',
    height: '100%',
    borderRadius: '0.4em',
    padding: '2em 0'
  },
  result: {
    cursor: 'pointer',
    padding: '1em 2em',
    transition: 'background .4s ease',
    ':hover': {
      background: '#05aec2'
    }
  },
  cursor: {
    background: '#05aec2'
  }
})

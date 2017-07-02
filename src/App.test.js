/* global describe, it, expect, beforeAll, beforeEach, afterEach */
import React from 'react'
import { shallow } from 'enzyme'
import App from 'app/App'
import { StyleSheetTestUtils } from 'aphrodite/no-important'

describe('App', () => {
  let wrapper
  let selected = {
    backdrop_path: '/tQkigP2fItdzJWvtIhBvHxgs5yE.jpg',
    first_air_date: '2005-03-26',
    name: 'Doctor Who',
    overview: `The Doctor looks and seems human. He's handsome, witty, and could be mistaken for just another man in the street. But he is a Time Lord: a 900 year old alien with 2 hearts, part of a gifted civilization who mastered time travel. The Doctor saves planets for a living – more of a hobby actually, and he's very, very good at it. He's saved us from alien menaces and evil from before time began – but just who is he?`,
    popularity: 50.426356,
    poster_path: '/cFcZYgPRFZdBkA7EsxHz5Cb8x5.jpg',
    vote_average: 6.93,
    vote_count: 798
  }

  beforeAll(() => {
    wrapper = shallow(<App />)
    wrapper.setState({
      category: 'movie',
      selected: selected,
      watchList: []
    })
  })

  beforeEach(() => {
    StyleSheetTestUtils.suppressStyleInjection()
  })

  it('should render without exploding', () => {
    const app = wrapper.find(`[data-test='app']`)
    expect(app.length).toEqual(1)
  })

  it('should show an addButton', () => {
    const addButton = wrapper.find(`[data-test='addButton']`)
    expect(addButton.length).toEqual(1)
  })

  it('addButton should add items to the watchlist', () => {
    const addButton = wrapper.find(`[data-test='addButton']`)
    addButton.simulate('click')
    console.log('state ', wrapper.instance().state.watchList.length)
    expect(wrapper.instance().state.watchList.length).toEqual(1)
  })

  afterEach(() => {
    StyleSheetTestUtils.clearBufferAndResumeStyleInjection()
  })
})

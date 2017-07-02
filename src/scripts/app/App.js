import React, { Component } from 'react'
import { StyleSheet, css } from 'aphrodite/no-important'
import styleVars from 'styles/variables'
import { H1, H2, H3, H4, Body } from 'app/widgets/typography'
import { checkStatus, getJSON } from 'lib/parseFetch'
import { debounce, isUndefined } from 'lodash'
import Results from 'app/components/Results'

class App extends Component {
  state = {
    category: 'tv',
    results: [],
    selected: null,
    cursor: 0,
    watchList: [],
    showWatchList: false
  }

  componentDidMount () {
    this.findPopularResults()
  }

  findPopularResults = () => {
    const { category } = this.state
    window.fetch(`https://api.themoviedb.org/3/${category}/popular?api_key=6f4d5793cea5f169c09ae713115f3dcc&language=en-US&page=1`)
      .then(checkStatus)
      .then(getJSON)
      .then(data => {
        const topResult = data.results[0]
        this.setState({
          selected: topResult
        })
      })
      .catch(err => {
        console.log('ERROR ', err)
      })
  }

  searchOnServer = search => {
    const { category } = this.state
    window.fetch(`https://api.themoviedb.org/3/search/${category}?query=${search}&api_key=6f4d5793cea5f169c09ae713115f3dcc&language=en-US&page=1`)
      .then(checkStatus)
      .then(getJSON)
      .then(data => {
        const results = data.results
        this.setState({
          results: results
        })
      })
      .catch(err => {
        console.log('ERROR ', err)
      })
  }

  handleChange = event => {
    const search = this.search.value
    if (search.length < 2) {
      this.setState({
        results: [],
        cursor: 0
      })
      return
    }
    this.searchOnServer(search)
  }

  handleSelect = item => {
    const category = isUndefined(item.name) ? 'movie' : 'tv'
    window.fetch(`https://api.themoviedb.org/3/${category}/${item.id}?&api_key=6f4d5793cea5f169c09ae713115f3dcc`)
      .then(checkStatus)
      .then(getJSON)
      .then(data => {
        const selected = data
        this.setState({
          selected: selected,
          results: [],
          cursor: 0,
          showWatchList: false
        })
      })
      .catch(err => {
        console.log('ERROR ', err)
      })
  }

  setCategory = category => {
    if (this.state.category === category) return
    this.search.value = ''
    this.setState(prevState => ({
      category: category,
      selected: null
    }), () => {
      this.findPopularResults()
    })
  }

  handleKeyDown = event => {
    const { cursor, results, showWatchList } = this.state
    if (showWatchList) {
      this.setState({
        showWatchList: !showWatchList
      })
    }
    if (event.keyCode === 38 && cursor > 0) {
      this.setState(prevState => ({
        cursor: prevState.cursor - 1
      }))
    } else if (event.keyCode === 40 && cursor < results.length - 1) {
      this.setState(prevState => ({
        cursor: prevState.cursor + 1
      }))
    } else if (event.keyCode === 13) {
      this.handleSelect(results[cursor])
    }
  }

  addToWatchList = title => {
    const { watchList } = this.state
    const newStateArray = watchList.concat(title)
    this.setState({
      watchList: newStateArray
    })
  }

  removeFromWatchList = title => {
    const { watchList } = this.state
    const newStateArray = watchList.filter(item => item.id !== title.id)
    this.setState({
      watchList: newStateArray
    })
  }

  toggleView = () => {
    const { watchList } = this.state
    if (watchList.length < 1) return
    this.setState(prevState => ({
      showWatchList: !prevState.showWatchList
    }))
  }

  render () {
    const {
      category,
      results,
      selected,
      cursor,
      watchList,
      showWatchList
    } = this.state

    const isChecked = selected && watchList.filter(item => item.id === selected.id)

    return (
      <div>
        {selected &&
          <div className={css(styles.wrapper)} style={{backgroundImage: `url(https://image.tmdb.org/t/p/original/${selected.backdrop_path})`}}>
            <div className={css(styles.overlay)}>
              <div className='container'>
                <div className={css(styles.container)}>
                  <div className={css(styles.inputWrapper)}>
                    <div>
                      <input type='text'
                        className={css(styles.input)}
                        ref={node => (this.search = node)}
                        placeholder={category === 'tv' ? 'Search for a TV Show' : 'Search for a Movie'}
                        onChange={debounce(this.handleChange, 500)}
                        onKeyDown={this.handleKeyDown}
                        id='search'
                        name='search' />
                    </div>
                    <div className={css(styles.toggleWrapper)}>
                      <div className={css(styles.category, styles.selected)} onClick={this.toggleView}>
                        <H4>Watch List ({watchList.length})</H4>
                      </div>
                      <div className={css(styles.category, category === 'tv' && styles.selected)} onClick={() => { this.setCategory('tv') }}>
                        <H1>TV</H1>
                      </div>
                      <div className={css(styles.category, category === 'movie' && styles.selected)} onClick={() => { this.setCategory('movie') }}>
                        <H1>Movies</H1>
                      </div>
                    </div>
                  </div>
                  <div className={css(styles.panelWrapper)}>
                    {results.length > 0 &&
                      <Results data={results} cursor={cursor} handleSelect={this.handleSelect} onKeyDown={this.handleKeyDown} />
                    }
                    {watchList.length > 0 && showWatchList &&
                      <Results data={watchList} cursor={cursor} handleSelect={this.handleSelect} onKeyDown={this.handleKeyDown} />
                    }
                    <div className={css(styles.panelLeft)}>
                      <div className={css(styles.header)}>
                        <H1>{selected.name || selected.original_title}</H1>
                        {isChecked && isChecked.length < 1 ? (
                          <div className={css(styles.cta)} onClick={() => { this.addToWatchList(selected) }}>
                            <H3>Add to Watch List</H3>
                          </div>
                        ) : (
                          <div className={css(styles.cta)} onClick={() => { this.removeFromWatchList(selected) }}>
                            <H3>Remove from Watch List</H3>
                          </div>
                        )}
                      </div>
                      {selected.tagline &&
                        <H2>{selected.tagline}</H2>
                      }
                      <Body>{selected.overview}</Body>
                      <section className={css(styles.info)}>
                        <div>
                          <H3>Release Date</H3>
                          {category === 'tv' ? (
                            <H4>{selected.first_air_date}</H4>
                          ) : (
                            <H4>{selected.release_date}</H4>
                          )}
                        </div>
                        <div>
                          <H3>Viewer Rating</H3>
                          <H4>{Math.round(selected.vote_average)} / 10</H4>
                        </div>
                      </section>
                    </div>
                    <div className={css(styles.panelRight)}>
                      <img src={`https://image.tmdb.org/t/p/original/${selected.poster_path}`} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}

export default App

const styles = StyleSheet.create({
  wrapper: {
    height: '100%',
    width: '100vw',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    [styleVars.media.md]: {
      height: '100vh'
    }
  },
  overlay: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(rgba(0, 0, 0, 0.7) 15%,rgba(0, 0, 0 , 0.2) 40%, #000 90%)'
  },
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: '0 auto',
    padding: '2em 0',
    [styleVars.media.md]: {
      padding: 0
    }
  },
  panelWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    [styleVars.media.md]: {
      flexDirection: 'row'
    }
  },
  panelLeft: {
    flex: '1 1 60%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: '3em',
    borderRadius: '0.4em 0.4em 0 0',
    [styleVars.media.md]: {
      borderRadius: '0.4em 0 0 0.4em '
    }
  },
  panelRight: {
    flex: '1 1 40%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: '0 0 0.4em 0.4em',
    [styleVars.media.md]: {
      borderRadius: '0 0.4em 0.4em 0'
    },
    ':not(false) > img': {
      width: '100%',
      borderRadius: '0 0 0.4em 0.4em',
      [styleVars.media.md]: {
        borderRadius: '0 0.4em 0.4em 0'
      }
    }
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline'
  },
  cta: {
    cursor: 'pointer'
  },
  info: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '2em 0'
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    textAlign: 'center',
    padding: '2em 0 0',
    [styleVars.media.sm]: {
      flexDirection: 'row',
      textAlign: 'left',
      padding: '0'
    }
  },
  input: {
    background: 'transparent',
    border: 'none',
    userSelect: 'none',
    outline: '0',
    borderBottom: '1px solid #FFF',
    color: '#fff',
    fontSize: '1.75em',
    fontFamily: 'gt-walsheim-light',
    maxWidth: '100%',
    '::placeholder': {
      color: '#fff'
    }
  },
  toggleWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: '1em',
    alignItems: 'baseline',
    [styleVars.media.sm]: {
      paddingTop: '0',
      justifyContent: 'space-between'
    }
  },
  category: {
    cursor: 'pointer',
    opacity: 0.4,
    transition: 'opacity .3s ease',
    marginLeft: '2em'
  },
  selected: {
    opacity: 1
  }
})

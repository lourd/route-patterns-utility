import React, { Component } from 'react';

import ptr from 'path-to-regexp'

const styles = {
  title: {
    textAlign: 'center',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // paddingTop: 40,
    fontSize: '1.2em',
    padding: '40px 5px 0px',
  },
  inputRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 8,
    fontSize: 16,
  },
  inputs: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    width: 100,
    margin: '0px 5px',
    border: 'none',
    backgroundColor: 'greenyellow',
    fontSize: 18,
    outline: 'none',
    padding: '3px 5px',
  },
  pre: {
    backgroundColor: '#eee',
    padding: 5,
    flexGrow: 1,
    margin: 0,
  },
  addBtn: {
    width: 80,
    // fontSize: 20,
  },
  options: {
    marginLeft: 20,
  },
  config: {
    display: 'flex',
    marginBottom: 20,
    border: '1px solid #ddd',
    padding: 10,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  row: {
    display: 'flex',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: 600,
  },
  subtitle: {
    fontSize: 20,
    marginTop: 0,
    marginLeft: 10,
    marginBottom: 5,
  },
  testURLBox: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 16,
    flexGrow: 1,
    flexWrap: 'wrap',
    marginTop: 5,
    marginBottom: 20,
  },
  testURLInput: {
    flexGrow: 1,
    border: 'none',
    backgroundColor: 'greenyellow',
    fontSize: 18,
    outline: 'none',
    padding: '3px 5px',
    margin: 0,
  },
  expression: {
    backgroundColor: '#eee',
    padding: 5,
    flexGrow: 1,
    overflowX: 'scroll',
    margin: 0,
  },
  delimInput: {
    flexGrow: 1,
    border: 'none',
    backgroundColor: 'greenyellow',
    fontSize: 18,
    outline: 'none',
    padding: '3px 5px',
    margin: '0px 0px 0px 5px',
    maxWidth: 30,
  },
}

export default class App extends Component {
  state = {
    patterns: ['/foo'],
    path: '/foo',
    strict: false,
    end: false,
    delimiter: '/',
    sensitive: false,
  }

  handleChange = ({ target }) => {
    this.setState({
      [target.id]: target.type === 'checkbox' ? target.checked : target.value,
    })
  }

  removePath = index => {
    this.setState({
      patterns: [
        ...this.state.patterns.slice(0, index),
        ...this.state.patterns.slice(index + 1),
      ],
    })
  }

  addPath = () => {
    this.setState({
      patterns: this.state.patterns.concat(''),
    })
  }

  handlePatternChange = (index, value) => {
    this.setState({
      patterns: [
        ...this.state.patterns.slice(0, index),
        value,
        ...this.state.patterns.slice(index + 1),
      ]
    })
  }

  render() {
    const pattern = this.state.patterns.length > 1 ? this.state.patterns : this.state.patterns[0]
    const options = {
      strict: this.state.strict,
      end: this.state.end,
      sensitive: this.state.sensitive,
      delimiter: this.state.delimiter,
    }
    const keys = []
    const re = ptr(pattern, keys, options)
    const match = re.exec(this.state.path, {
      end: this.state.end,
      strict: this.state.strict,
    })
    let url
    let params
    let values
    if (match) {
      [url, ...values] = match
      params = keys.reduce((memo, key, index) => {
        memo[key.name] = values[index]
        return memo
      }, {})
    }
    const moreThanOne = this.state.patterns.length > 1
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>
          Route Patterns Utility
        </h1>
        <div style={styles.column}>
          <div style={styles.column}>
            <label>Configuration</label>
            <div style={styles.config}>
              <div style={styles.inputs}>
                {/*<input placeholder="Pattern" onChange={this.handleChange} id="pattern" style={styles.input}/>*/}
                {this.state.patterns.map((path, index) => (
                  <div style={styles.inputRow} key={index}>
                    <label>
                      {`Path ${index + 1}`}
                    </label>
                    <input
                      onChange={(evt) => this.handlePatternChange(index, evt.target.value)}
                      style={styles.input}
                      value={path}
                    />
                    <button
                      onClick={() => this.removePath(index)}
                      tabIndex={-1}
                      disabled={!moreThanOne}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={this.addPath}
                  style={styles.addBtn}
                >
                  Add Path
                </button>
              </div>
              <div style={styles.options}>
                <div style={styles.inputRow}>
                  <input
                    type="checkbox"
                    checked={this.state.exact}
                    id="strict"
                    onChange={this.handleChange}
                  />
                  <label htmlFor="strict">Enforce trailing slash</label>
                </div>
                <div style={styles.inputRow}>
                  <input
                    type="checkbox"
                    id="end"
                    checked={this.state.end}
                    onChange={this.handleChange}
                  />
                  <label htmlFor="end">Match from end</label>
                </div>
                <div style={styles.inputRow}>
                  <input
                    type="checkbox"
                    id="sensitive"
                    checked={this.state.sensitive}
                    onChange={this.handleChange}
                  />
                  <label htmlFor="sensitive">Case sensitive</label>
                </div>
                <div style={styles.inputRow}>
                  <label htmlFor="delimiter">Delimiter</label>
                  <input
                    type="text"
                    id="delimiter"
                    value={this.state.delimiter}
                    onChange={this.handleChange}
                    style={styles.delimInput}
                  />
                </div>
              </div>
            </div>
          </div>
          <label htmlFor="path">Test Path</label>
          <div style={styles.testURLBox}>
            <input
              placeholder="/enter/test/path/here"
              onChange={this.handleChange}
              id="path"
              value={this.state.path}
              style={styles.testURLInput}
            />
          </div>
          <label>Output</label>
          <div style={styles.testURLBox}>
            <pre style={styles.pre}>
              {JSON.stringify({
                match: !!match,
                url,
                isExact: match ? url === this.state.path : undefined,
                params,
              }, null, 2)}
            </pre>
          </div>
          <label>Regular Expression Output</label>
          <div style={styles.testURLBox}>
            <pre style={styles.expression}>
              {re.toString()}
            </pre>
          </div>
          <label><a href="https://github.com/pillarjs/path-to-regexp">path-to-regexp</a> arguments</label>
          <div style={styles.testURLBox}>
            <pre style={styles.pre}>
              {JSON.stringify({ pattern, options }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  }
}

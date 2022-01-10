export class Counter {
  selector = "counter"
  
  store = new Store({
    state: {
      count: 0
    },
    mutation: {
      increment: (state) => {
        this.store.setState('count', state.count + 1)
      }
    }
  })
  
  increment = () => {
    this.store.commit('increment')
  }
  
  constructor(props) {
    this.props = props;
  }
  
  render = () => {
    return`
      <h2>{props.text}</h2>
      <button @click="increment">Click here!</button>
    `
  }
  
  style() {
    return {
      content: `
        h2 {
          color: orange;
        }
      `
    }
  }
}

class App {
  selector = 'app'
  
  components = {
    counter: new Counter({
      text: 'You clicked {count} times!'
    })
  }
  
  store = new Store({
    state: {
      input: ''
    },
  })
  
  input = (selector) => {
    const inputValue = document.querySelector(`[${selector}]`).value
    this.store.setState('input', inputValue)
  }
  
  render() {
    return `
      <router-view/>
      <div>
        <h1>Hello {input}!</h2>
        <input placeholder="Your name" @input="input" />
        <br />
        <counter/>
      </div>
    `
  }
  
  style() {
    return {
      lang: 'scss',
      content: `
        h1 {
          color: tomato
        }
      `
    }
  }
}

const fm = new Framework()

fm.render(new App(), document.querySelector("#app"))

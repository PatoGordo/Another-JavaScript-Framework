class Framework {
  frameworkSigle = 'fm'
  components = {}
  availableEvents = ['click', 'input', 'change']
  
  render(component, el) {
    this.renderComponent(component, el)
  }
  
  renderComponent(component, el) {
    const { selector, onInit, render, store } = component
    
    let reactiveTagsSelectors = []
    let eventsSelectors = []
    
    let template = String(render())
    
    const formatTemplate = new Promise((resolve, reject) => {
      Object.keys(store.state).forEach((key) => {
        if(template.includes(`{${key}}`)) {
          const tagSelector = `${this.frameworkSigle}-state-${key}`
          
          template = template
            .replaceAll(`{${key}}`, 
            `<${tagSelector}>
              ${store.state[key]}
            </${tagSelector}>`)
          reactiveTagsSelectors.push({
            selector: tagSelector,
            state: key
          })
        }
        Object.keys(component).forEach((method) => {
          this.availableEvents.forEach((event) => {
            if (template.includes(`@${event}="${method}"`)) {
              const eventSelector = `${this.frameworkSigle}-${selector}-on${event}-${method}`
              
              template = template.replaceAll(`@${event}="${method}"`, `${eventSelector}`)
              eventsSelectors.push({
                selector: eventSelector,
                event,
                action: component[method]
              })
            }
          })
        })
      })
      resolve()
    })
      
    formatTemplate.then(() => {
      const mountComponent = new Promise((resolve, reject) => {
        el.innerHTML += template
        
        reactiveTagsSelectors.forEach((tag) => {
          store.subscribe(tag.state, (value) => {
            document.querySelectorAll(tag.selector).forEach((element) => {
              element.textContent = value
            })
          })
        })
        
        eventsSelectors.forEach((event) => {
          document
            .querySelectorAll(`[${event.selector}]`).forEach((element) => {
              element.addEventListener(event.event, () => event.action(event.selector))
          })
        })
        
        resolve()
      })
      
      mountComponent.then(() => {
        onInit()
      })
    })
  }
}

class Store {
  state = {}
  mutation = {}
  subscribers = []

  constructor({ state, mutation }) {
    this.state = state
    this.mutation = mutation
  }

  commit(mutation) {
    this.mutation[mutation](this.state)
  }

  subscribe(target, action) {
    this.subscribers.push({
      target,
      action
    })
  }

  setState(target, value) {
    const oldValue = this.state[target]

    this.state[target] = value

    this.stateChanged(target, value, oldValue)
  }

  stateChanged(target, value, oldValue) {
    this.subscribers.forEach((subscriber) => {
      if (subscriber.target === target) {
        subscriber.action(value, oldValue)
      }
    })
  }
}

window['fm'] = new Framework()
  
class App {
  selector = 'app'
  
  store = new Store({
    state: {
      count: 0,
      input: ''
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
  
  input = (selector) => {
    const inputValue = document
      .querySelector(`[${selector}]`).value
    
    this.store.setState('input', inputValue)
  }
  
  onInit = () => {
    console.log("App mounted!")
    
    this.store.subscribe('input', (value) => {
      console.log('input changed to:', value)
    })
    
    this.store.subscribe('count', (value, oldValue) => {
      console.log('count changed from', oldValue, 'to', value)
    })
  }
  
  render() {
    return `
      <div>
        {input}
        <input placeholder="write here" @change="input" />
        <br />
        {count}
        <button @click="increment">add 1</button>
      </div>
    `
  }
}

const app = new App()

fm.render(app, document.querySelector("#app"))

export class Counter {
  selector = "counter"
  
  store = new Store({
    state: {
      count: 0
    }
  })
  
  increment = () => {
    this.store.setState('count', this.store.state.count + 1)
  }
  
  render() {
    return`
      <div class="counter">
        <h3>You clicked {count} times.</h3>
        
        <button @click="increment">Click here!</button>
      </div>
    `
  }
  
  style() {
    return {
      lang: 'scss',
      content: `
        .counter {
          width: 100%;
          display: grid;
          place-items: start;
          gap: 12px;
          button {
            width: 50%;
            padding: 12px 16px;
            background: #03A9F4;
            color: #fff;
            border: 0;
            border-radius: 6px;
            transition: filter .3s;
            &:hover {
              filter: brightness(0.8);
            }
          }
        }
      `
    }
  }
}
export class Hello {
  selector = "hello"
  
  match = {}
  
  // You don't need a new Store() to set static states
  store = {
    state: {
      name: ''
    }
  }
  
  constructor({}, { match }) {
    this.match = match;
    
    this.store.state.name = match.data.name
  }
  
  render() {
    return`
      <h2>Hello {name} 🤗!</h2>
      <br/>
      <a href="#/">Return to home</a>
    `
  }
}
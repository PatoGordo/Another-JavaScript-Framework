export class Counter extends Component {
  selector = "counter"
  
  state = {
    count: 0
  }
  
  constructor() {
    super()
  }
  
  increment = () => {
    this.setState({
      count: this.state.count + 1
    })
  }
  
  render() {
    return`
      <div class="counter">
        <h3>You clicked { state.count } times.</h3>
        
        <button @click="increment">Click here!</button>
      </div>
    `
  }
}
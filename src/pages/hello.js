export class Hello extends Component {
  selector = "hello"
  
  match = {}
 
  state = {
    name: ''
  }
  
  constructor({}, { match }) {
    super()
    this.match = match;
    
    this.state.name = match.data.name
  }
  
  render() {
    return`
      <h2>Hello { state.name } 🤗!</h2>
      <br/>
      <a href="#/">Return to home</a>
    `
  }
}
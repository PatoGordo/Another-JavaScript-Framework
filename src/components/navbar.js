export class Navbar extends Component {
  selector = "navbar"
  
  props = {}
  
  constructor(props) {
    super()
    this.props = props
  }
  
  render() {
    return`
      <nav>
        <h1>{props.title}</h1>
        
        <ul>
          <li><a href="/" data-navigo>Home</a></li>
          <li><a href="/about" data-navigo>About</a></li>
        </ul>
      </nav>
    `
  }
}
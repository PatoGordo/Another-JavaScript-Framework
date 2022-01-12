export class Page404 extends Component {
  selector = "404"
  
  props = {}
  
  constructor(props) {
    super()
    this.props = props
  }
  
  render() {
    return`
      <h2>{ props.textn}</h2>
      <br />
      <a href="#/">Return to home</a>
    `
  }
}

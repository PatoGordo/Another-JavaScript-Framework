export class Page404 {
  selector = "404"
  
  props = {}
  
  constructor(props) {
    this.props = props
  }
  
  render() {
    return`
      <h2>{props.text}</h2>
      <br />
      <a href="#/">Return to home</a>
    `
  }
}

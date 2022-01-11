const fw = new Framework()

class HelloWorld {
  selector = "hello-world"
 
  // the props are static and not reactivity
  // if you want a dynamic prop it is recommended to access the children component dynamic store setState using the parent component
  props = {}
  
  // will get the props and make accessible in all class
  constructor(props) {
    this.props = props
  }
  
  // {props.title} will be replaced by title prop value
  render() {
    return`
      <h1>{props.title}</h1>
    `
  }
}

class App {
  selector = "app"
  
  components = {
    // to pass props you need just pass a object with your props into the component instance
    "hello-world": new HelloWorld({ title: "Hello World" })
  }
  
  render() {
    return `
      <hello-world/>
    `
  }
}

fw.render(new App(), document.querySelector('#app'))

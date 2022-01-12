const fw = new Framework()

// some components need to extend the Framework Component base class
class App extends Component {
  // selector is the html selector <app />
  selector = "app"
  
  state = {
    name: 'Hello World'
  }
  
  constructor() {
    // if you using constructor you need to add super() to get the extended Component properties
    super()
  }
  
  // onInit method will be called oneTime when the app component is mounted
  onInit() {
    console.log("App component inited")
  }
  
  // render is where you will put your component html
  // { state.name } will be changed to the state "name"
  render() {
    return `
      <h1>{ state.name }</h1>
    `
  }
}

// render(componentInstanceToRender, elementWhereWillBeRendered, afterRenderCallback)
fw.render(new App(), document.querySelector('#app'), () => {
  console.log("App component rendered in html element with id 'app'")
})

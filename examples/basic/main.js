const fw = new Framework()

class App {
  // not required but recommended
  // selector give to the component childrens a scope
  selector = "app"
  
  // static store (static store does not support reactivity)
  store = {
    state: {
      name: 'Hello World'
    }
  }
  
  // onInit method will be called oneTime when the app component is mounted
  onInit() {
    console.log("App component inited")
  }
  
  // render is where you will put your component html
  // {name} will be changed to the state "name" in the store
  render() {
    return `
      <h1>{name}</h1>
    `
  }
  
  // style is where you will put your component styles
  style() {
    return {
      // lang can be css || scss || sass
      // lang is not required and the default is css
      lang: 'css',
      // variables is like states but without reactivity
      variables: {
        color: 'blue'
      },
      // content is where you will put the styles code
      // {color} will be changed to the variable color value
      content: `
        h1 {
          color: {color}
        }
      `
    }
  }
}

// render(componentInstanceToRender, elementWhereWillBeRendered, afterRenderCallback)
fw.render(new App(), document.querySelector('#app'), () => {
  console.log("App component rendered in html element with id 'app'")
})

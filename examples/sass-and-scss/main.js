// IMPORTANT!! to use sass or scss you need to add sass.js cdn to your html head
// <script src="https://cdnjs.cloudflare.com/ajax/libs/sass.js/0.11.1/sass.sync.min.js"></script>

const fw = new Framework()

class App {
  selector = "app"
  
  // static store
  store = {
    state: {
      name: 'John Doe'
    }
  }
  
  render() {
    return `
      <div>
        <h1>{name}</h1>
        <h2>{name}</h2>
      </div>
    `
  }
  
  style() {
    return {
      // replace scss to sass and use sass syntax to make sass work
      lang: 'scss',
      variables: {
        h1Color: 'lightblue',
        h2Color: 'tomato'
      },
      content: `
        div {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          h1 {
            color: {h1Color}
          }
          h2 {
            color: {h2Color}
          }
        }
      `
    }
  }
}

fw.render(new App(), document.querySelector('#app'))

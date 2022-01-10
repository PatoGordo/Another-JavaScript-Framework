class Framework {
  frameworkPrefix = 'fw'
  components = {}
  availableEvents = ['click', 'input', 'change']
  directives = {}
  extensions = {}
  
  use(extension) {
    const { selector, components, store, onInit } = extension
    
    this.extensions[selector] = extension;
    
    Object.keys(extension.directives).forEach((directive) => {
      this.directives[directive] = extension.directives[directive]
    })
    
    Object.keys(components).forEach((component) => {
      this.components[component] = components[component]
    })
  }
  
  render(component, el) {
    this.renderComponent(component, el)
  }
  
  renderComponent(component, el) {
    const { selector, onInit, render, style, store, components, props } = component
    
    let reactiveTagsSelectors = []
    let eventsSelectors = []
    let nestedComponentsSelectors = []
    let directivesSelectors = []
    
    let template = render? String(render()) : null
    let styles = style? style() : null
    
    const formatTemplate = new Promise((resolve, reject) => {
      if (!template) {
        return
      }
      if (this.directives) {
        Object.keys(this.directives).forEach((directive) => {
          const directiveSelector = `${this.frameworkPrefix}-${selector}-${directive}`
          
          if(template.includes(`#${directive}`)) {
            template = template.replaceAll(`#${directive}`, `${directiveSelector} ${this.directives[directive].propSelector}`)
            directivesSelectors.push({
              selector: directiveSelector,
              event: this.directives[directive].event,
              propSelector: this.directives[directive].propSelector,
              action: this.directives[directive].action
            })
          }
        })
      }
      if (props) {
        Object.keys(props).forEach((prop) => {
          if (template.includes(`{props.${prop}}`)) {
            template = template.replaceAll(`{props.${prop}}`, `${props[prop]}`)
          }
        })
      }
      if (store) {
        Object.keys(store.state).forEach((key) => {
          if(template.includes(`{${key}}`)) {
            const tagSelector = `${this.frameworkPrefix}-state-${key}`
            
            template = template
              .replaceAll(`{${key}}`, 
              `<${tagSelector}>
                ${store.state[key]}
              </${tagSelector}>`)
            reactiveTagsSelectors.push({
              selector: tagSelector,
              state: key
            })
          }
        })
      }
      if(template.includes('@')) {
        Object.keys(component).forEach((method) => {
          this.availableEvents.forEach((event) => {
            if (template.includes(`@${event}="${method}"`)) {
              const eventSelector = `${this.frameworkPrefix}-${selector}-on${event}-${method}`
              
              template = template.replaceAll(`@${event}="${method}"`, `${eventSelector}`)
              eventsSelectors.push({
                selector: eventSelector,
                event,
                action: component[method]
              })
            }
          })
        })
      }
      if (this.components) {
        Object.keys(this.components).forEach((component) => {
          if (template.includes(`<${component}/>`)) {
            const templateLoadSelector = `${this.frameworkPrefix}-${selector}-load-global-component-${component}`
            
            template = template.replaceAll(`<${component}/>`, `<${templateLoadSelector}></${templateLoadSelector}>`)
            nestedComponentsSelectors.push({
              selector: templateLoadSelector,
              component: this.components[component]
            })
          }
        })
      }
      if (components) {
        Object.keys(components).forEach((nestedComponent) => {
          if (template.includes(`<${nestedComponent}/>`)) {
            const templateLoadSelector = `${this.frameworkPrefix}-${selector}-load-${nestedComponent}`
            
            template = template.replaceAll(`<${nestedComponent}/>`, `<${templateLoadSelector}></${templateLoadSelector}>`)
            nestedComponentsSelectors.push({
              selector: templateLoadSelector,
              component: components[nestedComponent]
            })
          }
        })
      }
      resolve()
    })
      
    formatTemplate.then(() => {
      const mountComponent = new Promise((resolve, reject) => {
        if(el.length) {
          el.forEach((elm) => {
            elm.innerHTML += template
          })
        } else {
          el.innerHTML += template
        }
        
        if(reactiveTagsSelectors.length) {
          reactiveTagsSelectors.forEach((tag) => {
            store.subscribe(tag.state, (value) => {
              document.querySelectorAll(tag.selector).forEach((element) => {
                element.textContent = value
              })
            })
          })
        }
        
        if(eventsSelectors.length) {
          eventsSelectors.forEach((event) => {
            document
              .querySelectorAll(`[${event.selector}]`).forEach((element) => {
                element.addEventListener(event.event, () => event.action(event.selector))
            })
          })
        }
        
        if(nestedComponentsSelectors) {
          nestedComponentsSelectors.forEach((nestedComponent) => {
            this.render(nestedComponent.component, document.querySelectorAll(nestedComponent.selector))
          })
        }
        
        if(directivesSelectors) {
          directivesSelectors.forEach((directiveSelector) => {
            document.querySelectorAll(`[${directiveSelector.selector}]`)
              .forEach((element) => {
                element.addEventListener(directiveSelector.event, () => {
                  directiveSelector.action(element.getAttribute(directiveSelector.propSelector))
                })
              })
          })
        }
        
        resolve()
      })
      
      mountComponent.then(() => {
        if (style) {
          let mountStyles = new Promise((resolve, reject) => {
            styles.lang = styles.lang? styles.lang : ''
            
            if (styles.variables) {
              Object.keys(styles.variables).forEach((variable) => {
                styles.content = styles.content.replaceAll(`{${variable}}`, `${styles.variables[variable]}`)
              })
            }
            
            let cachedStyleStorageName = `${this.frameworkPrefix}-${selector}-cached-style`
            
            const css = (cssContent, clearBefore = false) => {
              let frameworkCssTag = document.querySelector(`#${this.frameworkPrefix}-${selector}-styles`)
              
              if (frameworkCssTag) {
                if(clearBefore) {
                  frameworkCssTag.textContent = ''
                }
                frameworkCssTag.textContent += cssContent
              } else {
                frameworkCssTag = document.createElement('style')
                frameworkCssTag.id = `${this.frameworkPrefix}-${selector}-styles`
                frameworkCssTag.textContent += cssContent
                document.head.appendChild(frameworkCssTag)
              }
            }
            
            if (localStorage.getItem(cachedStyleStorageName)) {
              css(localStorage.getItem(cachedStyleStorageName))
            }
            
            if (styles.lang === 'scss' || styles.lang === 'sass') {
              if(typeof Sass === undefined) {
                console.warn('You need to add the sass.js cdn to html (<script src="https://cdnjs.cloudflare.com/ajax/libs/sass.js/0.11.1/sass.sync.min.js"></script>)')
                return resolve()
              }
            }
            
            if (styles.lang === 'scss') {
              Sass.compile(styles.content.trim(), { indentedSyntax: false }, (compiledCss) => {
                if (localStorage.getItem(cachedStyleStorageName) !== compiledCss.text) {
                  css(compiledCss.text)
                  localStorage.setItem(cachedStyleStorageName, compiledCss.text)
                  resolve()
                } else {
                  resolve()
                }
              });
            } else if (styles.lang === 'sass') {
              Sass.compile(styles.content.trim(), { indentedSyntax: true }, (compiledCss) => {
                if (localStorage.getItem(cachedStyleStorageName) !== compiledCss.text) {
                  css(compiledCss.text)
                  localStorage.setItem(cachedStyleStorageName, compiledCss.text)
                  resolve()
                } else {
                  resolve()
                }
              });
            } else if (styles.lang === 'css') {
              if (localStorage.getItem(cachedStyleStorageName) !== styles.t) {
                css(styles.content)
                localStorage.setItem(cachedStyleStorageName, styles.content)
                resolve()
              } else {
                resolve()
              }
            }
          })
          
          mountStyles.then(() => {
            onInit? onInit() : null
          })
        } else {
          onInit? onInit() : null
        }
      })
    })
  }
}

class Store {
  state = {}
  mutation = {}
  subscribers = []

  constructor({ state, mutation }) {
    this.state = state
    this.mutation = mutation
  }

  commit(mutation) {
    this.mutation[mutation](this.state)
  }

  subscribe(target, action) {
    this.subscribers.push({
      target,
      action
    })
  }

  setState(target, value) {
    const oldValue = this.state[target]

    this.state[target] = value

    this.stateChanged(target, value, oldValue)
  }

  stateChanged(target, value, oldValue) {
    this.subscribers.forEach((subscriber) => {
      if (subscriber.target === target) {
        subscriber.action(value, oldValue)
      }
    })
  }
}

window['Framework'] = Framework
window['Store'] = Store

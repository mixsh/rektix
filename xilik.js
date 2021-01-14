class xilik {
    constructor(domScope=document, props=window) {
        this.values = {}
        this.props = props
        
        this.load(domScope)
    }
    
    getValue(element) {
        const type = element.dataset.type || element.type
        switch(type) {
            case 'number': return parseInt(element.value)
            default: return element.value
        }
    }

    bind(element) {
        const id = element.id

        Object.defineProperty(this.props, id, {
            get: () => this.values[id],
            set: newVal => element.value = this.values[id] = newVal
        })

        element.onchange = () => this.props[id] = this.getValue(element)
        
        Object.defineProperty(element, 'val', {
            get: () => this.getValue(element),
            set: newVal => {
                element.value = newVal
                element.dispatchEvent(new Event('change'))
            }
        })

        this.props[id] = this.getValue(element)
    }

    load(domScope) {
        let tags = ['input', 'select', 'textarea']

        for (const tag of tags) {
            let elements = domScope.getElementsByTagName(tag)
        
            for (const element of elements)
                this.bind(element)
        }

        let conditionalWrappers = domScope.querySelectorAll('[data-x-if]')

        for (const wrapper of conditionalWrappers) {
            console.log('eita', wrapper.dataset.xIf)
            console.log('hm', this.scopeEval(wrapper.dataset.xIf))
        }
    }

    scopeEval = script => Function(`"use strict";return (${script})`).bind(this.props)()
}

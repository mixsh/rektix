class Rektix {
    constructor() {
        this.values = {}
    }
    
    getValueByType(element) {
        switch(element.type) {
            case 'number': return parseInt(element.value)
            default: return element.value
        }
    }

    bind(scope, element) {
        const id = element.id

        Object.defineProperty(scope, id, {
            get: () => this.values[id],
            set: newVal => element.value = this.values[id] = newVal
        })

        element.onchange = () => scope[id] = this.getValueByType(element)

        scope[id] = this.getValueByType(element)
    }

    bindTag(tag) {
        let inputs = document.getElementsByTagName(tag)
    
        for (const input of inputs)
            this.bind(scope, input)
    }

    init(scope) {
        this.bindTag(scope, 'input')
        this.bindTag(scope, 'select')
    }
}
function run(config) {
    const wrapper = document.createElement('div')
    config.setup(wrapper)
    
    const p = document.createElement('p')
    const description = document.createElement('strong')
    description.innerHTML = config.description
    p.appendChild(description)
    
    try {
        const x = xilik(wrapper, config.props)

        if (config.test(x, wrapper)) {
            p.classList.add('green')
        }
        else {
            console.error('FAILED', config.description)
            p.classList.add('red')
        }
    }
    catch (error) {
        console.error('FAILED', error)
        p.innerHTML += '\n' + error
        p.classList.add('red')
    }
    
    const $testResultsWrapper = document.getElementById('test-results-wrapper')
    $testResultsWrapper.appendChild(p)
}

run({
    description: '$input.value should change after changing x.props.theInput',
    props: {
        theInput: 123,
    },
    setup: wrapper => {
        const $input = document.createElement('input')
        $input.id = 'theInput'
        $input.type = 'number'
        wrapper.appendChild($input)
    },
    test: (xilik, wrapper) => {
        xilik.props.theInput = 456
        return xilik.props.theInput === wrapper.children.theInput.val
    }
})

run({
    description: 'x.props.input2 should change after changing $input2.value',
    props: {
        theInput: 123,
    },
    setup: wrapper => {
        const $input = document.createElement('input')
        $input.id = 'theInput'
        $input.type = 'number'
        wrapper.appendChild($input)
    },
    test: (xilik, wrapper) => {
        const $input = wrapper.children.theInput
        $input.val = 777

        return xilik.props.theInput.toString() === $input.value
    }
})

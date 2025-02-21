const notes = [
    { // text
        id: 'n101',
        createdAt: 1112222,
        type: 'NoteTxt',
        isPinned: true,
        style: {
            backgroundColor: '#00d'
        },
        info: {
            title: 'Text note',
            txt: 'Fullstack Me Baby!'
        }
    },
    { // image
        id: 'n102',
        createdAt: 1112223,
        type: 'NoteImg',
        isPinned: false,
        info: {
            url: 'http://some-img/me',
            title: 'Bobi and Me'
        },
        style: {
            backgroundColor: '#00d'
        }
    }, 
    { // todos
        id: 'n103',
        createdAt: 1112224,
        type: 'NoteTodos',
        isPinned: false,
        info: {
            title: 'Get my stuff together',
            todos: [{
                txt: 'Driving license',
                doneAt: null
            },
            {
                txt: 'Coding power',
                doneAt: 187111111
            }]
        }
    }
]
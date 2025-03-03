import { noteService } from "../services/note.service.js"

const { useState, useEffect, useRef } = React

export function NoteSearchCategory({ filterBy, onSetFilter, onSearchFocus }) {
    const [colors, setColors] = useState(null)
    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })


    useEffect(() => {
        onSetFilter(filterByToEdit)
        if (filterByToEdit.color) {
            onSearchFocus(false)
        }
    }, [filterByToEdit])


    useEffect(() => {
        loadColors()
    }, [])

    function loadColors() {
        noteService.getNotesColorStats()
            .then(colorsStats => setColors(colorsStats))
    }


    function getColorName(color) {
        switch (color) {
            case '#e9e3d4':
                return 'Shelduck Blue'
            case '#fff8b8':
                return 'Pale Goldenrod'
        }
    }

    function handleChange({ target }) {
        let { value, name: field, type } = target
        console.log(value);

        if (type === 'number') value = +value
        // if(type === 'checkbox') value = target.checked

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    if (!colors) return
    return (
        <section>
            <div className='colors-category '>
                <div>colors</div>
                {colors.length > 1 && <div className='colors-picker'>
                    {colors.map(color => {
                        return <div key={color}>
                            <input type="radio" id={color} name="color" value={color} onClick={handleChange} />
                            <label
                                htmlFor={color}
                                className='color-pick'
                                data-color={getColorName(color)}
                                style={{ backgroundColor: color }}
                            >
                            </label>
                        </div>

                    })}
                </div>}

                <div>colors</div>
                {colors.length > 1 && <div className='colors-picker'>
                    {colors.map(color => {
                        return <div key={color}>
                            <input type="radio" id={color} name="color" value={color} onClick={handleChange} />
                            <label
                                htmlFor={color}
                                className='color-pick'
                                data-color={getColorName(color)}
                                style={{ backgroundColor: color }}
                            >
                            </label>
                        </div>

                    })}
                </div>}

                <div>colors</div>
                {colors.length > 1 && <div className='colors-picker'>
                    {colors.map(color => {
                        return <div key={color}>
                            <input type="radio" id={color} name="color" value={color} onClick={handleChange} />
                            <label
                                htmlFor={color}
                                className='color-pick'
                                data-color={getColorName(color)}
                                style={{ backgroundColor: color }}
                            >
                            </label>
                        </div>

                    })}
                </div>}
            </div>
        </section >
    )
}
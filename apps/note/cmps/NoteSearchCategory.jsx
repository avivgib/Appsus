import { noteService } from "../services/note.service.js"

const { useState, useEffect, useRef } = React

export function NoteSearchCategory({ filterBy, onSetFilter, onSearchFocus }) {
    const [colors, setColors] = useState(null)
    const [labels, setLabels] = useState(null)
    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })


    // useEffect(() => {
    //     onSetFilter(filterByToEdit)
    //     if (filterByToEdit.color) {
    //         onSearchFocus(false)
    //     }
    //     if (filterByToEdit.labels) {
    //         onSearchFocus(false)
    //     }
    // }, [filterByToEdit])


    useEffect(() => {
        if (JSON.stringify(filterByToEdit) !== JSON.stringify(filterBy)) {
            onSetFilter(filterByToEdit);
        }
        if (filterByToEdit.color || filterByToEdit.labels) {
            onSearchFocus(false);
        }
    }, [filterByToEdit, filterBy]);



    useEffect(() => {
        loadColors()
        loadLabels()
    }, [])

    function loadColors() {
        noteService.getNotesColorStats()
            .then(colorsStats => setColors(colorsStats))
    }

    function loadLabels() {
        noteService.getNotesLabelStats()
            .then(labelsStats => {
                if (typeof labelsStats === 'string') {
                    setLabels(labelsStats.split(','))
                } else {
                    setLabels(labelsStats)
                }
            })
            .catch(err => console.error('Error loading labels', err))
    }

    function getColorName(color) {
        switch (color) {
            case '#ffffff': return 'Default'
            case '#faafa8': return 'Coral'
            case '#f39f76': return 'Peach'
            case '#fff8b8': return 'Sand'
            case '#e2f6d3': return 'Mint'
            case '#b4ddd3': return 'Sage'
            case '#d4e4ed': return 'Fog'
            case '#aeccdc': return 'Storm'
            case '#d3bfdb': return 'Dusk'
            case '#f6e2dd': return 'Blossom'
            case '#e9e3d4': return 'Clay'
            case '#efeff1': return 'Chalk'
            default: return 'Unknown'
        }
    }

    function handleChange({ target }) {
        let { value, name: field } = target
        console.log(value)

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    if (!colors || !labels) return
    return (
        <section className="note-search-category">
            {labels.length > 1 && (
                <div className='labels-category'>
                    <div className="labels-title">Labels</div>
                    <div className='labels-picker'>
                        {labels.map((label, index) => (
                            <div key={`${label}-${index}`}>
                                <input
                                    type="radio"
                                    id={`${label}-${index}`}
                                    name="labels"
                                    value={label}
                                    onClick={handleChange}
                                    checked={filterByToEdit.labels === label}
                                />
                                <label
                                    htmlFor={`${label}-${index}`}
                                    className="label-pick"
                                    data-label={label}
                                >
                                    <div className="label-name">{label}</div>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {colors.length > 1 &&
                (<div className='colors-category '>

                    <div className="colors-title">Colors</div>
                    <div className='colors-picker'>
                        {colors.map(color => {
                            return <div key={color}>
                                <input
                                    type="radio"
                                    id={color}
                                    name="color"
                                    value={color}
                                    onChange={handleChange}
                                />

                                <label
                                    htmlFor={color}
                                    className='color-pick'
                                    data-color={getColorName(color)}
                                    style={{ backgroundColor: color }}
                                >
                                </label>
                            </div>

                        })}
                    </div>
                </div>)}
        </section >
    )
}
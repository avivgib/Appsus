import { utilService } from "../../../services/util.service.js";

const { useState, useEffect, useRef } = React

export function NoteFilter({ filterBy, onSetFilter, onSearchFocus }) {

    const [isFocused, setIsFocused] = useState(false)
    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    console.log(filterByToEdit);

    const filterDebounce = useRef(utilService.debounce(onSetFilter, 1000))

    useEffect(() => {
        filterDebounce.current(filterByToEdit)
    }, [filterByToEdit])

    function onSearchNotes({ value }) {
        onSearchNotes(value)
    }

    function handleChange({ target }) {

        let { value, name: field, type } = target
        if (type === 'number') value = +value
        // if(type === 'checkbox') value = target.checked

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function handleFocus() {
        setIsFocused(true)
        onSearchFocus(true) // Notify parent component
    }

    function handleBlur() {
        setIsFocused(false)
        onSearchFocus(false) // Notify parent component
    }

    return (
        <section className="search-notes">
            <section className="search-container">
                <div className="fa magnifying-glass"></div>

                <input
                    type="search"
                    placeholder="Search"
                    // value={filterBy.txt}
                    name='txt'
                    onChange={handleChange}
                    onClick={handleFocus}
                // onBlur={handleBlur}
                />
            </section>

            {isFocused && (
                <div className="search-options">
                    <div className="option-square">Reminders</div>
                    <div className="option-square">Lists</div>
                    <div className="option-square">Images</div>
                    <div className="option-square">Drawings</div>
                </div>
            )}
        </section>
    )
}
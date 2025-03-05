import { utilService } from "../../../services/util.service.js";

const { useState, useEffect, useRef } = React

export function NoteFilter({ filterBy, onSetFilter, onSearchFocus }) {
    const [searchText, setSearchText] = useState(filterBy.txt || '');
    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })

    const filterDebounce = useRef(utilService.debounce(onSetFilter, 500))

    useEffect(() => {
        filterDebounce.current(filterByToEdit)

        if (searchText.length > 0) {
            onSearchFocus(false)
        }
    }, [filterByToEdit])

    function handleChange({ target }) {
        let { value, name } = target
        setSearchText(value)
        setFilterByToEdit(prevFilter => ({ ...prevFilter, [name]: value }))
    }

    function handleFocus() {
        onSearchFocus(true)
    }

    function handleClear() {
        setSearchText('')
        setFilterByToEdit(prevFilter => ({ ...prevFilter, txt: '' }))
        onSearchFocus(false)
    }

    return (
        <section className="search-notes">
            <section className="search-container">
                <div className="fa magnifying-glass"></div>

                <input
                    type="search"
                    placeholder="Search"
                    name='txt'
                    value={searchText}
                    onChange={handleChange}
                    onFocus={handleFocus}
                />

                {searchText && (
                    <button type="button" className="reset-btn" onClick={handleClear}>
                        X
                    </button>
                )}

            </section>
        </section>
    )
}
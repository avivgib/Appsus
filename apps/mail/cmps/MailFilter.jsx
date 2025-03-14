import { utilService } from "../../../services/util.service.js"
import { MoreFilters } from "./MoreFilters.jsx"

const { useState, useEffect, useRef } = React

export function MailFilter({ filterBy, onSetFilterBy, defaultFilterByRef }) {
    const [editFilterBy, setEditFilterBy] = useState({ ...filterBy })
    const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(false)
    // const [ischecked, setIschecked] = useState('')


    const filterDebounce = useRef(utilService.debounce(onSetFilterBy, 500))

    // rest the editFilterBy if filterBy get status
    useEffect(() => {
        if (filterBy.status !== '') {
            setEditFilterBy(prev => ({ ...filterBy }))
            // setIschecked('')
        }
    }, [filterBy.status])

    useEffect(() => {
        filterDebounce.current(editFilterBy)
        // onSetFilterBy(editFilterBy)
    }, [editFilterBy])


    function onSetEditFilterBy(ev) {
        var { value, type, name, checked } = ev.target

        if (type === 'number') value = +value
        if (type === 'checkbox') value = checked
        if (name === 'date') value = new Date(value).getTime()

        setEditFilterBy(prev => ({ ...prev, [name]: value }))

        if (filterBy.status) {
            setEditFilterBy(prev => ({ ...prev, status: '' }))
        }
    }

    function onRestTxt() {
        setEditFilterBy(prev => ({ ...prev, txt: '' }))
    }

    function onOpenMoreFilters() {
        setIsMoreFiltersOpen(!isMoreFiltersOpen)
    }

    function onResetFilter() {
        setEditFilterBy(prev => ({ ...defaultFilterByRef }))
    }

    const { txt } = editFilterBy
    return (
        <section className='mail-filter flex align-center'>
            <div className='main-search flex align-center'>
                <span className='fa magnifying-glass'></span>
                <input type="search" name='txt' placeholder='Email search' value={txt} onChange={onSetEditFilterBy} />
                <span
                    className={`rest-btn fa x ${editFilterBy.txt ? 'show' : ''}`}
                    onClick={onRestTxt}></span>
                <span
                    className='more-filters-btn fa bars'
                    onClick={onOpenMoreFilters}>
                    {isMoreFiltersOpen && <MoreFilters
                        editFilterBy={editFilterBy}
                        onSetEditFilterBy={onSetEditFilterBy}
                        onResetFilter={onResetFilter}
                        onOpenMoreFilters={onOpenMoreFilters}
                    />}
                </span>

            </div>


        </section>
    )
}
import { utilService } from "../services/util.service.js"


const { useState, useEffect, useRef } = React
const { useLocation } = ReactRouterDOM

export function LabelPicker({ labels, handleChanges }) {

    const [currPage, setCurrPage] = useState(null)
    const location = useLocation()

    const [selectedLabels, setSelectedLabels] = useState([...labels])
    console.log(selectedLabels);

    const labelPickerRef = useRef()

    useEffect(() => {
        if (location.pathname) {
            onSetCurrPage(location.pathname)
        }
    }, [location.pathname])

    function onSetCurrPage(pathname) {
        setCurrPage(pathname)
    }

    function handleClickOutside(ev) {
        if (ev.target !== labelPickerRef.current) {
            onSaveLabels(ev)
        }
    }


    useEffect(() => {
        document.addEventListener('click', handleClickOutside)

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [selectedLabels])


    function updateMailLabels(ev) {
        ev.stopPropagation()
        const { name, checked } = ev.target

        if (checked) {
            setSelectedLabels(prev => ([name, ...prev]))
        } else {
            setSelectedLabels(prev => prev.filter(label => label !== name))
        }
    }

    function onSaveLabels(ev) {
        console.log(selectedLabels);
        handleChanges(ev, 'labels', selectedLabels)
    }


    return (
        <section className='label-picker'
            onClick={(event) => { event.stopPropagation() }}
        >
            <div>Labels:</div>

            <ul className='clean-list'>
                {currPage === '/note' &&
                    utilService.getNotesLabels().map(label => {
                        return <li key={label}>
                            <input type="checkbox" id={label} name={label}
                                checked={selectedLabels.includes(label) ? true : false}
                                onChange={updateMailLabels} />
                            <label htmlFor={label}>{label}</label>
                        </li>
                    })
                }

                {currPage === '/mail' &&
                    utilService.getMailLabels().map(label => {
                        return <li key={label}>
                            <input type="checkbox" id={label} name={label}
                                checked={selectedLabels.includes(label) ? true : false}
                                onChange={updateMailLabels} />
                            <label htmlFor={label}>{label}</label>
                        </li>
                    })
                }
            </ul>

            <span onClick={onSaveLabels}>save</span>
        </section >
    )
}


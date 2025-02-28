
const { useState, useEffect, useRef } = React


export function LabelPicker({ lables, handleChanges }) {
    const [selectedLabels, setSelectedLabels] = useState([...lables])
    console.log(selectedLabels);

    const labelPickerRef = useRef()

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
        handleChanges(ev, 'lables', selectedLabels)
    }


    return (
        <section className='label-picker'
            onClick={(event) => { event.stopPropagation() }}
        >
            <div>Labels:</div>

            <ul className='clean-list'>
                {
                    ['family', 'work', 'spam', 'friends'].map(label => {
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


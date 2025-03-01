
const { useState, useEffect, useRef } = React


export function LabelPicker({ onSaveLabels }) {
    const [selectedLabels, setSelectedLabels] = useState([])
    console.log(selectedLabels);


    const labelPickerRef = useRef()
    const handleClickRef = useRef(handleClickOutside)

    function handleClickOutside(ev) {
        if (ev.target !== labelPickerRef.current) {
            onSaveLabels(ev, selectedLabels)
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleClickRef.current)

        return (() => {
            document.removeEventListener('click', handleClickRef.current)
        })
    }, [])



    function handleChange(ev) {
        ev.stopPropagation()
        const { name, checked } = ev.target

        if (checked) {
            setSelectedLabels(prev => ([name, ...prev]))
        } else {
            setSelectedLabels(prev => prev.filter(label => label !== name))
        }
    }


    return (
        <section className='label-picker'>
            <div>Labels:</div>

            <ul className='clean-list'>
                <li>
                    <input type="checkbox" id="family" name="family" onChange={handleChange} />
                    <label htmlFor="family">family</label>
                </li>
                <li>
                    <input type="checkbox" id="work" name="work" onChange={handleChange} />
                    <label htmlFor="work">work</label>
                </li>
                <li>
                    <input type="checkbox" id="spam" name="spam" onChange={handleChange} />
                    <label htmlFor="spam">spam</label>
                </li>
                <li>
                    <input type="checkbox" id="friends" name="friends" onChange={handleChange} />
                    <label htmlFor="friends">friends</label>
                </li>
            </ul>

            <span onClick={(event) => { onSaveLabels(event, selectedLabels) }}>save</span>
        </section >
    )
}
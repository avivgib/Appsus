const { useState, useRef, useEffect } = React

export function ColorPicker({ note, onSetBackgroundColor, color }) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedColor, setSelectedColor] = useState(color)
    const pickerRef = useRef(null)

    const colors = [
        '#ffffff', '#faafa8', '#f39f76', '#fff8b8', '#e2f6d3', '#b4ddd3',
        '#d4e4ed', '#aeccdc', '#d3bfdb', '#f6e2dd', '#e9e3d4', '#efeff1'
    ]

    useEffect(() => {
        if (!isOpen) return

        function handleClickOutside(event) {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    function onSetColor(newColor) {
        if (newColor === selectedColor) return
        setSelectedColor(newColor)
        onSetBackgroundColor({ ...note, style: { ...note.style, backgroundColor: newColor } })
    }

    return (
        <div className="color-picker-container" ref={pickerRef}>
            <button
                className="fa palette"
                onClick={() => setIsOpen(prev => !prev)}
            ></button>

            {isOpen && (
                <section className="color-input" >
                    {colors.map(color => (
                        <div
                            key={color}
                            className={`color-option ${color === selectedColor ? 'selected' : ''} `}
                            style={{ backgroundColor: color }}
                            onClick={() => onSetColor(color)}
                        ></div>
                    ))}
                </section>
            )}
        </div>
    )
}

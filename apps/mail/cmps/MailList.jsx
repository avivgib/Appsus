import { MailPreview } from "./MailPreview.jsx"

export function MailList({ emails }) {

    return (
        <ul className='emails-list clean-list'>

            {emails.map(mail => {
                return <li key={mail.id} className='mail-preview flex'>
                    <div className='grip'><span className='fa grip-vertical'></span></div>
                    <div className='mail-select'><span className='fare square'></span></div>
                    <div className='mail-star'><span className='fare star'></span></div>
                    <div className='mail-important'><span className='fare book-mark'></span></div>
                    <MailPreview mail={mail} />
                </li>
            })}

        </ul >
    )
}

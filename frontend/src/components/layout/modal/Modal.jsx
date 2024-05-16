import { FaTimes } from 'react-icons/fa'
import classes from './Modal.module.css'

const Modal = ({children, onClose}) => {

    const modalClickHandler = (event) => {
        event.stopPropagation()
    }

    return(
        <div onClick={onClose} className={classes.backdrop}>
            <dialog open onClick={modalClickHandler} className={classes.modal}>
            <button onClick={() => onClose()} className={classes.close}><FaTimes  className={classes.closeContent}/></button>
                {children}
            </dialog>
        </div>
    )
}

export default Modal;
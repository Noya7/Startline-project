import { FaTimes } from 'react-icons/fa'
import classes from './Modal.module.css'
import { useNavigate } from 'react-router-dom'

const Modal = ({children, onClose}) => {
    const navigate = useNavigate()

    const modalClickHandler = (event) => {
        event.stopPropagation()
    }

    const closeHandler = () => onClose ? onClose() : navigate('../');

    return(
        <div onClick={closeHandler} className={classes.backdrop}>
            <dialog open onClick={modalClickHandler} className={classes.modal}>
            <button onClick={closeHandler} className={classes.close}><FaTimes  className={classes.closeContent}/></button>
                {children}
            </dialog>
        </div>
    )
}

export default Modal;
import classes from './Modal.module.css'

const Modal = ({children, onClose}) => {

    const modalClickHandler = (event) => {
        event.stopPropagation()
    }

    return(
        <div onClick={onClose} className={classes.backdrop}>
            <dialog open onClick={modalClickHandler} className={classes.modal}>
                {children}
            </dialog>
        </div>
    )
}

export default Modal;
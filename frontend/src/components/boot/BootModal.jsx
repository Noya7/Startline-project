import Modal from "../layout/modal/Modal"
import classes from "./BootModal.module.css"

const BootModal = () => {
  return (
    <Modal showClose={false}>
        <div className={classes.main}>
            <h1>Bienvenidos a StartLine Clinic!</h1>
            <p>El Back End de este proyecto esta hosteado en Render, y necesita encenderse luego de un tiempo sin uso.</p>
            <p>Una vez encendido, el modal se cerrara automaticamente.</p>
        </div>
    </Modal>
  )
}

export default BootModal
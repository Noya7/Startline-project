import { useEffect, useState } from "react"
import Modal from "../layout/modal/Modal"
import classes from "./BootModal.module.css"
import Cookie from 'js-cookie'

const BootModal = () => {
  const [isServerUp, setIsServerUp] = useState(Cookie.get('isServerUp') === 'true')

  useEffect(() => {
    if (isServerUp) return;

    const interval = setInterval(() => {
      const currentValue = Cookie.get('isServerUp') === 'true';
      (currentValue !== isServerUp) && setIsServerUp(currentValue)
    }, 1000);
    return () => clearInterval(interval);
  }, [isServerUp]);

  return (
    <Modal showClose={isServerUp}>
        <div className={classes.main}>
            <h1>Bienvenidos a StartLine Clinic!</h1>
            <p>El Back End de este proyecto esta hosteado en Render, y necesita encenderse luego de un tiempo sin uso.</p>
            <p>Una vez encendido, podras cerrar el cartel presionando la X.</p>
        </div>
    </Modal>
  )
}

export default BootModal
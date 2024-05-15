import { Link } from 'react-router-dom'

import classes from './UserDataWidget.module.css'

const UserDataWidget = ({userData}) => {
  return (
    <div className={`${classes.main} ${classes[userData.userType]}`}>
        <div className={classes.image}>
                <img src={userData.image} alt={`Imagen de ${userData.name}`} />
            </div>
        <div className={userData.userType === 'patient' ? classes.patientInfo : classes.medicInfo}>
            <div className={classes.text}>
                <h2>{userData.name} {userData.surname}</h2>
                <p>Área: {userData.area}</p>
                <p>{userData.userType === 'medic' ? `Matricula: ${userData.matricula}` : `DNI: ${userData.DNI  }`}</p>
            </div>
            <span className={classes.buttons}>
                <Link to='/portal/config'>Configuración</Link>
                <Link to='/portal/logout'>Cerrar sesión</Link>
            </span>
        </div>
    </div>
  )
}

export default UserDataWidget
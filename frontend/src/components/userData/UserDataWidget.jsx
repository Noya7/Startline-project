import { useNavigate } from 'react-router-dom'

import classes from './UserDataWidget.module.css'
import { useDispatch } from 'react-redux'
import { logoutAsync } from '../../store/auth-thunks'

const UserDataWidget = ({userData}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const logoutHandler = () => {
        dispatch(logoutAsync())
        navigate('/')
    }

    return (
        <div className={`${classes.main} ${classes[userData.userType]}`}>
            {userData.userType === 'medic' && <div className={classes.image}>
                    <img src={userData.image} alt={`Imagen de ${userData.name}`} />
            </div>}
            <div className={userData.userType === 'patient' ? classes.patientInfo : classes.medicInfo}>
                <div className={classes.text}>
                    <h2>{userData.name} {userData.surname}</h2>
                    <span>
                        {userData.userType === 'medic' && <p >Área: {userData.area}</p>}
                        <p className={classes.identification}>{userData.userType === 'medic' ? `Matricula: ${userData.matricula}` : `DNI: ${userData.DNI  }`}</p>
                    </span>
                </div>
                <span className={userData.userType === 'medic' ? classes.buttons : classes.patientButtons}>
                    <button onClick={logoutHandler}>Cerrar sesión</button>
                </span>
            </div>
        </div>
  )
}

export default UserDataWidget
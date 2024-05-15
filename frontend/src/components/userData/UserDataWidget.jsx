import { Link } from 'react-router-dom'
import Card from '../layout/card/Card'
import classes from './UserDataWidget.module.css'

const UserDataWidget = ({userData, medicData}) => {
  return (
    <Card styling={{borderRadius: '1rem'}}>
        <div className={`${classes.main} ${classes[userData.userType]}`}>
            <Link className={classes.goToConfig} to='config' >Ir a configuración de cuenta</Link>
            <div className={classes.userInfo}>
                <div className={classes.image}>
                    <img src={userData.image} alt={`Imagen de ${userData.name}`} />
                </div>
                <div className={classes.text}>
                    <h2>{userData.name} {userData.surname}</h2>
                    <p>Área: {userData.area}</p>
                    <p>{userData.userType === 'medic' ? `Matricula: ${userData.matricula}` : `DNI: ${userData.DNI  }`}</p>
                </div>
            </div>
            {userData.userType === 'medic' && <div className={classes.medicOnly}>
                <h2>{medicData?.appointments || 15}</h2>
                <p>Turnos programados para hoy!</p>
            </div>}
        </div>
    </Card>
  )
}

export default UserDataWidget
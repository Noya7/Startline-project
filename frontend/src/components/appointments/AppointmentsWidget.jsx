import {Link} from 'react-router-dom';
import WidgetItem from './WidgetItem';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import classes from './AppointmentsWidget.module.css';


const AppointmentsWidget = ({userType}) => {
  const [items, setItems] = useState([])

  const appointments = useSelector(state =>userType === 'medic' ?  state.medic.appointments : state.patient.appointments?.appointments)

  useEffect(()=>{
    const mappingFunction = (data) => {
      return !!data && data.map(item => <WidgetItem key={item._id} data={item} userType={userType} />)
    }
    setItems(mappingFunction(appointments))
  }, [appointments, userType])
  
  return (
    <div className={classes.main}>
      <span className={classes.legend}>
        <h2>{userType === 'medic' ? 'Próximos turnos:' : 'Mis turnos:'}</h2>
        <Link to="appointments">Ir a turnos</Link>
      </span>
      { items.length ? <ul>{items}</ul> : <li className={classes.empty}>No hay turnos próximos</li> }
    </div>
  );
};

export default AppointmentsWidget;
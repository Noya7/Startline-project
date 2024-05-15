import Card from './../layout/card/Card'
import {Link} from 'react-router-dom';

import classes from './AppointmentsWidget.module.css';
import WidgetItem from './WidgetItem';

const AppointmentsWidget = ({nextAppointments, userType}) => {

  const mappedItems = nextAppointments?.map(appointment => (
    <WidgetItem key={appointment._id} data={appointment} userType={userType} />
  ));

  const columnCount = mappedItems?.length || 1;
  
  return (
    <Card styling={{ borderRadius: '1rem' }}>
      <div className={classes.main}>
        <span className={classes.legend}>
          <h2>{userType === 'medic' ? 'Próximos turnos:' : 'Mis turnos:'}</h2>
          <Link to="appointments">Ir a turnos</Link>
        </span>
        {mappedItems?.length ? (
          <ul style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}>
            {mappedItems}
          </ul>
        ) : (
          <li className={classes.empty}>No hay turnos próximos</li>
        )}
      </div>
    </Card>
  );
};

export default AppointmentsWidget;
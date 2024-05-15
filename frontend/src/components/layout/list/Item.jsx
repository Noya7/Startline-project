import { Link } from 'react-router-dom'
import { FaEye, FaPencilAlt, FaStar, FaTrashAlt } from 'react-icons/fa';
import classes from './Item.module.css'

const timeIndexes = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];

const getFormattedDate = (date) => {
  return new Date(date).toLocaleDateString('es-AR', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'});
}

const Item = ({ data, type }) => {
  const isPastAppointment = new Date(data.fullDate) < new Date();

  const medicFormat = (
    <>
      <p className={classes.date}>{getFormattedDate(data.fullDate)}</p>
      <span className={classes.medicSpan}>
        <img src={data.medic.image} alt={data.name} />
        <p>{data.medic.name} {data.medic.surname}, {data.area}</p>
      </span>
      <span className={classes.actions}>
        {!isPastAppointment ? (
          <span className={classes.actions}>
            <Link to={`/appointments/${data.id}/detail`}><FaEye /></Link>
            <Link to={`/appointments/${data.id}/rate`}><FaStar /></Link>
          </span>
        ) : (
          <Link to={`/appointments/${data.id}/cancel`}><FaTrashAlt /></Link>
        )}
      </span>
    </>
  )

  const patientFormat = (
    <>
      <p>{timeIndexes[data.timeIndex]}</p>
      <p>{data.name} {data.surname}</p>
      <span>
        <Link to={`edit/${data._id}`}><FaPencilAlt /></Link>
      </span>
    </>
  )

  return (
    <li className={classes[type]}>
        {type === 'medic' ? medicFormat : patientFormat}
    </li>
  );
};

export default Item
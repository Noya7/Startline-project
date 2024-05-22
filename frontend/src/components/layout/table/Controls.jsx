import { useDispatch, useSelector } from 'react-redux';
import classes from './Controls.module.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { getPatientAppointmentsAsync } from '../../../store/patient-thunks';
import { getMedicAppointmentsAsync } from '../../../store/medic-thunks';

const Controls = () => {
  const dispatch = useDispatch();

  const userType = useSelector(state => state.auth.userData.userType);
  const {totalPages, currentPage} = useSelector(state => userType === 'patient' ? state.patient.appointments : state.medic.appointments);

  const handlePageChange = (direction) => {
  const newPage = direction === 'next' ? currentPage + 1 : currentPage - 1;
    if (newPage >= 1 && newPage <= totalPages) dispatch(getPatientAppointmentsAsync(newPage));
  };

  const handleDateChange = (selectedDate) => {
    const date = new Date(selectedDate);
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    dispatch(getMedicAppointmentsAsync(formattedDate));
  };

  return (
      <div className={classes.controls}>
        {userType === 'medic' && (
          <span className={classes.inputs}>
            <label name='date' htmlFor='size'>Fecha:</label>
            <input type="date" onChange={e => handleDateChange(e.target.value)} />
          </span>
        )}
        {userType === 'patient' && (
          <span className={classes.pagination}>
            <button onClick={() => handlePageChange('prev')} disabled={currentPage === 1}>
              <FaChevronLeft />
            </button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <button onClick={() => handlePageChange('next')} disabled={currentPage === totalPages}>
              <FaChevronRight />
            </button>
          </span>
        )}
      </div>
  );
};

export default Controls;
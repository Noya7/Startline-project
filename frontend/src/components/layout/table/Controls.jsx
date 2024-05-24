import { useDispatch, useSelector } from 'react-redux';
import classes from './Controls.module.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { getPatientAppointmentsAsync } from '../../../store/patient-thunks';
import { getMedicAppointmentsAsync } from '../../../store/medic-thunks';
import { useEffect, useState } from 'react';

const Controls = () => {
  const [paginationData, setPaginationData] = useState({currentPage: 1, totalPages: 1})
  const dispatch = useDispatch();
  const userType = useSelector(state => state.auth.userData.userType);
  const patientAppointmentData = useSelector(state => state.patient.appointments);

  useEffect(()=>{
    !!patientAppointmentData && setPaginationData({currentPage: patientAppointmentData.currentPage, totalPages: patientAppointmentData.totalPages})
  },[patientAppointmentData])

  const handlePageChange = (direction) => {
    const newPage = direction === 'next' ? paginationData.currentPage + 1 : paginationData.currentPage - 1;
    if (newPage >= 1 && newPage <= paginationData.totalPages) dispatch(getPatientAppointmentsAsync(newPage));
  };

  return (
      <div className={classes.controls}>
        {userType === 'medic' && (
          <span className={classes.inputs}>
            <label name='date' htmlFor='size'>Fecha:</label>
            <input type="date" onChange={e => dispatch(getMedicAppointmentsAsync(e.target.value)) } />
          </span>
        )}
        {userType === 'patient' && (
          <span className={classes.pagination}>
            <button onClick={() => handlePageChange('prev')} disabled={paginationData.currentPage === 1}>
              <FaChevronLeft />
            </button>
            <span>
              Página {paginationData.currentPage} de {paginationData.totalPages}
            </span>
            <button onClick={() => handlePageChange('next')} disabled={paginationData.currentPage === paginationData.totalPages}>
              <FaChevronRight />
            </button>
          </span>
        )}
      </div>
  );
};

export default Controls;
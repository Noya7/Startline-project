import { useCallback, useEffect, useState } from 'react';
import Controls from './Controls';
import Item from './Item'
import { useDispatch, useSelector } from 'react-redux';
import { getPatientAppointmentsAsync } from '../../../store/patient-thunks';
import { getMedicAppointmentsAsync } from '../../../store/medic-thunks';

import classes from './List.module.css'

const today = new Date();
const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;


const List = ({onSelectAppointment}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState(formattedDate);
  const [items, setItems] = useState([]);

  const dispatch = useDispatch();
  const userType = useSelector((state) => state.auth.userData.userType);
  const listData = useSelector((state) => userType === 'patient' ? state.patient.appointments : state.medic.appointments);

  const itemsMapping = useCallback((data) => {
    return !!data && data.map(item => <Item onSelectAppointment={(obj)=>onSelectAppointment(obj)} key={item._id} data={item} type={userType === 'medic' ? 'patient' : 'medic'} />)
  }, [userType, onSelectAppointment])

  useEffect(()=>{
    setItems(itemsMapping(userType === 'medic' ? listData : listData.appointments));
  }, [listData, itemsMapping, userType])

  useEffect(()=>{
    setItems([])
    userType === 'patient' ?
    dispatch(getPatientAppointmentsAsync(currentPage)) :
    dispatch(getMedicAppointmentsAsync(selectedDate))
  }, [userType, currentPage, selectedDate, dispatch])

  console.log(listData)

  return (
    <div className={classes.main}>
      <Controls type={userType} totalPages={listData?.totalPages || 1} currentPage={currentPage} onPageChange={(page)=>setCurrentPage(page)} onDateChange={(date)=>{setSelectedDate(date)}} />
      <div className={classes.list}>
        <span style={{backgroundColor: userType === 'medic' ? '#990033' : '#005566'}} className={classes.refference}>
          <p>{userType === 'patient' ? 'Fecha' : 'Hora'}</p>
          <p>{userType === 'patient' ? 'Profesional' : 'Paciente'}</p>
          <p>Acciones</p>
        </span>
        <ul className={classes.items}>
          {items.length ? items : <li className={classes.empty}><h2>No hay elementos para mostrar.</h2></li>}
        </ul>
      </div>
    </div>
  )
}

export default List;
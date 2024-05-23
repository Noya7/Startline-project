import { useNavigate, useParams } from 'react-router-dom';
import useResponseToast from '../../hooks/useResponseToast';
import classes from './DeleteAppointment.module.css'
import { useDispatch } from 'react-redux';
import { deleteAppointmentsAsync } from '../../store/patient-thunks';
import { ToastContainer } from 'react-toastify';
import { useState } from 'react';

const DeleteAppointment = () => {
    const [toastData, setToastData] = useState(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {id} = useParams();

    const deleteHandler = async () => {
        const resData = await dispatch(deleteAppointmentsAsync(id))
        setToastData(resData)
        setTimeout(()=>navigate('../'), 1000)
    }

    useResponseToast(toastData)

    return (
        <>
            <div className={classes.main}>
                <h2>Cancelar Turno</h2>
                <p>Cancelar turno? Esta acción es irreversible.</p>
                <span className={classes.buttons} >
                    <button className={classes.cancel} onClick={() => navigate('../')}>Cancelar</button>
                    <button className={classes.deleteButton} onClick={deleteHandler}>Eliminar</button>
                </span>
            </div>
            <ToastContainer />
        </>
    );
}

export default DeleteAppointment;
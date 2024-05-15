import { useNavigate } from 'react-router-dom';
import NewAppointment from '../../../components/appointments/NewAppointment';
import Modal from '../../../components/layout/modal/Modal';

const NewAppointmentModal = () => {
  const navigate = useNavigate();
  const cancelHandler = () => navigate('../')
  return (
    <Modal onClose={cancelHandler}>
        <NewAppointment />
    </Modal>
  );
};  

export default NewAppointmentModal;
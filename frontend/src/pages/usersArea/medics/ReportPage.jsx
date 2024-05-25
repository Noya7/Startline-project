import { useNavigate } from 'react-router-dom';
import MedicalReportForm from '../../../components/forms/medic/MedicalReportForm';
import Modal from '../../../components/layout/modal/Modal';

const ReportPage = () => {
  const navigate = useNavigate()
  return (
    <Modal onClose={() => { localStorage.removeItem('appointment'); navigate('../') }}>
      <MedicalReportForm />
    </Modal>
  );
};

export default ReportPage;
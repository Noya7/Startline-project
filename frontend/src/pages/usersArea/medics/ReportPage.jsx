import { useLoaderData } from 'react-router-dom';
import MedicalReportForm from '../../../components/forms/medic/MedicalReportForm';
import Modal from '../../../components/layout/modal/Modal';
// import classes from './ReportPage.module.css';

const ReportPage = () => {

  const data = useLoaderData()

  return (
    <Modal>
      <MedicalReportForm data={data} />
    </Modal>
  );
};

export default ReportPage;
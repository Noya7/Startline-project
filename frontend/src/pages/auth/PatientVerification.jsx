import PatientVerificationForm from '../../components/forms/auth/PatientVerificationForm'
import Modal from '../../components/layout/modal/Modal'
import {useNavigate} from 'react-router-dom'

const PatientVerificationPage = () => {
    const navigate = useNavigate()

    const closeHandler = () => {
        navigate('../')
    }

  return (
    <Modal onClose={closeHandler}>
      <PatientVerificationForm />
    </Modal>
  )
}

export default PatientVerificationPage;
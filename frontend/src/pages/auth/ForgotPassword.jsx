import ForgotPassForm from '../../components/forms/auth/ForgotPassForm'
import Modal from '../../components/layout/modal/Modal'
import {useNavigate} from 'react-router-dom'

const ForgotPasswordPage = () => {
    const navigate = useNavigate()

    const closeHandler = () => {
        navigate('../')
    }

    return (
      <Modal onClose={closeHandler}>
        <ForgotPassForm/>
      </Modal>
    )
}

export default ForgotPasswordPage;
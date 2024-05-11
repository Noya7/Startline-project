import {useLoaderData, useNavigate} from 'react-router-dom'
import Modal from "../../components/layout/modal/Modal"
import ResetPassForm from '../../components/forms/auth/ResetPassForm'

const ResetPasswordPage = () => {
    const resetData = useLoaderData()
    const navigate = useNavigate()

    const closeHandler = () => {
        navigate('../')
    }

    return (
      <Modal onClose={closeHandler}>
        <ResetPassForm data={resetData}/>
      </Modal>
    )
}

export default ResetPasswordPage;
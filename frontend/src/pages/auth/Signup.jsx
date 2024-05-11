import SignupForm from '../../components/forms/auth/SignupForm'
import Modal from '../../components/layout/modal/Modal'
import {useNavigate, useParams} from 'react-router-dom'

const SignupPage = () => {
    const navigate = useNavigate()
    const {usertype} = useParams();

    const closeHandler = () => {
        navigate('../')
    }

  return (
    <Modal onClose={closeHandler}>
      <SignupForm userType={usertype} />
    </Modal>
  )
}

export default SignupPage;
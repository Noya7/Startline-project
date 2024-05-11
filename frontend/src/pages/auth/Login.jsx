import LoginForm from '../../components/forms/auth/LoginForm'
import Modal from '../../components/layout/modal/Modal'
import {useNavigate} from 'react-router-dom'

const LoginPage = () => {
  const navigate = useNavigate()

  const closeHandler = () => {
      navigate('../')
  }

  return (
    <Modal onClose={closeHandler}>
      <LoginForm />
    </Modal>
  )
}

export default LoginPage;
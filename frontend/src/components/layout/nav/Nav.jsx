import { useLocation, useNavigate } from 'react-router-dom'
import {FaHome, FaCalendarAlt, FaSignOutAlt} from 'react-icons/fa'
import classes from './Nav.module.css'
import { useDispatch } from 'react-redux'
import { logoutAsync } from '../../../store/auth-thunks'

const Nav = ({userType, menuIsOpen}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className={`${classes.drawerClosed} ${menuIsOpen ? classes.drawerOpen : ''}`}>
        <button onClick={() => navigate(`/portal/${userType}`)} className={`${classes.navButton} ${location.pathname === `/portal/${userType}` ? classes[userType] : ''}`}><FaHome /></button>
        {userType !== 'admin' && <button onClick={() => navigate(`/portal/${userType}/appointments`)} className={`${classes.navButton} ${location.pathname === `/portal/${userType}/appointments` ? classes[userType] : ''}`}><FaCalendarAlt /></button>}
        <button onClick={()=>{dispatch(logoutAsync()); return navigate('/')}} className={`${classes.navButton} ${classes.logout}`}><FaSignOutAlt /></button>
    </nav>
  )
}

export default Nav
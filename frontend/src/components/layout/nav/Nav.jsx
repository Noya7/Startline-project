import { Link, useNavigate } from 'react-router-dom'
import {FaHome, FaCalendarAlt, FaSignOutAlt} from 'react-icons/fa'
import classes from './Nav.module.css'
import { useDispatch } from 'react-redux'
import { logoutAsync } from '../../../store/auth-thunks'

const Nav = ({userType, menuIsOpen}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  return (
    <nav className={`${classes.drawerClosed} ${menuIsOpen ? classes.drawerOpen : ''}`}>
        <Link to={`/portal/${userType}`} className={classes.navButton}><FaHome /></Link>
        {userType !== 'admin' && <Link to={`/portal/${userType}/appointments`} className={classes.navButton}><FaCalendarAlt /></Link>}
        <Link onClick={()=>{dispatch(logoutAsync()); return navigate('/')}} className={`${classes.navButton} ${classes.logout}`}><FaSignOutAlt /></Link>

    </nav>
  )
}

export default Nav
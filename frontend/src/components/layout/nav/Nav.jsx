import { Link } from 'react-router-dom'
import {FaHome, FaCalendarAlt, FaCog, FaSignOutAlt} from 'react-icons/fa'
import classes from './Nav.module.css'

const Nav = ({userType, menuIsOpen}) => {
  return (
    <nav className={`${classes.drawerClosed} ${menuIsOpen ? classes.drawerOpen : ''}`}>
        <Link to={`/portal/${userType}`} className={classes.navButton}><FaHome /></Link>
        {userType !== 'admin' && <Link to={`/portal/${userType}/appointments`} className={classes.navButton}><FaCalendarAlt /></Link>}
        <Link to={`/portal/${userType}/config`} className={classes.navButton}><FaCog /></Link>
        <Link to={`/portal/${userType}/logout`} className={`${classes.navButton} ${classes.logout}`}><FaSignOutAlt /></Link>

    </nav>
  )
}

export default Nav
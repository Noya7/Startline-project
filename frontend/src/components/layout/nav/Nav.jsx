import { useLocation, useNavigate } from 'react-router-dom'
import {FaHome, FaCalendarAlt, FaSignOutAlt} from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { logoutAsync } from '../../../store/auth-thunks'

import classes from './Nav.module.css'

const Nav = ({userType, menuIsOpen, onNavigation}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const location = useLocation()

  const navHandler = (page) => {
    switch (page){
      case 'main' : {onNavigation(); return navigate(`/portal/${userType}`)};
      case 'app' : {onNavigation(); return navigate(`/portal/${userType}/appointments`)};
      default : {dispatch(logoutAsync()); onNavigation(); return navigate('/')};
    };
  }

  return (
    <nav className={`${classes.drawerClosed} ${menuIsOpen ? classes.drawerOpen : ''}`}>
        <button onClick={()=>navHandler('main')} className={`${classes.navButton} ${location.pathname === `/portal/${userType}` ? classes[userType] : ''}`}><FaHome /></button>
        {userType !== 'admin' && <button onClick={()=>navHandler('app')} className={`${classes.navButton} ${location.pathname === `/portal/${userType}/appointments` ? classes[userType] : ''}`}><FaCalendarAlt /></button>}
        <button onClick={navHandler} className={`${classes.navButton} ${classes.logout}`}><FaSignOutAlt /></button>
    </nav>
  )
}

export default Nav
import { Link, useNavigate } from 'react-router-dom';
import {useSelector} from 'react-redux'
import { useState } from 'react';
import {FaBars, FaPhone, FaFacebook, FaLinkedin, FaInstagram} from 'react-icons/fa'
import Nav from '../nav/Nav';

import classes from './Header.module.css';

const Header = ({dashboardMode}) => {
  const[menuIsOpen, setMenuIsOpen] = useState(false)
  const userData = useSelector((store)=>store.auth.userData)

  const navigate = useNavigate();
  
  if (dashboardMode) return (
    <div className={classes.dashboardContainer}>
      <header className={classes.authMain}>
        <div className={`${classes.dashBoardMain}`}>
          <Link to={'/'} className={`${classes.title}`}>StartLine Clinic</Link>
          <button onClick={()=>setMenuIsOpen(!menuIsOpen)} className={`${classes.menuButton} ${menuIsOpen ? classes.open : ''}`}>
            <FaBars />
          </button>
        </div>
      </header>
      <Nav userType={userData.userType} menuIsOpen={menuIsOpen} onNavigation={()=>setMenuIsOpen(false)} />
    </div>
  );

  return (
    <header className={classes.homeMain}>
      <div className={classes.upperHeader}>
        <Link to={"/"} className={classes.homeTitle}>StartLine Clinic</Link>
        <span className={classes.homeOptions}>
          <button onClick={()=> navigate("new-appointment")}>Turnos Online</button>
          <button onClick={()=> navigate("auth/login")}>{userData ? 'Volver a Sesion' : 'Iniciar Sesion'}</button>
        </span>
      </div>
      <nav className={classes.lowerHeader}>
        <a className={classes.location} href="https://www.google.com/maps?q=Independencia+757+-+Córdoba" target="_blank">Independencia 757 - Córdoba</a>
        <span className={classes.icons}>
          <a href="tel: 08105552553" target="_blank"><FaPhone /></a>
          <a href="https://es-la.facebook.com/SanatorioAllende/" target="_blank"><FaFacebook /></a>
          <a href="https://ar.linkedin.com/company/sanatorio-allende-s.a" target="_blank"><FaLinkedin /></a>
          <a href="https://www.instagram.com/sanatorio_allende/" target="_blank"><FaInstagram /></a>
        </span>
      </nav>
    </header>
  );
  
}

export default Header
import Card from '../card/Card';
import { Link } from 'react-router-dom';
import classes from './Header.module.css';
import {useSelector} from 'react-redux'
import { useState } from 'react';
import {FaBars, FaPhone, FaFacebook, FaLinkedin, FaInstagram} from 'react-icons/fa'
import Nav from '../nav/Nav';

const Header = ({dashboardMode}) => {
  const[menuIsOpen, setMenuIsOpen] = useState(false)
  const userData = useSelector((store)=>store.auth.userData)

  console.log(userData)

  if (dashboardMode) return (
    <div className={classes.dashboardContainer}>
      <Card element='header' styling={{borderRadius: '2rem'}}>
        <div className={`${classes.dashBoardMain}`}>
          <Link to={'/'} className={`${classes.title}`}>StartLine Clinic</Link>
          <button onClick={()=>setMenuIsOpen(!menuIsOpen)} className={`${classes.menuButton} ${menuIsOpen ? classes.open : ''}`}>
            <FaBars />
          </button>
        </div>
      </Card>
      <Nav userType={userData.userType} menuIsOpen={menuIsOpen} />
    </div>
  );

  return (
    <header className={classes.homeMain}>
      <div className={classes.upperHeader}>
        <Link to={"/"} className={classes.homeTitle}>StartLine Clinic</Link>
        <span>
          <Link to={"new-appointment"}>Turnos Online</Link>
          <Link to={"auth/login"}>{userData ? 'Volver a Sesion' : 'Iniciar Sesion'}</Link>
        </span>
      </div>
      <nav className={classes.lowerHeader}>
        <a className={classes.location} href="https://www.google.com/maps?q=Independencia+757+-+Córdoba" target="_blank">Independencia 757 - Córdoba</a>
        <span className={classes.icons}>
          <a href="tel: 08105552553"><FaPhone /></a>
          <a href="https://es-la.facebook.com/SanatorioAllende/"><FaFacebook /></a>
          <a href="https://ar.linkedin.com/company/sanatorio-allende-s.a"><FaLinkedin /></a>
          <a href="https://www.instagram.com/sanatorio_allende/"><FaInstagram /></a>
        </span>
      </nav>
    </header>
  );
  
}

export default Header
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import UserOptions from './UserOptions';
import classes from './Header.module.css';

const Header = ({type}) => {
  if (type === "dashboard")
    return (
      <header
        className={`${classes.dashBoardMain} ${classes.glass} ${classes.medic}`}
      >
        <h1 className={`${classes.title}`}>StartLine Clinic</h1>
        <SearchBar />
        <UserOptions />
      </header>
    );

  return (
    <header className={classes.homeMain}>
      <div className={classes.upperHeader}>
        <h1>StartLine Clinic</h1>
        <span>
          <Link to={"turnos"}>Turnos Online</Link>
          <Link to={"login"}>Iniciar Sesion</Link>
        </span>
      </div>
      <nav>
        <a className={classes.location} href="https://www.google.com/maps?q=Independencia+757+-+Córdoba" target="_blank">Independencia 757 - Córdoba</a>
        <span>
          <a href="tel: 08105552553">tel</a>
          <a href="https://es-la.facebook.com/SanatorioAllende/">fb</a>
          <a href="https://ar.linkedin.com/company/sanatorio-allende-s.a">in</a>
          <a href="https://www.instagram.com/sanatorio_allende/">ig</a>
        </span>
      </nav>
    </header>
  );
  
}

export default Header
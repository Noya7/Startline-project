import classes from './Header.module.css';
import SearchBar from './SearchBar';
import UserOptions from './UserOptions';

const Header = () => {
  return (
    <header className={`${classes.main} ${classes.medic}`}>
        <h1 className={`${classes.title}`}>StartLine Clinic</h1>
        <SearchBar />
        <UserOptions />
    </header>
  )
}

export default Header
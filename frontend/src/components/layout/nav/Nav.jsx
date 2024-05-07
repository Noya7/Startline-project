import { Link } from 'react-router-dom'
import classes from './Nav.module.css'

const Nav = () => {
  return (
    <nav className={`${classes.main} ${classes.medic}`}>
        <Link>1</Link>
        <Link>1</Link>
        <Link>1</Link>
    </nav>
  )
}

export default Nav
import { Link } from 'react-router-dom'
import classes from './Item.module.css'

const Item = ({data, type}) => {
  return (
    <li className={classes.item}>
        <p>{data.time}</p>
        <p>{data.name}</p>
        <Link to={`${data.id}`}>abrir</Link>
    </li>
  )
}

export default Item
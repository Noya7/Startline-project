import classes from './Card.module.css'

const Card = ({children}) => {
  return (
    <div className={`${classes.card} ${classes.medic}`}>{children}</div>
  )
}

export default Card;
import classes from './Card.module.css'

const Card = ({children, element, styling}) => {

  switch (element) {
    case 'header':
      return <header style={styling} className={`${classes.card} ${classes.light}`}>{children}</header>
    case 'li':
      return <li style={styling} className={`${classes.card} ${classes.light}`}>{children}</li>
    default:
      return <div style={styling} className={`${classes.card} ${classes.light}`}>{children}</div>
  }
}

export default Card;
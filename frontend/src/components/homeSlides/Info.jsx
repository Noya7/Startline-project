import {Link} from 'react-router-dom'
import classes from './Info.module.css'

export const Info = ({ backgroundImage, title, description, buttonText, buttonLink }) => {
    const mainStyle = {
        backgroundImage: `url(${backgroundImage})`
    };

    return (
        <div className={classes.main} style={mainStyle}>
          <div className={classes.textGrid}>
            <h2>{title}</h2>
            <span>
                <p>{description}</p>
                <Link to={buttonLink} className={classes.button}>{buttonText}</Link>
            </span>
          </div>
        </div>
    );
}

export default Info;
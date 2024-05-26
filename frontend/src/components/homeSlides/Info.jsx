import classes from './Info.module.css'

const Info = ({ backgroundImage, title, description}) => {
    const mainStyle = {
        backgroundImage: `url(${backgroundImage})`
    };

    return (
        <div className={classes.main} style={mainStyle}>
          <div className={classes.textGrid}>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
        </div>
    );
}

export default Info;
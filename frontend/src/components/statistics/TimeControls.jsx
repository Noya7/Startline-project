import Card from '../layout/card/Card';
import classes from './TimeControls.module.css';

const TimeControls = ({onSelect}) => {
  return (
    <Card styling={{borderRadius: "1rem"}}>
        <div className={classes.main}>
            <h2>Mis Estadísticas</h2>
            <span className={classes.controls}>
                <button onClick={()=>onselect('week')} className={classes.button}>semanales</button>
                <button onClick={()=>onselect('month')} className={classes.button}>mensuales</button>
                <button onClick={()=>onselect('year')} className={classes.button}>anuales</button>
            </span>
        </div>
    </Card>
  );
};

export default TimeControls;
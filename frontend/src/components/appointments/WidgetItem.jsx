import classes from './WidgetItem.module.css';
import Card from '../layout/card/Card';

const WidgetItem = ({ data, userType }) => {
    const date = new Date(data.fullDate);
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    const formattedDate = date.toLocaleString('es-ES', options);

    return (
        <Card element='li' styling={{ borderRadius: '1rem', boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)' }}>
            <div className={`${classes.item} ${classes[userType]}`}>
                <h2>{formattedDate}</h2>
                {userType === 'patient' ? (
                <>
                    <p>{data.medic.name} {data.medic.surname}</p>
                    <p className={classes.area}>Área: {data.area}</p>
                </>
                ) : (
                <>
                    <p>{data.name} {data.surname}</p>
                    <p className={classes.dni}>DNI: {data.DNI}</p>
                </>
                )}
            </div>
        </Card>
    );
};


export default WidgetItem;
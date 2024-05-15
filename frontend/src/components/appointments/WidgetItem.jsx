import classes from './WidgetItem.module.css';

const WidgetItem = ({ data, userType }) => {
    const date = new Date(data.fullDate);
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    const formattedDate = date.toLocaleString('es-ES', options);

    return (
        <li className={`${classes.item} ${classes[userType]}`}>
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
        </li>
    );
};


export default WidgetItem;
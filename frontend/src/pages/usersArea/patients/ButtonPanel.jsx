import { useNavigate } from 'react-router-dom';
import Card from '../../../components/layout/card/Card';
import classes from './ButtonPanel.module.css';

const ButtonPanel = () => {
    const navigate = useNavigate()

  return (
    <Card styling={{ borderRadius: '1rem' }}>
      <div className={classes.main}>
        <h2>Panel de Acciones:</h2>
        <span className={classes.buttons}>
          <button onClick={()=>navigate("new-appointment")} className={classes.button}>
            Programar un Turno
          </button>
        </span>
      </div>
    </Card>
  );
};

export default ButtonPanel;
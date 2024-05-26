import { useNavigate } from 'react-router-dom';
import classes from './ButtonPanel.module.css';

const ButtonPanel = () => {
    const navigate = useNavigate()

  return (
    <span className={classes.buttons}>
      <button onClick={()=>navigate("new-appointment")} className={classes.button}>
        Programar un nuevo Turno
      </button>
    </span>
  );
};

export default ButtonPanel;
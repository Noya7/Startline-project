import { useNavigate } from 'react-router-dom';
import Card from '../../../components/layout/card/Card';
import classes from './ButtonPanel.module.css';
import { useState } from 'react';

const ButtonPanel = () => {
    const [medicalHistory, setMedicalHistory] = useState(null)
    const navigate = useNavigate()

    // const medicalHistory = null;

  return (
    <Card styling={{ borderRadius: '1rem' }}>
      <div className={classes.main}>
        <h2>Panel de Acciones:</h2>
        <span className={classes.buttons}>
          <button onClick={()=>navigate("new-appointment")} className={classes.button}>
            Programar un Turno
          </button>
          {!medicalHistory && (
            <button onClick={()=>setMedicalHistory('http://google.com')} className={classes.button}>Solicita tu Historia Médica</button>
          )}
          {medicalHistory && (
            <a href={medicalHistory} target='blank' className={classes.button}>
              Descargar Historia Médica
            </a>
          )}
        </span>
      </div>
    </Card>
  );
};

export default ButtonPanel;
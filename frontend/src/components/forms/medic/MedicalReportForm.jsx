import { Form } from 'react-router-dom';
import classes from './MedicalReportForm.module.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getReportAsync } from '../../../store/medic-thunks';
import { getPatientReportAsync } from '../../../store/patient-thunks';

const MedicalReportForm = ({data, readOnly}) => {
    const [formData, setFormData] = useState(data?.app || null);
    const dispatch = useDispatch();
    const existingReportState = useSelector(state => state.medic.report)
    const existingPatientReportState = useSelector(state => state.patient.report)
    const userType = useSelector(state => state.auth.userData.userType)

    useEffect(()=>{
        if (!!data && !!data.app) setFormData(data.app);
        if(!!data && !!data.rep) dispatch( userType === 'medic' ? getReportAsync(data.rep) : getPatientReportAsync(data.rep))
    }, [data, dispatch, userType])
    
    console.log(existingPatientReportState)

    return (
      <div className={classes.main}>
          <h2>Reporte Médico</h2>
          {(formData || existingReportState || existingPatientReportState) ? <Form method='post' className={classes.form}>
            {(formData )&&
             <>
                <input type="text" name="appointment" hidden readOnly value={formData[0]}/>
                <input type="text" name="DNI" hidden readOnly value={formData[1]}/>
                {!!formData[2] && <input type="text" name="patient" hidden readOnly value={formData[2]}/>}
                <input type="text" name="type" hidden readOnly value='create'/>
            </>
            }

              {!!existingReportState && <input type="text" name="report" hidden readOnly value={existingReportState._id}/>}
              {!!existingReportState && <input type="text" name="type" hidden readOnly value='edit'/>}

              <label hidden={readOnly} htmlFor="date">Fecha:</label>
              <input hidden={readOnly} type="date" name="date" id='date' required/>
    
              <label htmlFor="motive">Motivo de Consulta:</label>
              <textarea readOnly={readOnly} defaultValue={(existingReportState?.motiveForConsultation || existingPatientReportState.motiveForConsultation) || ''} type="text" id="motive" name="motive" required />
    
              <label htmlFor="diagnosis">Diagnóstico:</label>
              <textarea readOnly={readOnly} defaultValue={(existingReportState?.diagnosis || existingPatientReportState.diagnosis) || ''} type="text" id="diagnosis" name="diagnosis" required />
    
              <label htmlFor="treatment">Tratamiento:</label>
              <textarea readOnly={readOnly} defaultValue={(existingReportState?.treatment || existingPatientReportState.treatment) || ''} type="text" id="treatment" name="treatment" required />
    
              <label htmlFor="observations">Observaciones:</label>
              <textarea readOnly={readOnly} defaultValue={(existingReportState?.observations || existingPatientReportState.observations) || ''} type="text" id="observations" name="observations" />
    
              {!readOnly && <button type="submit">Enviar</button>}
          </Form> : <div className={classes.overlay}><p>Selecciona un turno para crear o leer un reporte</p></div>}
      </div>
    );
};

export default MedicalReportForm;
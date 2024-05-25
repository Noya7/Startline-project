import { Form, useActionData, useLoaderData } from 'react-router-dom';
import classes from './MedicalReportForm.module.css';
import { useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import useResponseToast from '../../../hooks/useResponseToast';

let today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0');
let yyyy = today.getFullYear();
today = yyyy + '-' + mm + '-' + dd;

const MedicalReportForm = () => {
  const [formIsValid, setFormIsValid] = useState(false)
  const userType = useSelector(state => state.auth.userData.userType)
  const reportData = useLoaderData();
  const responseData = useActionData()
  const readOnly = userType === 'patient'

  const fields = useMemo( () => ({
    motive: reportData.rep?.motiveForConsultation.length > 6 || false,
    diagnosis: reportData.rep?.diagnosis.length > 6 || false,
    treatment: reportData.rep?.treatment.length > 6 || false,
  }), [reportData] )

  const [fieldValidation, setFieldValidation] = useState(fields)

  //validation and response : 

  const handleFieldValidation = (e) => {
    setFieldValidation(prev => ({ ...prev, [e.target.name]: e.target.value.trim().length > 6 }) );
  }
  useEffect(()=>{
    const allFieldsValid = Object.values(fieldValidation).every(field => !!field);
    setFormIsValid(allFieldsValid);
  },[fieldValidation])

  useResponseToast(responseData)
  return (
    <>
      <div className={classes.main}>
          <h2>Reporte Médico</h2>
          <Form method='post' className={classes.form}>
            {reportData.app &&
             <>
                  <input type="text" name="appointment" hidden readOnly value={reportData.app[0]}/>
                  <input type="text" name="DNI" hidden readOnly value={reportData.app[1]}/>
                  {!!reportData.app[2] && <input type="text" name="patient" hidden readOnly value={reportData.app[2]}/>}
                  <input type="text" name="type" hidden readOnly value='create'/>
            </>
            }
            {!!reportData.rep && <input type="text" name="report" hidden readOnly value={reportData.rep._id}/>}
            {!!reportData.rep && <input type="text" name="type" hidden readOnly value='edit'/>}
            {<input type="date" value={today}  hidden required readOnly name="date" id='date'/>}
          
            <label htmlFor="motive">Motivo de Consulta:</label>
            <textarea readOnly={readOnly} onChange={(e)=>handleFieldValidation(e)} defaultValue={reportData.rep?.motiveForConsultation || ''} type="text" id="motive" name="motive" required />
          
            <label htmlFor="diagnosis">Diagnóstico:</label>
            <textarea readOnly={readOnly} onChange={(e)=>handleFieldValidation(e)} defaultValue={reportData.rep?.diagnosis || ''} type="text" id="diagnosis" name="diagnosis" required />
          
            <label htmlFor="treatment">Tratamiento:</label>
            <textarea readOnly={readOnly} onChange={(e)=>handleFieldValidation(e)} defaultValue={reportData.rep?.treatment || ''} type="text" id="treatment" name="treatment" required />
          
            <label htmlFor="observations">Observaciones:</label>
            <textarea readOnly={readOnly} defaultValue={reportData.rep?.observations || ''} type="text" id="observations" name="observations" />
          
            {!readOnly && <button disabled={!formIsValid} type="submit">Guardar</button>}
          </Form>
      <ToastContainer />
      </div>
    </>
  );
};

export default MedicalReportForm;
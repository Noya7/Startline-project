import { useEffect, useState } from 'react'
import classes from './TextInput.module.css'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const dniRegex = /^[0-9]{8}$/
const passwordRegex = /^(?=.*[a-zA-ZñÑ])(?=.*\d)(?=.*[@$!%*?&])[A-Za-zñÑ\d@$!%*?&]{8,32}$/

const TextInput = ({ name, type, placeholder, onValidation, value }) => {
  const [fieldIsValid, setFieldIsValid] = useState(false);
  const [fieldWasTouched, setFieldWasTouched] = useState(false);

  const validate = (value) => {
      switch (type) {
          case 'text': return value.trim().length > 3 && value.trim().length <= 32;
          case 'name': case 'surname': return value.trim().length > 3 && value.trim().length <= 24;
          case 'email': return emailRegex.test(value);
          case 'DNI': return dniRegex.test(value);
          case 'signup_password': return passwordRegex.test(value);
          default: return true;
      }
  };

  const changeHandler = (e) => {
    const value = e.target.value;
    setFieldIsValid(validate(value));
  };

  useEffect(() => {
    if(onValidation) onValidation(fieldIsValid);
  }, [fieldIsValid])

  useEffect(() => {
    if (value) {
      setFieldIsValid(validate(value));
    }
  }, [value]);
  
  return (
    <input
      required
      name={name}
      className={`${classes.input} ${!!fieldWasTouched && !fieldIsValid && classes.invalid}`}
      type={type === 'signup_password' ? 'password' : type ==='DNI' ? 'number' : type}
      placeholder={placeholder}
      onBlur={()=>setFieldWasTouched(true)}
      onChange={changeHandler}
      defaultValue={value || ''} // Establecer el valor inicial del input
      readOnly={!!value}
    />
  );
};

export default TextInput
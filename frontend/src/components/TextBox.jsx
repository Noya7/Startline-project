import strings from '../text/home';
import classes from './TextBox.module.css';

const TextBox = () => {
  return (
    <div className={classes.main}>
        <h1>StartLine Clinic</h1>
        <p>{strings.TEXTBOX_PARAGRAPH}</p>
    </div>
  )
}

export default TextBox
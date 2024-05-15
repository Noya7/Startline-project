import { Form } from 'react-router-dom';
import Card from '../../layout/card/Card';
import classes from './SearchBar.module.css';
import TextInput from '../input/TextInput';
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = () => {
    const [inputIsValid, setInputIsValid] = useState(false);

  return (
    <Card styling={{borderRadius: '1rem'}}>
        <Form>
            <div className={classes.container}>
                <TextInput type="text" name='query' onValidation={(isValid)=>setInputIsValid(isValid)} placeholder="Buscar médico" />
                <button disabled={!inputIsValid} type="submit"><FaSearch /></button>
            </div>
        </Form>
    </Card>
  );
};

export default SearchBar;
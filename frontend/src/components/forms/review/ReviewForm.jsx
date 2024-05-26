import { Form, useActionData, useLoaderData } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import useResponseToast from '../../../hooks/useResponseToast';
import { FaStar } from 'react-icons/fa';
import classes from './ReviewForm.module.css';
import { useState } from 'react';

const points = [1, 2, 3, 4, 5];

const ReviewForm = () => {
    const [selectedRating, setSelectedRating] = useState(null)
    const appData = useLoaderData()
    const responseData = useActionData();

    useResponseToast(responseData)
    return (
        <>
            <div className={classes.main}>
              <h2>Revisión de Turno</h2>
              <Form method='post' className={classes.form}>
                <input type='text' hidden required readOnly name='appointment' value={appData.appId} />
                <input type='text' hidden required readOnly name='reviewedMedic' value={appData.medicId} />
                <label htmlFor="rating">Calificación</label>
                <span className={classes.ratings}>
                    {points.map((point) => (
                        <label key={point} className={classes.ratingLabel}>
                            <input hidden type="radio" name="rating" value={point} onClick={()=>setSelectedRating(point)} required />
                            <FaStar className={selectedRating >= point ? classes.ratingIconOn : classes.ratingIcon} />
                      </label>
                    ))}
                </span>
                <label htmlFor="review">Reseña</label>
                <textarea id="review" name="review" required />
                <button type="submit">Enviar</button>
              </Form>
            </div>
          <ToastContainer />
        </>
    );
};

export default ReviewForm;
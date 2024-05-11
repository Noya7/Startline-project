import { useState } from 'react'
import classes from './ImageInput.module.css'

const ImageInput = () => {
    const [image, setImage] = useState();

    const handleImageChange = (e) => {
      if(e.target.files.length){
        const file = e.target.files[0];
        setImage(URL.createObjectURL(file));
      }
    };

    return (
      <div className={classes.main}>
          <div className={classes.selection}>
            <label htmlFor='image'>Elige una imagen de perfil:</label>
            <input required type='file' name='image' id='image' onChange={handleImageChange} accept='image/jpeg, image/jpg, image/png' multiple={false} />
          </div>
          <div className={classes.image}>
            {image && <img src={image} alt="Profile" />}
          </div>
      </div>
    )
}

export default ImageInput
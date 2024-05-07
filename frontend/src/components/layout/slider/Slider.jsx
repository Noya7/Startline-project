import { useCallback, useEffect, useState } from 'react';
import classes from './Slider.module.css'

const Slider = ({ children }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slideHandler = useCallback(value =>{
      if(value === 'next') setCurrentSlide((prevSlide) => (prevSlide + 1) % children.length);
      else setCurrentSlide((prevSlide) => (prevSlide - 1 + children.length) % children.length);
    }, [children.length])

    useEffect(() => {
      const intervalId = setInterval(() => {
        if (children.length > 1) {
          slideHandler('next');
        }
      }, 5000);
  
      return () => clearInterval(intervalId);
    }, [currentSlide, children.length, slideHandler]);
  
    return (
        <div className={classes.main}>
            <div className={classes.slides} style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {children}
            </div>
            {children.length > 1 && <span className={classes.buttons}>
                <button onClick={() => slideHandler('prev')}>{`<`}</button>
                <button onClick={() => slideHandler('next')}>{`>`}</button>
            </span>}
      </div>
    );
  };
  
  export default Slider;
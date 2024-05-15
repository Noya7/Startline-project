import classes from './Controls.module.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Controls = ({ type, onPageChange, currentPage, totalPages, onDateChange }) => {
    const handlePageChange = (direction) => {
      const newPage = direction === 'next' ? currentPage + 1 : currentPage - 1;
      if (newPage >= 1 && newPage <= totalPages) {
        onPageChange(newPage);
      }
    };
  
    return (
        <div className={classes.controls}>
          {type === 'medic' && (
            <span className={classes.inputs}>
              <label name='date' htmlFor='size'>Fecha:</label>
              <input type="date" onChange={e => onDateChange(e.target.value)} />
            </span>
          )}
          {type === 'patient' && (
            <span className={classes.pagination}>
              <button onClick={() => handlePageChange('prev')} disabled={currentPage === 1}>
                <FaChevronLeft />
              </button>
              <span>
                Página {currentPage} de {totalPages}
              </span>
              <button onClick={() => handlePageChange('next')} disabled={currentPage === totalPages}>
                <FaChevronRight />
              </button>
            </span>
          )}
        </div>
    );
  };

export default Controls;
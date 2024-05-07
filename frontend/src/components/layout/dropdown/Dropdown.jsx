import { useEffect, useRef, useState } from 'react';
import classes from './Dropdown.module.css'

const Dropdown = ({button, empty="No hay elementos para mostrar.", styling, children}) => {
    const [buttonIsHovered, setButtonIsHovered] = useState(false)
    const [open, setOpen] = useState(false)
    const buttonRef = useRef()
    const dropdownRef = useRef()
    useEffect(() => {
      const handleClickOutside = (event) => {
        if(!dropdownRef.current.contains(event.target) && !buttonRef.current.contains(event.target)){
          setOpen(false)
        }
      };
      if(open){
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }
    }, [open]);
    
    return (
      <>
        <button
          ref={buttonRef}
          onClick={()=>{setOpen(!open)}}
          onMouseEnter={() => setButtonIsHovered(true)}
          onMouseLeave={() => setButtonIsHovered(false)}
          style={!buttonIsHovered ? { ...styling.button.global, ...styling.button.notHovered } : { ...styling.button.global, ...styling.button.hovered }}
          className={classes.button}
        >
          {button}
        </button>
        <ul ref={dropdownRef} style={{ ...styling.dropdown, display: open ? "block" : "none" }} className={classes.dropdown}>
          {children && children.length > 0 ? (
            children
          ) : (
            <li className={classes.empty}>{empty}</li>
          )}
        </ul>
      </>
    );
}

export default Dropdown;
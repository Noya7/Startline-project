import { useState } from 'react';
import Card from '../layout/card/Card';
import classes from './Calendar.module.css';

const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const Calendar = ({onDateSelection}) => {
    const [date, setDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const startingDay = firstDayOfMonth.getDay();

    const totalDays = lastDayOfMonth.getDate();

    const prevMonth = () => setDate(new Date(currentYear, currentMonth - 1, 1));
    const nextMonth = () => setDate(new Date(currentYear, currentMonth + 1, 1));

    const daysInMonth = new Array(totalDays).fill(null)

    const handleDateClick = (day) => {
        const date = new Date(currentYear, currentMonth, day)
        setSelectedDate(date);
        onDateSelection(date);
    };

    return (
        <Card>
            <div className={classes.calendar}>
                <div className={classes.header}>
                    <button onClick={prevMonth}>&lt;</button>
                    <h2>{`${currentYear}-${currentMonth + 1}`}</h2>
                    <button onClick={nextMonth}>&gt;</button>
                </div>
                <span className={classes.daysOfWeek}>
                    {daysOfWeek.map(day => (
                        <div key={day}><p>{day}</p></div>
                    ))}
                </span>
                <div className={classes.days}>
                    {(startingDay-1 > 0) && new Array(startingDay-1).fill(null).map((el, i) => <div key={`el${i}`}></div>)}
                    {daysInMonth.map((el, i) => <div className={`${classes.day} ${selectedDate && i+1 === selectedDate.getDate() ? classes.selected : ''}`} key={`d${i+1}`} onClick={() => handleDateClick(i+1)}>{i+1}</div>)}
                </div>
            </div>
        </Card>
      );
    };

export default Calendar;
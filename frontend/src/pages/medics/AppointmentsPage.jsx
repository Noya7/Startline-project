import Calendar from '../../components/appointments/Calendar'
// import List from '../../components/appointments/List'
import List from '../../components/layout/list/List'
import classes from './AppointmentsPage.module.css'

const testArray = [
  {time: '12:45', name: 'valentin noya montero', report: 'aa22bb55cc99', id: 12},
  {time: '13:45', name: 'Carlos Caglianone', report: 'aa22bb55cc98', id: 23},
  {time: '18:45', name: 'Santiago Carlos', report: 'aa22bb55cc97', id: 34},
  {time: '14:45', name: 'Ary Pagura', report: 'aa22bb55cc96', id: 45},
]


const AppointmentsPage = () => {
  return (
    <div className={classes.main}>
      <List data={testArray} >
        <h2>Hora</h2>
        <h2>Paciente</h2>
      </List>
        {/* <List /> */}
        <div className={classes.calendar}>
          <Calendar onDateSelection={(x)=>console.log(x)} />
        </div>
    </div>
  )
}

export default AppointmentsPage
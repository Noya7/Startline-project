import {useTable} from 'react-table'
import {Link} from 'react-router-dom'
import { FaEye, FaPencilAlt, FaStar, FaTrashAlt } from 'react-icons/fa';
import { useMemo } from 'react'
import { useSelector } from 'react-redux';
import Controls from './Controls';
import classes from './Table.module.css'

const timeIndexes = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];

const getFormattedDate = (date) => {
    return new Date(date).toLocaleDateString('es-AR', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: 'UTC', hour12: false});
}

const Table = () => {
    const userType = useSelector(state => state.auth.userData.userType)
    const listData = useSelector((state) => userType === 'patient' ? state.patient.appointments?.appointments : state.medic.appointments);

    const columns = useMemo( () => {
        if (userType === 'medic') return [
            {Header: 'Hora', Cell: ({row}) => timeIndexes[row.original.timeIndex]},
            {Header: 'Paciente', Cell: ({row}) => `${row.original.name} ${row.original.surname}`},
            {Header: 'Acciones', Cell: ({row}) => {
                let isPastAppointment;
                const currentDate = new Date().toISOString().split('T')[0];
                const rowDate = new Date(row.original.date).toISOString().split('T')[0];
                const isPastDate = rowDate < currentDate;
                const parsedCurrentHour = new Date().getHours()*100 + new Date().getMinutes()
                const parsedRowHour = parseInt(timeIndexes[row.original.timeIndex].split(':').join(''))
                const isPastHour = parsedCurrentHour >= parsedRowHour
                isPastAppointment = isPastDate || (rowDate === currentDate && isPastHour);
                return (
                <span className={classes.actions}>
                    {isPastAppointment  &&
                    <Link className={classes.medicLink}
                    to={row.original.medicalReport ? `edit/${row.original.medicalReport}` : `create/${row.original._id}` }
                    >{row.original.medicalReport ? <FaEye className={classes.icon} /> : <FaPencilAlt  className={classes.icon} /> }</Link>}
                </span>
            )}},
        ]
        return [
            {Header: 'Fecha', Cell: ({row}) => getFormattedDate(row.original.fullDate)},
            {Header: 'Profesional',accessor: 'medic', Cell: ({ row }) => (
                <span className={classes.professionalInfo}>
                  <img src={row.original.medic.image} alt={row.original.medic.name} className={classes.medicImage} />
                  <div className={classes.medicDetails}>
                    <p>{row.original.medic.name} {row.original.medic.surname}</p>
                    <p className={classes.specialty}>{row.original.area}</p>
                  </div>
                </span>
            ) },
            {Header: 'Acciones', Cell: ({row}) => {
                const isPastAppointment = new Date(row.original.fullDate) < new Date();
                return(
                    <span className={classes.actions}>
                        {isPastAppointment ? (
                        !!row.original.medicalReport && (
                        <>
                            <Link className={classes.patientLink} to={`${row.original.medicalReport}`}><FaEye className={classes.icon} /></Link>
                            {!row.original.review && <Link className={classes.patientLink} to={`review/${row.original._id}?med=${row.original.medic._id}`}><FaStar className={classes.icon} /></Link>}
                        </>
                        )
                        ) : (
                        <Link className={classes.patientLink} to={`delete/${row.original._id}`}><FaTrashAlt className={classes.icon} /></Link>
                        )}
                    </span>
                )} 
            }
        ]
    }, [userType])

    const data = useMemo(() => (listData?.length) && listData, [listData]);

    const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} = useTable({
        columns: columns,
        data: data || []
    })

    return (
        <div className={classes.main}>
            <div className={classes.options}>
                <Controls />
            </div>
            <div className={classes.tableContainer}>
                <table className={classes.table} {...getTableProps()}>
                    <thead className={`${classes.refference} ${userType === 'medic' ? classes.medic : classes.patient}`}>
                        {headerGroups.map( headerGroup => {
                            const {key, ...headerGroupProps} = headerGroup.getHeaderGroupProps();                            
                            return(
                            <tr key={key} {...headerGroupProps}>
                                {headerGroup.headers.map( column => {
                                    const {key, ...headerProps} = column.getHeaderProps();
                                    return (
                                    <th key={key} {...headerProps}>{column.render('Header')}</th>
                                )})}
                            </tr>
                        )})}
                    </thead>
                    <tbody className={`${classes.body} ${userType === 'medic' ? classes.medic : classes.patient}`} {...getTableBodyProps()}>
                        {rows.length ? (
                            rows.map( row => {
                                prepareRow(row);
                                const {key, ...rowProps} = row.getRowProps();
                                return (
                                    <tr key={key} {...rowProps}>
                                        {row.cells.map( cell => {
                                            const {key, ...cellProps} = cell.getCellProps();
                                            return <td key={key} {...cellProps}>{cell.render('Cell')}</td>
                                        })}
                                    </tr>
                                )
                                })
                        ) : (
                              <tr>
                                <td colSpan={columns.length}>No hay datos para mostrar</td>
                              </tr>
                            ) }        
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Table;
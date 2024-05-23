import {useTable} from 'react-table'
import {Link} from 'react-router-dom'
import { FaEye, FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import classes from './Table.module.css'
import { useMemo } from 'react'
import { useSelector } from 'react-redux';
import Controls from './Controls';

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
            {Header: 'Acciones', Cell: ({row}) => (
                <span className={classes.actions}>
                    <Link className={classes.medicLink} to={`${row.original._id}`}>{row.original.medicalReport ? <FaEye className={classes.icon} /> : <FaPencilAlt  className={classes.icon} /> }</Link>
                </span>
            )},
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
                    {(isPastAppointment && !!row.original.medicalReport) ? (
                    <Link className={classes.patientLink} to={`${row.original.medicalReport}`}><FaEye /></Link>
                    ) : (
                    <Link className={classes.patientLink} to={`delete/${row.original._id}`}><FaTrashAlt /></Link>
                    )}
                </span>
            )} },
        ]
    }, [userType])

    const data = useMemo(() => {
        if (!!listData && !!listData.length) return listData;
        if (userType === 'medic') return [{timeIndex: 0, name: 'No hay turnos para mostrar.', surname: ''}];
        return [{fullDate: new Date(), medic: {image: '', name: 'No hay turnos', surname: ''}, area: ''}];
    }, [listData, userType]);
    
    // if (!data) {
    //     return (
    //       <div className={classes.main}>
    //         <div className={classes.options}>
    //           <p>Opciones inhabilitadas</p>
    //         </div>
    //         <div className={classes.empty}>
    //           No hay turnos para mostrar
    //         </div>
    //       </div>
    //     );
    //   }

    const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} = useTable({
        columns: columns,
        data: data
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
                        {rows.map( row => {
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
                            })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Table;
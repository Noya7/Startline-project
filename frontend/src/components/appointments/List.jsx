import Card from '../layout/card/Card'
import Item from './Item';
import classes from './List.module.css'

const testArray = [
    {time: '12:45', name: 'valentin noya montero', report: 'aa22bb55cc99', id: 12},
    {time: '13:45', name: 'Carlos Caglianone', report: 'aa22bb55cc98', id: 23},
    {time: '18:45', name: 'Santiago Carlos', report: 'aa22bb55cc97', id: 34},
    {time: '14:45', name: 'Ary Pagura', report: 'aa22bb55cc96', id: 45},
]

const List = () => {

    const mappedItems = testArray.map(item => <Item key={item.id} data={item}/>);

    return (
        <Card>
            <div className={classes.grid}>
                <div className={classes.pagination}>
                    <div>
                        <p>Items por pagina:</p>
                        <span className={classes.buttons}>
                            <button>3</button>
                            <button>6</button>
                            <button>10</button>
                            <button>15</button>
                        </span>
                    </div>
                    <span className={classes.pages}>
                        <button>prev</button>
                        <button>next</button>
                    </span>
                </div>
                <div className={classes.list}>
                    <span className={classes.refference}>
                        <h2>Hora</h2>
                        <h2>Paciente</h2>
                    </span>
                    <ul>
                        {mappedItems}
                    </ul>
                </div>
            </div>
        </Card>
    )
}

export default List;
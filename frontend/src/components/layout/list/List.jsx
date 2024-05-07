import Card from '../card/Card'
import Item from './Item'
import classes from './List.module.css'

const List = ({type, children, item, data}) => {

    const mappedItems = data.map(item => <Item key={item.id} data={item}/>);

    return (
        <Card>
            <div className={`${classes.grid}`}>
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
                <div className={`${children ? classes.withRef : classes.noRef}`}>
                    {children && 
                    <div className={classes.refference}>
                        {children}
                    </div>}
                    <ul>
                        {!!mappedItems.length && mappedItems || <li>No hay elementos para mostrar.</li> }
                    </ul>
                </div>
            </div>
        </Card>
    )
}

export default List;
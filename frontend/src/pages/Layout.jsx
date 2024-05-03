import { Outlet } from "react-router-dom";

import classes from './Layout.module.css'
import Header from "../components/layout/header/Header";

const Layout = () => {
    return(
        <div className={classes.main}>
            <Header />
            <Outlet />
        </div>
    )
}

export default Layout;
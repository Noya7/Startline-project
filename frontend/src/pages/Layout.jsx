import { Outlet } from "react-router-dom";
import Header from "../components/layout/header/Header";

import classes from './Layout.module.css'

const AuthLayout = () => {
    return(
        <div className={classes.main}>
            <Header dashboardMode />
            <Outlet />
        </div>
    )
}

export default AuthLayout;

export const HomeLayout = () => {
    return(
        <div className={classes.homeGrid}>
            <Header />
            <Outlet />
        </div>
    )
}
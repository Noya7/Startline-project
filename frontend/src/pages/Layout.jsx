import { Outlet } from "react-router-dom";
import Header from "../components/layout/header/Header";
import Nav from "../components/layout/nav/Nav";

import classes from './Layout.module.css'

const AuthLayout = () => {
    return(
        <div className={classes.background}>
            <div className={classes.main}>
                <Nav />
                <div className={classes.body}>
                    <Header type={'dashboard'} />
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default AuthLayout;

export const HomeLayout = () => {
    return(
        <div className={classes.homeBackground}>
            <div className={classes.homeGrid}>
                <Header />
                <Outlet />
            </div>
        </div>
    )
}
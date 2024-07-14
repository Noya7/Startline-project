import { Outlet } from "react-router-dom";
import Header from "../components/layout/header/Header";
import { ToastContainer } from "react-toastify";

import classes from './Layout.module.css'

const AuthLayout = () => {
    return(
        <>
            <div className={classes.main}>
                <Header dashboardMode />
                <Outlet />
            </div>
            <ToastContainer />
        </>
        
    )
}

export default AuthLayout;

export const HomeLayout = () => {
    return(
        <>
            <div className={classes.homeGrid}>
                <Header />
                <Outlet />
            </div>
            <ToastContainer />
        </>
        
    )
}
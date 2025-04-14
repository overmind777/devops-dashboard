// import React from 'react'
import HeaderComponent from './HeaderComponent'
import SideBarComponent from './SideBarComponent'
import { Outlet } from 'react-router-dom'

function Layout( props ) {
    return (
        <div>
            <HeaderComponent />
            <SideBarComponent />
            <Outlet/>
        </div>
    )
}

export default Layout
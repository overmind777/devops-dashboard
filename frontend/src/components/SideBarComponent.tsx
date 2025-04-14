import * as React from 'react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'


function SideBarComponent( props ): React.JSX.Element {

    const [items, setItems] = useState( [ 'Monitoring', 'Containers', 'Logs', 'Settings'] )

    return (
        <div className="w-full p-[10px] bg-gray-200 dark:bg-gray-200">
            <ul className="w-full flex row gap-[5px] align-items-center">
                { items.map( ( item: string, i: number ) => {
                    return (
                        <li key={ i } className="flex-1 cursor-pointer hover:bg-gray-400">
                            <NavLink to={ `/${item.toLowerCase()}` }>{item}</NavLink>
                        </li>
                    )
                } ) }
            </ul>
        </div>
    )
}

export default SideBarComponent
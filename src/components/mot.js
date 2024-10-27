import { useState, useEffect } from 'react';

import {getMots} from '../api/backend_api'

const Mot = () => {
    const [motList, setMotList] = useState([]);

    useEffect(() => {
        getMots()
            .then(mots => {
                setMotList(mots);
            })
    },

    []
    )

    return <div>
        {motList.map(mot => {
            return <div>{mot.name}</div>
        })}
    </div>
}

export default Mot;
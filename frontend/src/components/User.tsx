import axios from "axios";
import { useEffect, useState } from "react"
import { BACKEND_URL } from "../config";

interface User{
    userId : number;
}

export const User = () => {
    const [userData, setUserData] = useState <User | undefined>();

    useEffect(() => {
        axios.get(`${BACKEND_URL}/user`, {
            withCredentials: true,
          })
            .then(res => {
                setUserData(res.data);
            })
    }, []);

    return <div>
        You're id is {userData?.userId}
        <br /><br />
        <button onClick={() => {
            axios.post(`${BACKEND_URL}/logout`, {}, {
                withCredentials: true,
            })
        }}>Logout</button>
    </div>
}
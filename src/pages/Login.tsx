
import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { v4 as uuidv4 } from "uuid"
import Cookies from "js-cookie"

import Input from "../components/Input"
import Button from "../components/Button"


export default function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isError, setError] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const [isWrong, setWrong] = useState(false)
    const navigate = useNavigate()


    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()

        const token = uuidv4();

        if (!username || !password) {
            setError(true)
            console.log(username, password, isError)
            return;
        }

        setLoading(true)

        setTimeout(() => {
            setLoading(false)
            if (username == "kurir" && password == "P4ket!1") {
                Cookies.set("authToken", token)
                navigate("/home")
            } else {
                setError(true)
                setWrong(true)
            }
        }, 300)

    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="max-w-md w-full space-y-8 p-10 bg-gray-800 rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-white">Siapa Ini ?</h2>
                </div>
                <div className="mt-8 space-y-6" >
                    <div className="">
                        <Input
                            label="Nama mu"
                            id="username"
                            name="username"
                            type="text"
                            required
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        {isError && !username && (
                            <p className="text-red-300 text-sm mt-1" >Value must be required</p>
                        )}
                    </div>

                    <div className="">
                        <Input
                            label="Kode Rahasia"
                            id="password"
                            name="password"
                            type="password"
                            required
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {isError && !password && (
                            <p className="text-red-300 text-sm mt-1" >Value must be required</p>
                        )}
                    </div>

                    <div className="">
                        <Button isLoading={isLoading} onClick={(e) => handleLogin(e)}>{"Pencet Akuh >_<"} </Button>
                        {isWrong && (
                            <p className="text-red-300 text-sm mt-1" >Wrong password or email</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}


import "../css/login.css"
import { sendLoginRequest } from "../../core/services/api"
import { useState } from "react"

function Login() {
    const [token, setToken] = useState("")
    
    const handleSubmit = async (e) => {
        e.preventDefault()

        const data = Object.fromEntries(new FormData(e.currentTarget))
        
        const tokenData = await sendLoginRequest(data)
        setToken(tokenData)
    }

    return <>
        <div>
            <h1>Login</h1>
            <form id="login-form" onSubmit={handleSubmit}>
                <input type="text" name="identifier" placeholder="Usuario o email"/>
                <input type="password" name="password" placeholder="Contraseña"/>
                <input type="submit" value="Iniciar sesión"/>
                <p>Token: {token}</p>
            </form>
        </div>
    </>
}

export default Login
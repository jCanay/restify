import "../css/login.css"
import { useState} from "react"
import {Link} from "react-router"
import api from "../../core/api/axios"
import eyeClosedImg from "../assets/eye-closed.svg"
import eyedImg from "../assets/eye.svg"

const USER_REGEX = /^[A-Za-z][A-Za-z0-9]{2,50}$/
const PWD_REGEX = /^(?=.*[a-z]).{8,50}/

function Login() {
	const [token, setToken] = useState("")
	const [showPwd, setShowPwd] = useState(false)
	const [request, setRequest] = useState({
		identifier: "",
		password: ""
	})

	const handleInput = (e) => {
		setRequest({...request, [e.currentTarget.name]: e.currentTarget.value})
	}

	const handlePwdBtnClick = (e) => {
		e.preventDefault()

		setShowPwd(!showPwd)
	}

	const handleSubmit = (e) => {
		e.preventDefault()

		api
			.post("/auth/login", request)
			.then((response) => {
				setToken(response.data.token)
			})

		if (token) {
			cookieStore.set("token", token)
		}
	}
	
    return (
        <section className="login">
            <h1>Iniciar sesión</h1>
            <form id="login-form" onSubmit={handleSubmit}>
                <input type="text" value={request.identifier} name="identifier" placeholder="Usuario o email" onChange={handleInput}/>
                <div>
					<input type={showPwd ? "text" : "password"} value={request.password} name="password" placeholder="Contraseña" onChange={handleInput}/>
					<button onClick={handlePwdBtnClick}>
						<img src={showPwd ? eyedImg : eyeClosedImg} width="25" height="25" alt="" />
					</button>
				</div>
                <input type="submit" value="Iniciar sesión"/>
				<p>
					¿No tienes cuenta? 
					<Link to="/register">Registrate aquí</Link>
				</p>
				<p>Token: {token}</p>
            </form>
        </section>
    )
}

export default Login

import { useState } from "react"
import UserForm from "../components/UserForm"
import "../css/register.css"
import userImg from "../assets/user.svg"
import ownerImg from "../assets/owner.svg"
import driverImg from "../assets/driver.svg"

const USER_REGEX = /^[A-Za-z][A-Za-z0-9]{2,50}$/
const PWD_REGEX = /^(?=.*[a-z]).{8,50}/

function Register() {

	const [option, setOption] = useState("user")

	const handleClick = (e) => {
		setOption(e.currentTarget.id.replace("-btn", ""))
	}

	return (
		<section className="register">
			<div>
				<button onClick={handleClick} id="user-btn">
					<img src={userImg} width="50" height="50" alt="" />
				</button>
				<button onClick={handleClick} id="owner-btn">
					<img src={ownerImg} width="50" height="50" alt="" />
				</button>
				<button onClick={handleClick} id="driver-btn">
					<img src={driverImg} width="50" height="50" alt="" />
				</button>
			</div>
			<UserForm role={option}>
				
			</UserForm>
		</section>
	)
}

export default Register
import React, { useContext, useState } from 'react'
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import { auth } from '../../firebase/firebase'
import { AuthContext } from 'context/Auth'
import { Label, TextInput, PasswordInput } from '../FormFields'
import { SubmitButtonWithLoader } from '../UI Elements/Buttons'
import logo from 'images/epoch-logo.svg'
import icon from 'images/epoch-logo-icon.svg'

const Login = ({ history }) => {
	const { currentUser } = useContext(AuthContext)

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [errorMsg, setErrorMsg] = useState('')
	const [loading, setLoading] = useState(false)

	const handleLogin = (e) => {
		e.preventDefault()
		setLoading(true)
		auth.signInWithEmailAndPassword(email, password)
			.then(() => {
				history.push('/')
				setLoading(false)
			})
			.catch((error) => {
				setLoading(false)
				if (error.code === 'auth/wrong-password') {
					setErrorMsg('Incorrect email or password')
				} else if (error.code === 'auth/invalid-email') {
					setErrorMsg('Please enter a valid email address')
				} else {
					setErrorMsg(error.message)
				}
			})
	}

	if (currentUser) {
		return <Redirect to="/" />
	}

	return (
		<div className="flex flex-col min-h-screen">
			<header>
				<div className="mx-auto bg-purp-dark py-3 px-6 flex justify-between">
					<img src={logo} style={{ height: 35 }} alt="epoch logo" />
				</div>
			</header>
			<main className="flex flex-grow items-center bg-purp-lightest flex-col">
				<img src={icon} alt="epoch logo icon" className="mt-24 mb-6 h-16 w-16" />
				<h1 className="text-purp-normal text-3xl mb-6 font-semibold">Login to Epoch</h1>
				<div className="bg-white p-8 rounded shadow-lg max-w-sm">
					<p className="text-purp-normal">Enter your email address and password.</p>
					<form className="pt-4" onSubmit={handleLogin}>
						<Label name="Email" htmlFor="email" />
						<TextInput name="email" className="mb-3" onChange={(e) => setEmail(e.target.value)} />
						<Label name="Password" htmlFor="password" />
						<PasswordInput name="password" className="mb-2" onChange={(e) => setPassword(e.target.value)} />
						<Link to="/password-reset">
							<small className="text-purp-medium hover:text-purp-normal underline transition duration-200 ease">
								Forgot Password?
							</small>
						</Link>
						<div className="mt-6">
							<SubmitButtonWithLoader text="Login" loadingText="Logging In..." loading={loading} />
						</div>
					</form>

					<p className="text-red-600">{errorMsg}</p>
				</div>
			</main>
		</div>
	)
}

export default Login

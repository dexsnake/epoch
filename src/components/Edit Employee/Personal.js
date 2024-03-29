import React, { useContext, useState, useEffect } from 'react'
import EmployeeInfoContainer from '../EmployeeInfoContainer'
import { AuthContext } from '../../context/Auth'
import { Select, TextInput, Label } from '../FormFields'
import NumberFormat from 'react-number-format'
import Icon from '@mdi/react'
import { mdiEyeMinus, mdiEyeCheck } from '@mdi/js'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const Personal = () => {
	const { currentUser, employeeProfile, updateEmployeeProfile } = useContext(AuthContext)
	const [
		{ firstName, middleName, lastName, dateOfBirth, ssn, gender, ethnicity, maritalStatus },
		setState
	] = useState(employeeProfile)
	const [showSsn, setShowSsn] = useState(false)

	const data = { firstName, middleName, lastName, dateOfBirth, ssn, gender, ethnicity, maritalStatus }

	useEffect(() => {
		setState(employeeProfile)
	}, [employeeProfile])

	useEffect(() => {
		updateEmployeeProfile(data)
	}, [firstName, middleName, lastName, dateOfBirth, ssn, gender, ethnicity, maritalStatus])

	// Function to handle the onChange event of the dateOfBirth input
	const handleChange = (e) => {
		const { name, value } = e.target
		setState((prevState) => ({ ...prevState, [name]: value }))
	}

	return (
		<React.Fragment>
			<div className="max-w-6xl mx-auto">
				<div className="px-10 pt-8">
					<p className="uppercase text-purp-normal font-semibold">Personal Information</p>
				</div>
				<EmployeeInfoContainer>
					<div className="px-8 pt-8 pb-2">
						<div className="flex flex-wrap">
							<div className="w-full sm:w-1/2 lg:w-1/3 px-3 mb-6">
								<Label name="First Name" htmlFor="firstName" />
								<TextInput
									name="firstName"
									disabled={!currentUser.accessLevel > 0}
									value={firstName || ''}
									onChange={handleChange}
								/>
							</div>
							<div className="w-full sm:w-1/2 lg:w-1/3 px-3 mb-6">
								<Label name="Middle Name" htmlFor="middleName" />
								<TextInput
									name="middleName"
									disabled={!currentUser.accessLevel > 0}
									value={middleName || ''}
									onChange={handleChange}
								/>
							</div>
							<div className="w-full sm:w-1/2 lg:w-1/3 px-3 mb-6">
								<Label name="Last Name" htmlFor="lastName" />
								<TextInput
									name="lastName"
									disabled={!currentUser.accessLevel > 0}
									value={lastName || ''}
									onChange={handleChange}
								/>
							</div>
							<div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/5 px-3 mb-6">
								<Label name="DOB" htmlFor="dob" />
								<DatePicker
									className="disabled:bg-white disabled:text-purp-medium focus:outline-none border-b pb-1 font-semibold text-purp-normal"
									name="test"
									showMonthDropdown
									showYearDropdown
									dropdownMode="select"
									disabled={!currentUser.accessLevel > 0}
									selected={dateOfBirth}
									onChange={(date) => setState((prevState) => ({ ...prevState, dateOfBirth: date }))}
								/>
							</div>
							<div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/5 px-3 mb-6 relative">
								<Label name="SSN" htmlFor="ssn" />
								{showSsn ? (
									<NumberFormat
										format="###-##-####"
										disabled={!currentUser.accessLevel > 0}
										name="ssn"
										value={ssn}
										onChange={handleChange}
										className="w-full text-purp-normal font-semibold border-b pb-1 px-2 disabled:bg-white disabled:text-purp-medium"
									/>
								) : (
									<TextInput name="ssn" disabled value="XXX-XX-XXXX" />
								)}
								<Icon
									path={showSsn ? mdiEyeMinus : mdiEyeCheck}
									size={1}
									color="#414255"
									className="pb-1 inline ml-2 cursor-pointer absolute right-20"
									onClick={() => setShowSsn(!showSsn)}
								/>
							</div>
							<div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/5 px-3 mb-6">
								<Label name="Gender" htmlFor="gender" />
								<Select name="gender" value={gender} onChange={handleChange}>
									<option value="Male">Male</option>
									<option value="Female">Female</option>
									<option value="Other">Other</option>
								</Select>
							</div>
							<div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/5 px-3 mb-6">
								<Label name="Ethnicity" htmlFor="ethnicity" />
								<Select name="ethnicity" value={ethnicity} onChange={handleChange}>
									<option value="American Indian">American Indian</option>
									<option value="Asian">Asian</option>
									<option value="Black">Black</option>
									<option value="Hispanic">Hispanic</option>
									<option value="Two or More Races">Two or More Races</option>
									<option value="Unknown">Unknown</option>
									<option value="White/Caucasian">White/Caucasian</option>
								</Select>
							</div>
							<div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/5 px-3 mb-6">
								<Label name="Marital Status" htmlFor="maritalStatus" />
								<Select name="maritalStatus" value={maritalStatus} onChange={handleChange}>
									<option value="Single">Single</option>
									<option value="Married">Married</option>
									<option value="Divorced">Divorced</option>
									<option value="Widowed">Widowed</option>
								</Select>
							</div>
						</div>
					</div>
				</EmployeeInfoContainer>
			</div>
		</React.Fragment>
	)
}

export default Personal

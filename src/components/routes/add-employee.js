import React, { useState } from 'react'
import Layout from '../Layout'
import EmployeeInfoContainer from '../EmployeeInfoContainer'
import { Label, TextInput, Select } from '../FormFields'
import { SingleDatePicker } from 'react-dates'
import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'
import Icon from '@mdi/react'
import { mdiAccountPlus, mdiLoading } from '@mdi/js'
import { db, functions } from '../../firebase/firebase'
import NumberFormat from 'react-number-format'

const AddEmployee = (props) => {
	const initalState = {
		firstName: '',
		lastName: '',
		middleName: '',
		startDate: null,
		dateOfBirth: null,
		ssn: '',
		title: '',
		ethnicity: '',
		gender: '',
		maritalStatus: '',
		phoneNumber: '',
		alternatePhoneNumber: '',
		email: '',
		address1: '',
		address2: '',
		city: '',
		state: '',
		zipCode: '',
		salary: '',
		salaryRate: '',
		ecFirstName: '',
		ecLastName: '',
		ecRelationship: '',
		ecPhoneNumber: '',
	}
	const [
		{
			firstName,
			lastName,
			middleName,
			startDate,
			dateOfBirth,
			ssn,
			title,
			ethnicity,
			gender,
			maritalStatus,
			phoneNumber,
			alternatePhoneNumber,
			email,
			address1,
			address2,
			city,
			state,
			zipCode,
			salary,
			salaryRate,
			ecFirstName,
			ecLastName,
			ecRelationship,
			ecPhoneNumber,
		},
		setState,
	] = useState(initalState)
	const [dobFocus, setDobFocus] = useState(false)
	const [startDateFocus, setStartDateFocus] = useState(false)
	const [saving, setSaving] = useState(false)
	const userPassword = `${firstName.toLowerCase().charAt(0)}${lastName.toLowerCase()}${ssn.substr(ssn.length - 4)}`
	const createUser = functions.httpsCallable('createUser')

	// Function to handle the onChange events for the inputs
	const handleChange = (e) => {
		const { name, value } = e.target
		setState((prevState) => ({ ...prevState, [name]: value }))
	}

	// Function to handle the onChange event of the dateOfBirth input
	const handleDobChange = (dateOfBirth) => {
		setState((prevState) => ({ ...prevState, dateOfBirth }))
	}

	// Function to handle the onChange event of the startDate input
	const handleStartDateChange = (startDate) => {
		setState((prevState) => ({ ...prevState, startDate }))
	}

	const handleAddEmployee = (e) => {
		e.preventDefault()
		setSaving(true)
		createUser({ email: email, password: userPassword }).then((result) => {
			const uid = result.data.uid
			db.collection('Employees')
				.doc(uid)
				.set({
					firstName,
					lastName,
					middleName,
					dateOfBirth: dateOfBirth._d,
					startDate: startDate._d,
					ssn,
					title,
					ethnicity,
					gender,
					maritalStatus,
					phoneNumber,
					alternatePhoneNumber,
					email,
					address1,
					address2,
					city,
					state,
					zipCode,
					salary,
					salaryRate,
					emergencyContacts: [
						{
							firstName: ecFirstName,
							lastName: ecLastName,
							relationship: ecRelationship,
							phoneNumber: ecPhoneNumber,
						},
					],
				})
				.then(function () {
					props.history.push('/employees')
				})
				.catch(function (error) {
					console.log(error)
				})
		})
	}

	return (
		<Layout>
			<h1 className="m-10 text-purp-normal text-3xl">
				<Icon path={mdiAccountPlus} size={2.2} className="inline mr-3 pb-1" />
				Add New Employee
			</h1>
			<EmployeeInfoContainer>
				<div className="p-8">
					<p className="uppercase text-purp-normal font-semibold mb-5">Personal Info</p>
					<div className="flex">
						<div className="w-1/3 px-3">
							<Label name="First Name" htmlFor="firstName" />
							<TextInput name="firstName" value={firstName} onChange={handleChange} />
						</div>
						<div className="w-1/3 px-3">
							<Label name="Middle Name" htmlFor="middleName" />
							<TextInput name="middleName" value={middleName} onChange={handleChange} />
						</div>
						<div className="w-1/3 px-3">
							<Label name="Last Name" htmlFor="lastName" />
							<TextInput name="lastName" value={lastName} onChange={handleChange} />
						</div>
					</div>
				</div>
				<div className="p-8">
					<div className="flex">
						<div className="w-1/5 px-3">
							<Label name="DOB" htmlFor="dob" />
							<div className="date-picker-no-border">
								<SingleDatePicker
									date={dateOfBirth}
									onDateChange={handleDobChange}
									focused={dobFocus}
									onFocusChange={() => setDobFocus(!dobFocus)}
									numberOfMonths={1}
									isOutsideRange={() => false}
									anchorDirection="left"
									noBorder={true}
									id="dateOfBirth"
								/>
							</div>
						</div>
						<div className="w-1/5 px-3 relative">
							<Label name="SSN" htmlFor="ssn" />
							<NumberFormat format="###-##-####" name="ssn" value={ssn} onChange={handleChange} className="w-full text-purp-normal border-b pb-1 px-2 disabled:bg-white" />
						</div>
						<div className="w-1/5 px-3">
							<Label name="Gender" htmlFor="gender" />
							<Select name="gender" value={gender} onChange={handleChange}>
								<option disabled defaultValue value=""></option>
								<option value="Male">Male</option>
								<option value="Female">Female</option>
								<option value="Other">Other</option>
							</Select>
						</div>
						<div className="w-1/5 px-3">
							<Label name="Ethnicity" htmlFor="ethnicity" />
							<Select name="ethnicity" value={ethnicity} onChange={handleChange}>
								<option disabled defaultValue value=""></option>
								<option value="American Indian">American Indian</option>
								<option value="Asian">Asian</option>
								<option value="Black">Black</option>
								<option value="Hispanic">Hispanic</option>
								<option value="Two or More Races">Two or More Races</option>
								<option value="Unknown">Unknown</option>
								<option value="White/Caucasian">White/Caucasian</option>
							</Select>
						</div>
						<div className="w-1/5 px-3">
							<Label name="Marital Status" htmlFor="maritalStatus" />
							<Select name="maritalStatus" value={maritalStatus} onChange={handleChange}>
								<option disabled defaultValue value=""></option>
								<option value="Single">Single</option>
								<option value="Married">Married</option>
								<option value="Divorced">Divorced</option>
								<option value="Widowed">Widowed</option>
							</Select>
						</div>
					</div>
				</div>
			</EmployeeInfoContainer>
			<EmployeeInfoContainer>
				<div className="p-8">
					<p className="uppercase text-purp-normal font-semibold mb-5">Employment Info</p>
					<div className="flex">
						<div className="w-1/4 px-3">
							<Label name="Start Date" htmlFor="startDate" />
							<div className="date-picker-no-border">
								<SingleDatePicker
									date={startDate}
									onDateChange={handleStartDateChange}
									focused={startDateFocus}
									onFocusChange={() => setStartDateFocus(!startDateFocus)}
									numberOfMonths={1}
									isOutsideRange={() => false}
									anchorDirection="left"
									noBorder={true}
								/>
							</div>
						</div>
						<div className="w-1/4 px-3">
							<Label name="Salary" htmlFor="salary" />
							<TextInput name="salary" value={salary} onChange={handleChange} />
						</div>
						<div className="w-1/4 px-3">
							<Label name="salaryRate" htmlFor="salaryRate" />
							<Select name="salaryRate" value={salaryRate} onChange={handleChange}>
								<option disabled defaultValue value=""></option>
								<option value="/year">Per Year</option>
								<option value="/hour">Per Hour</option>
								<option value="/week">Per Week</option>
								<option value="/month">Per Month</option>
							</Select>
						</div>
						<div className="w-1/4 px-3">
							<Label name="title" htmlFor="title" />
							<TextInput name="title" value={title} onChange={handleChange} />
						</div>
					</div>
				</div>
			</EmployeeInfoContainer>
			<EmployeeInfoContainer>
				<div className="p-8">
					<p className="uppercase text-purp-normal font-semibold mb-5">Contact Info</p>
					<div className="flex">
						<div className="w-1/3 px-3">
							<Label name="Phone Number" htmlFor="phoneNumber" />
							<NumberFormat format="(###) ###-####" name="phoneNumber" value={phoneNumber} onChange={handleChange} className="w-full text-purp-normal border-b pb-1 px-2 disabled:bg-white" />
						</div>
						<div className="w-1/3 px-3">
							<Label name="Alt Phone Number" htmlFor="alternatePhoneNumber" />
							<NumberFormat format="(###) ###-####" name="alternatePhoneNumber" value={alternatePhoneNumber} onChange={handleChange} className="w-full text-purp-normal border-b pb-1 px-2 disabled:bg-white" />
						</div>
						<div className="w-1/3 px-3">
							<Label name="Email" htmlFor="email" />
							<TextInput name="email" value={email} onChange={handleChange} />
						</div>
					</div>
				</div>
				<div className="p-8">
					<div className="flex">
						<div className="w-1/5 px-3">
							<Label name="Address 1" htmlFor="address1" />
							<TextInput name="address1" value={address1} onChange={handleChange} />
						</div>
						<div className="w-1/5 px-3">
							<Label name="Address 2" htmlFor="address2" />
							<TextInput name="address2" value={address2} onChange={handleChange} />
						</div>
						<div className="w-1/5 px-3">
							<Label name="City" htmlFor="city" />
							<TextInput name="city" value={city} onChange={handleChange} />
						</div>
						<div className="w-1/5 px-3">
							<Label name="State" htmlFor="state" />
							<TextInput name="state" value={state} onChange={handleChange} />
						</div>
						<div className="w-1/5 px-3">
							<Label name="Zip Code" htmlFor="zipCode" />
							<TextInput name="zipCode" value={zipCode} onChange={handleChange} />
						</div>
					</div>
				</div>
			</EmployeeInfoContainer>
			<EmployeeInfoContainer>
				<div className="p-8">
					<div className="flex justify-between">
						<p className="uppercase text-purp-normal font-semibold">Emergency Contact</p>
					</div>
					<div className="flex">
						<div className="w-1/4 px-3">
							<Label name="First Name" htmlFor="ecFirstName" />
							<TextInput name="ecFirstName" value={ecFirstName} onChange={handleChange} />
						</div>
						<div className="w-1/4 px-3">
							<Label name="Last Name" htmlFor="ecLastName" />
							<TextInput name="ecLastName" value={ecLastName} onChange={handleChange} />
						</div>
						<div className="w-1/4 px-3">
							<Label name="Relationship" htmlFor="ecRelationship" />
							<TextInput name="ecRelationship" value={ecRelationship} onChange={handleChange} />
						</div>
						<div className="w-1/4 px-3">
							<Label name="Phone Number" htmlFor="ecPhoneNumber" />
							<TextInput name="ecPhoneNumber" value={ecPhoneNumber} onChange={handleChange} />
						</div>
					</div>
				</div>
			</EmployeeInfoContainer>
			<div className="pb-6 px-10 flex justify-end items-center">
				<button onClick={handleAddEmployee} className="bg-purp-brightest hover:bg-purp-bright text-white px-3 py-2 font-semibold">
					{saving ? <Icon path={mdiLoading} spin={(true, 1)} size={1} /> : 'Create Employee'}
				</button>
			</div>
		</Layout>
	)
}

export default AddEmployee
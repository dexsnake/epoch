import React, { useState } from 'react'
import { db, functions } from '../firebase/firebase'
import Icon from '@mdi/react'
import { mdiLoading } from '@mdi/js'

const Employee = ({ employees, requests }) => {
	const enableUser = functions.httpsCallable('enableUser')
	const [loading, setLoading] = useState(false)

	const handleReactivate = (id) => {
		setLoading(true)
		enableUser({ id: id }).then(() => {
			db.collection('Employees')
				.doc(id)
				.update({
					isActive: true,
					updatedAt: new Date(),
				})
				.then(() => {
					setLoading(false)
				})
		})
	}

	return employees.map((e) => {
		return (
			<div key={e.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-3 pb-6">
				<div className="flex flex-col items-center rounded text-center p-4 bg-white shadow-lg relative">
					<div className="opacity-50">
						{e.imageUrl ? (
							<img src={e.imageUrl} alt="employee headshot" className="rounded-full h-24 w-24 mb-3 mx-auto" />
						) : (
							<div className="rounded-full bg-purp-light h-24 w-24 mb-3 flex items-center justify-center mx-auto">
								<span className="font-semibold text-2xl">
									{e.firstName.charAt(0)}
									{e.lastName.charAt(0)}
								</span>
							</div>
						)}
						<h5 className="font-semibold text-xl text-purp-normal">
							{e.firstName} {e.middleName ? `${e.middleName.charAt(0)}.` : null} {e.lastName}
						</h5>
						<p className="text-purp-normal">{e.title}</p>
					</div>
					<button onClick={() => handleReactivate(e.id)} className="text-center hover:text-green-500 pt-2 font-semibold tracking-wide text-sm">
						{loading ? <Icon path={mdiLoading} size={1} spin={(true, 1)} /> : 'Reactivate'}
					</button>
				</div>
			</div>
		)
	})
}

export default Employee
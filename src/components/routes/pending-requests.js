import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from 'context/Auth'
import Layout from 'components/Layout/Layout'
import { db } from '../../firebase/firebase'
import Icon from '@mdi/react'
import { mdiCalendarAlert } from '@mdi/js'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import SingleRequestShort from 'components/Requests/SingleRequestShort'
import MultiRequestShort from 'components/Requests/MultiRequestShort'
import UserRequestShort from 'components/skeletons/UserRequestShort'
import NothingHere from 'images/nothingHere.svg'

const PendingRequests = () => {
	const { currentUser } = useContext(AuthContext)
	const [requests, setRequests] = useState(null)

	console.log(requests, currentUser)

	useEffect(() => {
		const unsubscribe = db
			.collection('Requests')
			.where('status', '==', 'pending')
			.onSnapshot((snapshot) => {
				const newRequests = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data()
				}))
				setRequests(newRequests.filter((request) => request.userId !== currentUser.uid))
			})
		return () => {
			unsubscribe()
		}
	}, [currentUser.uid])

	return (
		<Layout>
			<div className="max-w-6xl mx-auto">
				<div className="m-4 sm:m-10">
					<h1 className="font-semibold text-3xl text-purp-normal mb-4">
						<Icon path={mdiCalendarAlert} size={2} className="inline pb-1 mr-1" />
						Pending Requests
					</h1>
					<div className="flex flex-wrap">
						{requests ? (
							requests.length > 0 ? (
								requests
									.sort((a, b) => (a.startDate > b.startDate ? 1 : -1))
									.map((request) => {
										return request.requestType === 'singleDay' ? (
											<SingleRequestShort request={request} key={request.id} footer />
										) : (
											<MultiRequestShort request={request} key={request.id} footer />
										)
									})
							) : (
								<div className="max-w-xl w-full mx-auto">
									<p className="text-purp-medium font-semibold text-center text-2xl">
										Nothing Here. Good Job Boss!{' '}
										<span role="img" aria-label="celebrate emoji">
											🥳
										</span>
									</p>
									<img src={NothingHere} alt="nothing here" className="opacity-50" />
								</div>
							)
						) : (
							<>
								<UserRequestShort />
								<UserRequestShort />
								<UserRequestShort />
							</>
						)}
					</div>
					<ToastContainer position="top-center" autoClose={2000} />
				</div>
			</div>
		</Layout>
	)
}

export default PendingRequests

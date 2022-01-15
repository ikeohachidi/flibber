import './SideNav.css';
import Channels from 'components/Channels/Channels';
import Contacts from 'components/Contacts/Contacts';
import Avatar from "components/Avatar/Avatar";

import { signOut } from 'supabase/authentication';
import User, { UserSession } from 'types/User';
import { useNavigate } from 'react-router';

import RoutePath from 'routes';

const actionItems = [
	{ icon: 'ri-time-line', text: 'All Updates' },
	{ icon: 'ri-user-line', text: 'Members' },
	{ icon: 'ri-settings-4-line', text: 'Settings' },
]

const ActionItems = (): JSX.Element => {
	const nav = actionItems.map((item, index) => (
		<li key={ index } className="flex items-center px-4 py-2">
			<i className={ `${item.icon} ri-lg` }></i>
			<span className="inline-block ml-5">{ item.text }</span>
		</li>
	))

	return (
		<ul>{nav}</ul>
	)
} 

type Props = {
	session: UserSession;
	user: User;
}

const SideNav = (props: Props): JSX.Element => {
	const navigation = useNavigate();

	const signOutUser = () => {
		signOut()
			.then(() => {
				navigation(RoutePath.LOGIN)
			})
	}

	return (
		<div className="sidenav p-8">
			<div className="user-info flex items-center p-4 rounded-md mb-4">
				<Avatar dimension={50} />
				<div className="ml-2">
					<p className="text-lg font-bold">{ props.user && props.user.name }</p>
					<p className="text-gray-500 text-xs">{ props.session && props.session.email }</p>
					<p className="text-gray-500 text-xs">Active</p>
				</div>
				<i className="ri-logout-box-r-line ri-lg ml-auto cursor-pointer" onClick={ signOutUser }></i>
			</div>
			<div className="mb-4">
				<ActionItems />
			</div>
			<div className="mb-4">
				<Channels />	
			</div>
			<div>
				<Contacts />	
			</div>
		</div>
	)
}

export default SideNav;
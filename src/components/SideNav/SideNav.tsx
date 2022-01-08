import './SideNav.css';
import Channels from 'components/Channels/Channels';
import DirectMessages from 'components/DirectMessages/DirectMessages';
import Avatar from "components/Avatar/Avatar";

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

const SideNav = (): JSX.Element => {
	return (
		<div className="sidenav p-8">
			<div className="user-info flex items-center p-4 rounded-md mb-4">
				<Avatar dimension={50} />
				<div className="ml-2">
					<p className="text-lg font-bold">Ikeoha Chidi</p>
					<p className="text-gray-500 text-xs">Active</p>
				</div>
			</div>
			<div className="mb-4">
				<ActionItems/>
			</div>
			<div className="mb-4">
				<Channels/>	
			</div>
			<div>
				<DirectMessages/>	
			</div>
		</div>
	)
}

export default SideNav;
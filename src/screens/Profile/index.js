/**
 * Affiche le profil de la personne
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2018, SiMDE-UTC
 * @license AGPL-3.0
 */

import React from 'react';
import { ScrollView, View } from 'react-native';

import PortailApi from '../../services/Portail';
import CASAuth from '../../services/CASAuth';
import ProfileHeader from './ProfileHeader';
import FullWidthBackButton from '../../components/FullWidthBackButton';
import { _ } from '../../utils/i18n';

export default class ProfileScreen extends React.Component {
	static navigationOptions = () => ({
		headerTitle: _('my_account'),
		headerStyle: {
			backgroundColor: '#fff',
		},
		headerTintColor: '#007383',
		headerForceInset: { top: 'never' },
	});

	constructor(props) {
		super(props);

		if (!PortailApi.isActive()) props.navigation.navigate('Connection');

		this.state = {
			loading: false,
			login: '',
		};

		if (CASAuth.isConnected()) {
			CASAuth.getLogin().then(login => {
				this.setState(prevState => {
					prevState.login = login;

					return prevState;
				});
			});
		}
	}

	logout() {
		const { navigation } = this.props;

		this.setState(prevState => {
			prevState.loading = true;

			return prevState;
		});

		PortailApi.logout().then(() => {
			this.setState(prevState => {
				prevState.loading = false;

				return prevState;
			});

			navigation.navigate('Connection');
		});
	}

	render() {
		return (
			<ScrollView style={{ backgroundColor: '#f4f4f4' }}>
				<ProfileHeader />
				<View style={{ borderTopWidth: 1, borderTopColor: '#f4f4f4' }}>
					<FullWidthBackButton name={_('disconnect')} onPress={() => this.logout()} />
				</View>
			</ScrollView>
		);
	}
}

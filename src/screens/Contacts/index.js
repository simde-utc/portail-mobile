import React from 'react';
import { SectionList, Text, View } from 'react-native';

import Contact from '../../components/Contact';
import networkData from '../../data/social_networks';
import styles from '../../styles';
import { _ } from '../../utils/i18n';

export default class ContactsScreen extends React.PureComponent {
	static navigationOptions = () => ({
		headerTitle: _('contacts'),
		headerStyle: {
			backgroundColor: '#fff',
		},
		headerTintColor: '#007383',
		headerForceInset: { top: 'never' },
	});

	/* eslint-disable-next-line class-methods-use-this */
	getSections() {
		return [
			{
				title: _('social_networks'),
				data: networkData,
			},
		];
	}

	render() {
		return (
			<SectionList
				style={styles.scrollable.list}
				renderItem={({ item }) => <Contact {...item} />}
				renderSectionHeader={({ section: { title } }) => (
					<View style={styles.scrollable.sectionHeader.view}>
						<Text style={styles.scrollable.sectionHeader.title}>{title}</Text>
					</View>
				)}
				sections={this.getSections()}
				keyExtractor={(item, index) => item + index}
				ItemSeparatorComponent={() => <View style={styles.scrollable.itemSeparator} />}
				renderSectionFooter={() => <View style={styles.scrollable.sectionSeparator} />}
			/>
		);
	}
}

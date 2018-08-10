import React from 'react';
import { View } from 'react-native';
import styles from '../styles/';
import SvgUri from 'react-native-svg-uri';

// Faire attention: https://github.com/vault-development/react-native-svg-uri#known-bugs
export default class Icon extends React.Component {
	render() {
		return (
			<View style={this.props.style || { alignItems: 'center', justifyContent: 'center', flex: 1 }}>
				<SvgUri width={this.props.width || '30'} height={this.props.height || '30'} source={ this.props.image } />
			</View>
		);
	}
}

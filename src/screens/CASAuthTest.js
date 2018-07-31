import React from 'react';
import { View, Image, Text, ScrollView, Button, TextInput } from 'react-native';
import styles from '../styles'
import { colors } from '../styles/variables';
import CASAuth from '../services/CASAuth';


export default class CASAuthTestScreen extends React.Component {
	
	state = {
		log: "",
		login: "",
		password: ""
	}

	log = (data, error = false) => {
		this.setState(prevState => ({ ...prevState, log: data }));
		if (error)
			console.warn(data)
		else
			console.log(data);
	
	}

log_in = (login, password) => {
	console.log("login : "+login+", password : "+password);

	
	let cas = new CASAuth();
	promise = cas.login(login, password);
	promise.then(([text, status, url]) => {
				this.log(text +" "+status+" "+url);
	}
	).catch( (e) => {
		if(e instanceof TypeError) {this.log(JSON.stringify(e), true); /**this.log(e.message, true);**/}
		else {
			if(Array.isArray(e) && e.length ==3) {
				let text, status, url;
				[text, status, url] = e;
				this.log(text +" "+status+" "+url, true);
			}
			else {this.log("Erreur réseau", true);}
		}
	});
	
}



	render() {
		return (
			<View style={[ styles.get('container.center', 'container.padded'), { justifyContent: 'space-around', alignItems: 'stretch' } ]}>
				<Text>State : { this.state.log }</Text>
				<TextInput
				  style={{height: 40}}
				  placeholder="login"
				onChangeText={(text) => this.setState(prevState => ({ ...prevState, login: text }))}
				/>
				<TextInput
				  style={{height: 40}}
				  placeholder="password"
				onChangeText={(text) => this.setState(prevState => ({ ...prevState, password: text }))}
				/>
			<Button onPress={ () => {this.log_in(this.state.login, this.state.password); } } title="Log in" />
			</View>
		);
	}
}

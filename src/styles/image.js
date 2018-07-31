import { StyleSheet } from 'react-native';

export const thumbnail = {
	resizeMode: 'contain',
	width: 40,
	height: 40
}

export const avatar = {
	...thumbnail,
	borderRadius: 20
};

export const bigThumbnail = {
	resizeMode: 'contain',
	width: 100,
	height: 100
}

export const bigAvatar = {
	...bigThumbnail,
	borderRadius: 50
};

export default image = StyleSheet.create({
	thumbnail,
	avatar,
	bigThumbnail,
	bigAvatar,
});
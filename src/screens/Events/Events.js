import React from 'react';
import { View, Image, Text, ScrollView, Button, StyleSheet, TouchableHighlight } from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import moment from 'moment'

import PortailApi from '../../services/Portail'
import Storage from '../../services/Storage'
import ColorUtils from '../../utils/Color'

export default class EventsScreen extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			months: [],
			events: {},
			calendars: [],
			date: moment().format('YYYY-MM-DD')
		}

		PortailApi.getUserCalendars().then(([data]) => {
			this.setState(prevState => {
				prevState.calendars = data

				return prevState
			})

			this.reload()
		}).catch(() => {})
	}

	reload() {
		this.setState(prevState => {
			prevState.months = []
			prevState.events = {}

			return prevState
		})

		this.loadEvents(this.state.date)
	}

	seeEvent(event_id) {
		this.props.navigation.push('Event', {id: event_id})
	}

	render() {
		return (
			<Agenda
				items={ this.state.events }
				loadItemsForMonth={ (date) => { this.loadEvents(date.dateString) } }
				selected={ this.state.date }
				onDayPress={ (day) => { this.setState(prevState => { prevState.date = day; return prevState })} }
				onDayChange={ (day) => { this.setState(prevState => { prevState.date = day; return prevState })} }
				renderItem={ this.renderEvent.bind(this) }
				renderEmptyDate={ this.renderEmptyDate.bind(this) }
				rowHasChanged={ this.rowHasChanged.bind(this) }
				// monthFormat={'yyyy'}
				// theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
				//renderDay={(day, event) => (<Text>{day ? day.day: 'event'}</Text>)}
			/>
		);
	}

	_findEventId(array, id) {
		for (let i = 0; i < array.length; i++) {
			if (array[i].id === id)
				return i
		}

		return null
	}

	loadEvents(day) {
		var month = moment(new Date(day)).format('YYYY-MM-01')
		var momentMonth = moment(new Date(month))

		if (!this.state.months.includes(month)) {
			var momentMonthLimit = moment(new Date(moment(new Date(day)).format('YYYY-MM-01'))).add(1, 'months')

			this.setState(prevState => {
				prevState.months.push(month)

				return prevState
			});

			while (momentMonth < momentMonthLimit) {
				if (!this.state.events[momentMonth.format('YYYY-MM-DD')])
					this.setState(prevState => {
						prevState.events[momentMonth.format('YYYY-MM-DD')] = []

						return prevState
					})

				momentMonth.add(1, 'days')
			}

			this.state.calendars.forEach((calendar) => {
				PortailApi.getEventsFromCalendar(calendar.id, month).then(([data]) => {
					data.forEach((event) => {
						var date = moment(event.begin_at).format('YYYY-MM-DD')

						// On ajoute l'évènement pour la date x
						if (!this.state.events[date])
							this.setState(prevState => {
								prevState.events[date] = []
								return prevState
							})

						var index = this._findEventId(this.state.events[date], event.id);

						// Si l'évènement y est déjà, on ajoute juste sur quel calendrier il est
						if (index === null) {
							event.calendars = [calendar]

							this.setState(prevState => {
								prevState.events[date].push(event)
								return prevState
							})
						}
						else {
							this.setState(prevState => {
								prevState.events[date][index].calendars.push(calendar)

								return prevState
							})
						}
					})
				}).catch((response) => {
					// On a aucun évènement à ajouter
				})
			})
		}
	}

	renderEventCalendars(calendars) {
		const style = {
			flexDirection: 'row',
			bottom: 0,
			marginTop: 10
		}

		const calendarStyle = {
			padding: 5,
			marginRight: 5,
			borderRadius: 5,
		}

		return (
			<View style={ style }>
				{ calendars.map((calendar, index) => (
					<View style={[ calendarStyle, { backgroundColor: calendar.color } ]}
						key={ index }
					>
						<Text style={{ fontSize: 12, color: ColorUtils.invertColor(calendar.color, true) }}>
							{ calendar.name }
						</Text>
					</View>
				)) }
			</View>
		)
	}

	renderEvent(event) {
		const style = [
			styles.event,
		]

		if (event.full_day)
			var time = 'La journée'
		else
			var time = moment(event.begin_at).format('HH:mm') + ' - ' + moment(event.end_at).format('HH:mm')

		return (
			<TouchableHighlight style={ style }
				onPress={ () => this.seeEvent(event.id) }
				underlayColor={"#fff0"}
			>
				<View>
					<Text style={{ fontSize: 17 }}>{ time }</Text>
					<Text style={{ marginTop: 3, fontWeight: 'bold', fontSize: 18 }}>{ event.name }</Text>
					<Text style={{ fontSize: 12 }}>{ event.location.name }</Text>
					<Text style={{ fontStyle: 'italic', fontSize: 10 }}>{ event.location.place.name }</Text>
					{ this.renderEventCalendars(event.calendars) }
				</View>
			</TouchableHighlight>
		);
	}

	renderEmptyDate() {
		return (
			<View style={styles.emptyDate}><Text></Text></View>
		);
	}

	rowHasChanged(event1, event2) {
		return event1.id !== event2
			|| JSON.stringify(event1.calendars) !== JSON.stringify(event2.calendars);
	}
}

const styles = StyleSheet.create({
	event: {
		backgroundColor: 'white',
		flex: 1,
		borderRadius: 5,
		padding: 10,
		marginRight: 10,
		marginTop: 17
	},
	emptyDate: {
		flex:1,
		paddingTop: 30
	}
});
import React from 'react';
import {socketIo} from '../Functions/api';
import {dateFormat} from '../Functions/handle';

// import {Link} from 'react-router-dom';


class Space extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			path: {
				room: Number(document.location.pathname.split('/')[2]),
				type: document.location.search.split('=')[1],
			},
			position: document.location.search.split('=')[1],
			arrayMessages: [],
		};
		this.onSendMessage = this.onSendMessage.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
		this.showEvent = this.showEvent.bind(this);
		this.run = this.run.bind(this);

		this.stream = null;
	}

	componentDidMount() {
		// ожидание входящего сообщения
		socketIo.on('message_get', (mes) => {
			console.log(mes);
			const {path} = this.state;
			if (mes.space === path.room) {
				const {arrayMessages} = this.state;
				arrayMessages.push(mes);
				this.setState({arrayMessages});
			}
		});
		this.run().then(() => null);
		// this.onReload();
	}

	onSendMessage() {
		const {path} = this.state;
		const message = document.getElementById('message_field').value;
		if (message.length !== 0) {
			document.getElementById('message_field').style.background = '#cccccc50';
			document.getElementById('message_field').value = '';
			// отправка исходящего сообщения
			socketIo.emit('message_send', {
				token: JSON.parse(localStorage.getItem('token')),
				space: path.room,
				cont: message,
			});
		} else {
			document.getElementById('message_field').style.background = '#e74c3c4a';
		}
	}

	handleKeyPress(event) {
		if (event.key === 'Enter') {
			this.onSendMessage();
		}
	}

	showEvent(e) {
		console.log('video call event -->', e);
	}

	async run() {
		// create a short-lived demo room. if you just want to
		// hard-code a meeting link for testing you could do something like
		// this:
		let room = {url: 'https://tensyteam.daily.co/hello'};

		// create a video call iframe and add it to document.body
		// defaults to floating window in the lower right-hand corner
		let callFrame = window.DailyIframe.createFrame(
			document.getElementById('videochat'),
			{
				iframeStyle: {
					position: 'fixed',
					border: 0,
					top: 0, left: 0,
					width: '100%',
					height: '100%'
				}
			});
		callFrame.join({url: 'https://tensyteam.daily.co/hello'});

		// install event handlers that just print out event information
		// to the console
		callFrame.on('loading', this.showEvent)
			.on('loaded', this.showEvent)
			.on('started-camera', this.showEvent)
			.on('camera-error', this.showEvent)
			.on('joining-meeting', this.showEvent)
			.on('joined-meeting', this.showEvent)
			.on('left-meeting', this.showEvent)
			.on('participant-joined', this.showEvent)
			.on('participant-updated', this.showEvent)
			.on('participant-left', this.showEvent)
			.on('recording-started', this.showEvent)
			.on('recording-stopped', this.showEvent)
			.on('recording-stats', this.showEvent)
			.on('recording-error', this.showEvent)
			.on('recording-upload-completed', this.showEvent)
			.on('app-message', this.showEvent)
			.on('input-event', this.showEvent)
			.on('error', this.showEvent);

		// join the room
		await callFrame.join({url: room.url});
		console.log(' You are connected to', callFrame.properties.url, '\n',
			'Use the window.callFrame object to experiment with', '\n',
			'controlling this call. For example, in the console', '\n',
			'try', '\n',
			'    callFrame.participants()', '\n',
			'    callFrame.setLocalVideo(false)', '\n',
			'    callFrame.startScreenShare()');
	}

	render() {
		const {
			arrayMessages,
		} = this.state;
		console.log(arrayMessages);

		return (
			<div id="space">
				<div className="videochat_block" id="videochat">
					{/*<Link id="video_control" to="/">*/}
					{/*	<span>Go back</span>*/}
					{/*</Link>*/}
					{/*<div id="videos">*/}
					{/*	<video id="local" autoPlay controls/>*/}
					{/*	<video id="remote" autoPlay controls/>*/}
					{/*</div>*/}
				</div>
				<div className="chat_block" id="chat">
					<div className="chat_content">
						{arrayMessages.length !== 0 && arrayMessages.map((message) => (
							<div key={message.time}>
								{message.user === JSON.parse(localStorage.getItem('token')) ? (
									<div className="my_message">
										<div className="message_content">
											{message.cont}
										</div>
										<span className="message_date">{dateFormat(message.time * 1000)}</span>
									</div>
								) : (
									<div className="other_message">
										<div className="message_content">
											{message.cont}
										</div>
										<span className="message_date">{dateFormat(message.time * 1000)}</span>
									</div>
								)}
							</div>
						))}
					</div>
					<div className="chat_bottom">
						<input type="text" id="message_field" onKeyPress={(event) => {
							this.handleKeyPress(event);
						}}/>
						<div className="btn" onClick={() => {
							this.onSendMessage();
						}}>Send
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Space;

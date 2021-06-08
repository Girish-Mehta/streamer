import { Component, ElementRef, ViewChild } from '@angular/core';
import firebase from 'firebase';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	title = 'streamer';
	pathToVideo = 'https://cdn.videvo.net/videvo_files/video/premium/video0055/small_watermarked/900-2_900-7123_preview.webm';
	private firebaseConfig: any;
	public chat: Array<string>;
	public name: string = '';
	public message: string = '';
	private chatHistory: any;
	private playHistory: any;
	public showName: boolean = false;
	public showFullScreen: boolean = false;
	public showControls: boolean = false;

	@ViewChild('videoPlayer') videoplayer: ElementRef;

	constructor() {
		// For Firebase JS SDK v7.20.0 and later, measurementId is optional
		this.firebaseConfig = {
			apiKey: "AIzaSyDJrcWyVeAcvKI8mT_bkSzJPv13TFssIpQ",
			authDomain: "gm-streamer.firebaseapp.com",
			projectId: "gm-streamer",
			storageBucket: "gm-streamer.appspot.com",
			messagingSenderId: "752102036178",
			appId: "1:752102036178:web:b5ca02d7947900988d130b",
			measurementId: "G-E8F181VFXL"
		};
	
		firebase.initializeApp(this.firebaseConfig);

		this.chat = [];
		this.showName = true;
		this.showFullScreen = false;
		this.chatHistory = firebase.database().ref('chat/');
		this.chatHistory.on('value', (snapshot) => {
			this.chat = snapshot.val();
		});

		this.playHistory = firebase.database().ref('command/');
		this.playHistory.on('value', (snapshot) => {
			let command = snapshot.val();
			switch(command) {
				case "play": this.play();break;
				case "pause": this.pause();break;
				case "forward": this.forward();break;
				case "reverse": this.reverse();break;
			}
		});
	}

	setName() {
		this.showName = false;
	}

	play() {
		this.videoplayer.nativeElement.play();
		firebase.database().ref('command/').set("play");
	}

	pause() {
		this.videoplayer.nativeElement.pause();
		firebase.database().ref('command/').set("pause");
	}

	forward() {
		this.videoplayer.nativeElement.currentTime += 10;
		firebase.database().ref('command/').set("skip");
	}

	reverse() {
		this.videoplayer.nativeElement.currentTime -= 10;
		firebase.database().ref('command/').set("skip");
	}

	send() {
		let message = this.name + ":" + this.message;
		this.chat.push(message);
		firebase.database().ref('chat/').set(this.chat);
		this.message = "";
	}

	fullscreen() {
		this.showFullScreen = this.showFullScreen ? false : true;
	}

	enableControls() {
		this.showControls = this.showControls ? false : true;
	}
}

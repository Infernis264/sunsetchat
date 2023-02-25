let CHANNEL = "sunsetbyplane";
Chat = {    
	load: function(channel) {
		Chat.vars.channel = channel;
		
		console.log("hi i'm joining", channel);
		
		Chat.loadBootstrap(function() {
			var socket = new ReconnectingWebSocket('wss://irc-ws.chat.twitch.tv', 'irc', { reconnectInterval: 3000 });
			socket.onopen = function(data) {
				socket.send('PASS blah\r\n');
				socket.send('NICK justinfan12345\r\n');
				socket.send('CAP REQ :twitch.tv/commands twitch.tv/tags\r\n');
				socket.send('JOIN #' + Chat.vars.channel + '\r\n');
			};
			socket.onclose = function() {
				console.log("disconnected...")
			};
			socket.onmessage = function(data) {
				data.data.split('\r\n').forEach(function(line) {
					if (!line) return;
					var message = window.parseIRC(line);
					if(!message.command) return;
					switch(message.command) {
						case "PING":
							socket.send('PONG ' + message.params[0]);
						break;
						case "JOIN":
							// Do nothing
						break;
						case "CLEARCHAT":
							// Do nothing
						break;
						case "CLEARMSG":
							// Do nothing
						break;
						case "PRIVMSG":
							if (message.raw.replace(/PRIVMSG.*$/, "").includes("custom-reward-id=930a1978-b7a6-499e-8dc7-ad448d74f79a")) {
								addShootingStarToQueue();
							}
						break;
						default:
							console.log("Missing message", message);
						break;
					}
				});
			};
			Chat.vars.socket = socket;                
		});
	},
	loadBootstrap: async function(callback) {
		let result = await fetch('https://nightdev.com/api/1/kapchat/channels/' + encodeURIComponent(Chat.vars.channel) + '/bootstrap');
		let data = await result.json();
		Chat.vars.channelId = data.channel.id;
		Chat.vars.badges = data.badges;
		Chat.vars.cheers = data.cheermotes;
		callback(true);
	},
	vars: {
		socket: null,
		channel: null,
		extraEmotes: {},
		proEmotes: {},
		spammers: [],
		cheers: {},
		badges: {},
	}
};

window.onload = () => {
	Chat.load(CHANNEL);
}
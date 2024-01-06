document.addEventListener("DOMContentLoaded", async function () {
	let liveStatus = await fetch('https://ln3sjx3k5vktsrgwmwwpn56bue0jeeht.lambda-url.us-east-1.on.aws/', {
		headers: {
			"Content-type": "application/json"
		},
		method: 'GET',
	})
		.then(response => { return response.text(); })
		.then(function (data) { return JSON.stringify(data); });

	liveStatus = liveStatus.replace(/["']/g, "");
	console.log(`function returned: ${liveStatus}`);

	let background = document.getElementById('html-background');
	let title = document.getElementById('answer-text');
	let subtitle = document.getElementById('answer-subtext');

	if (liveStatus == 'live') {
		background.classList.add('bg-color-live');
		title.innerText = 'Yes!'
		subtitle.innerText = 'Whallop is live.'
		document.title = 'Whallop is live.'
	}
	else if (liveStatus == 'not live') {
		background.classList.add('bg-color-notlive');
		title.innerText = 'No.'
		subtitle.innerText = 'Whallop is not live.'
		document.title = 'Whallop is not live.'
	}
	else {
		background.classList.add('bg-color-unknown');
		title.classList.add('has-text-light');
		subtitle.classList.add('has-text-light');
		title.innerText = 'Unknown...'
		subtitle.innerText = 'We\'re not sure if Whallop is live. The developer has been alerted to this error.\nNo action is needed from you at the moment.'
		document.title = 'We\'re not sure if Whallop is live.'
		sendErrorAlert(liveStatus, navigator)
	}

	function progress(timeleft, timetotal, $element) {
		var progressBarWidth = timeleft * $element.width() / timetotal;
		$element.find('div').animate({ width: progressBarWidth }, timeleft == timetotal ? 0 : 1000, "linear");
		if (timeleft > 0) {
			setTimeout(function () {
				progress(timeleft - 1, timetotal, $element);
			}, 1000);
		}
	};

	progress(60, 60, $('#progressBar'));
});

async function sendDiscordMsg(webhookBody) {
	fetch('https://wovgbv3zcyvkcur6fgffl5fohe0vnbkl.lambda-url.us-east-1.on.aws/', {
		headers: {
			"Content-type": "application/json"
		},
		method: 'post',
		body: JSON.stringify({
			webhookBody: webhookBody
		})
	})
		.then(response => {
			return response.json();
		})
		.then(function (data) {
			console.log(`error alert status: ${data}`);
			return data;
		});
}

async function sendErrorAlert(errorMsg, navigator) {
	const currIsoTime = new Date().toISOString();

	var nAgt = navigator.userAgent;
	var browserName = navigator.appName;
	var majorVersion = parseInt(navigator.appVersion, 10);
	var nameOffset, verOffset, ix;

	// In Opera, the true version is after "Opera" or after "Version"
	if ((verOffset = nAgt.indexOf("Opera")) != -1) {
		browserName = "Opera";
		fullVersion = nAgt.substring(verOffset + 6);
		if ((verOffset = nAgt.indexOf("Version")) != -1)
			fullVersion = nAgt.substring(verOffset + 8);
	}
	// In MSIE, the true version is after "MSIE" in userAgent
	else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
		browserName = "Internet Explorer";
		fullVersion = nAgt.substring(verOffset + 5);
	}
	// In Chrome, the true version is after "Chrome" 
	else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
		browserName = "Chrome";
		fullVersion = nAgt.substring(verOffset + 7);
	}
	// In Safari, the true version is after "Safari" or after "Version" 
	else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
		browserName = "Safari";
		fullVersion = nAgt.substring(verOffset + 7);
		if ((verOffset = nAgt.indexOf("Version")) != -1)
			fullVersion = nAgt.substring(verOffset + 8);
	}
	// In Firefox, the true version is after "Firefox" 
	else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
		browserName = "Firefox";
		fullVersion = nAgt.substring(verOffset + 8);
	}
	// In most other browsers, "name/version" is at the end of userAgent 
	else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
		(verOffset = nAgt.lastIndexOf('/'))) {
		browserName = nAgt.substring(nameOffset, verOffset);
		fullVersion = nAgt.substring(verOffset + 1);
		if (browserName.toLowerCase() == browserName.toUpperCase()) {
			browserName = navigator.appName;
		}
	}

	majorVersion = parseInt('' + fullVersion, 10);
	if (isNaN(majorVersion)) {
		fullVersion = '' + parseFloat(navigator.appVersion);
	}

	browserInfo = `**Browser name:** ${browserName} ${majorVersion}\n**Cookies Enabled:** ${navigator.cookieEnabled}\n**Platform:** ${navigator.platform}`;
	var discordMessage = {
		"embeds": [
			{
				"title": `is.whallop.live error alert`,
				"description": `An error has occured for a user on: https://is.whallop.live\n\nDetails about the error:\n**${errorMsg}**\n\nUser's browser info:\n${browserInfo}`,
				"color": 0xED4337,
				"timestamp": `${currIsoTime}`
			}
		],
		"username": "is.whallop.live error alerting",
		"avatar_url": "https://i.imgur.com/OLLgdAK.png",
	};

	await sendDiscordMsg(discordMessage);
}
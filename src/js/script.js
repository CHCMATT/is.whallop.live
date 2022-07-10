document.addEventListener("DOMContentLoaded", async function() {

	let liveStatus = await fetch('https://ln3sjx3k5vktsrgwmwwpn56bue0jeeht.lambda-url.us-east-1.on.aws/', {
		headers: {
			"Content-type": "application/json"
		},
		method: 'GET',
	})
	.then(response => { return response.text(); })
	.then(function(data) { return JSON.stringify(data); });
	liveStatus = liveStatus.replace(/["']/g, "");

	let background = document.getElementById('html-background');
	let title = document.getElementById('answer-text');
	let subtitle = document.getElementById('answer-subtext');
	if (liveStatus == 'live') {
		background.classList.add('bg-color-live');
		title.innerText = 'Yes!'
		subtitle.innerText = 'Whallop is live.'
	}
	else if (liveStatus == 'not live') {
		background.classList.add('bg-color-notlive');
		title.innerText = 'No.'
		subtitle.innerText = 'Whallop is not live.'
	}
	else {
		background.classList.add('bg-color-unknown');
		title.classList.add('has-text-light');
		subtitle.classList.add('has-text-light');
		title.innerText = 'Unknown...'
		subtitle.innerText = 'We\'re not sure if Whallop is live or not.'
	}
});


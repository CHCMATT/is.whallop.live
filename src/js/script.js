document.addEventListener("DOMContentLoaded", function() {
	var liveStatus = 'not live';

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

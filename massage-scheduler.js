var casper = require('casper').create(),
	colorizer = require('colorizer').create('Colorizer'),
	usageInfo = 'Usage: `$ casperjs massage-scheduler.js some.example@email.com somePassword`';

// log in
// email and password are passed in as options or as arguments, in that order
casper.start('http://www.infinitemassage.com', function() {

	this.echo('\nInitialized massage-scheduler at ' + new Date().toUTCString());

	var email = casper.cli.args[0],
		password = casper.cli.args[1];

	if (!email) {
		this.die('Error: need to provide an email.\n' + usageInfo);
	}

	if (!password) {
		this.die('Error: need to provide a password.\n' + usageInfo);
	}

	// this.echo('attempting to log in; current url: ' + this.getCurrentUrl(), 'INFO');

    this.fillSelectors('form', {
    	'input[name="email"]' : email,
    	'input[name="password"]' : password
    }, true);

});

// click last available date
casper.then(function(){

	var url = this.getCurrentUrl();

	if (url === 'http://infinitemassage.com/schedule/login.php') {
		this.die('Login failed: perhaps you provided incorrect login info?\n' + usageInfo);
	}
	
	// this.echo('login success, current url: ' + url, 'INFO');

	this.click('.table tr:last-child td a');

});

// book the last available appointment
casper.then(function(){
	
	this.echo('navigation to appointment page success, current url: ' + this.getCurrentUrl(), 'INFO');

	var lastAvailableAppointment,
		bookedAppointments = document.getElementsByClassName('bluerow'),
		availableAppointments = document.getElementsByClassName('greenrow');

	if (bookedAppointments.length) {

		this.echo('You already have an appointment booked for ' + bookedAppointment.parentElement.children[0].textContent, 'INFO');

		this.bypass(1);

	} else if (!availableAppointments.length) {
	
		this.echo('No available appointments.', 'WARNING');

		this.bypass(1);
	
	} else {

		lastAvailableAppointment = availableAppointments[availableAppointments.length - 1].parentElement;

		this.echo('Booking appointment from ' + lastAvailableAppointment.children[0].textContent + ' to ' + lastAvailableAppointment.children[1].textContent + '...', 'INFO');

		lastAvailableAppointment.children[lastAvailableAppointment.children.length - 1].children[0].click();
	
	}
});

// success confirmation
casper.then(function(){

	this.echo('Success!', 'GREEN_BAR')

});

casper.run();
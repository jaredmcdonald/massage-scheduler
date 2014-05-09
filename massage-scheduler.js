var casper = require('casper').create({
    	clientScripts: ['libs/jquery.min.js']
	}),
	colorizer = require('colorizer').create('Colorizer'),
	usageInfo = 'Usage: `$ casperjs massage-scheduler.js some.example@email.com somePassword`';


// DOM utilities
function getBookedAppointmentDetails() {
	var $row = $('.bluerow').parent('tr');
	return $row.find('td:eq(0)').text() + '-' + $row.find('td:eq(1)').text();
}

function getMassageDate() {
	return $('.page_header').siblings('table').find('tr:eq(0) td:eq(3)').text();
}

function getMasseuse() {
	return $('.page_header').siblings('table').find('tr:eq(2) td:eq(1)').text();
}

// log in
// email and password are passed in as options or as arguments, in that order
casper.start('http://www.infinitemassage.com', function() {

	this.echo('\nInitialized massage-scheduler at ' + new Date().toLocaleString());

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

// book the first available appointment
casper.then(function(){

	this.echo('Checking appointments on ' + this.evaluate(getMassageDate) + ' with ' + this.evaluate(getMasseuse) + '...');

	// this.echo('navigation to appointment page success, current url: ' + this.getCurrentUrl(), 'INFO');

	if (this.exists('.bluerow')) {

		var bookedAppointmentDetails = this.evaluate(getBookedAppointmentDetails);

		this.echo('You already have an appointment booked.\nDetails: ' + bookedAppointmentDetails, 'INFO');

		this.bypass(1);

	} else if (!this.exists('.greenrow')) {

		this.echo('No available appointments.', 'WARNING');

		this.bypass(1);

	} else {

		this.echo('Booking appointment...', 'INFO');

		this.click('.greenrow~td a')

	}
});

// success confirmation
casper.then(function(){

	this.echo('Success!\n' + 
		'Booked appointment for ' + this.evaluate(getMassageDate) +
		' ' + this.evaluate(getBookedAppointmentDetails) + ' with ' + this.evaluate(getMasseuse), 'GREEN_BAR');

});

casper.run();

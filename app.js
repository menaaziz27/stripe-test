const config = require('./config/keys');
const express = require('express');
const stripe = require('stripe')(config.stripeSecretKey);
const path = require('path');
const exphbs = require('express-handlebars');

app = express();

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
	res.render('index', { stipePublishableKey: config.stripePublishableKey });
});

app.post('/charge', (req, res) => {
	const amount = 2500;
	const data = req.body;
	stripe.customers
		.create({
			email: data.stripeEmail,
			source: data.stripeToken,
		})
		.then(customer => {
			stripe.charges
				.create({
					amount,
					description: 'web development ebook',
					currency: 'usd',
					customer: customer.id,
				})
				.then(charge => res.render('success'));
		});
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`app listening on port : ${PORT}`);
});

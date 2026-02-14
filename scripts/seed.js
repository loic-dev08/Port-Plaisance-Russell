
/**
 * @file seed.js
 * @description Importe data/catways.json et data/reservations.json en base, et crée un admin si variables présentes
 */
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Catway = require('../src/models/Catway');
const Reservation = require('../src/models/Reservation');

dotenv.config();

(async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/port_russell';
    await mongoose.connect(uri);
    console.log('Connecté à MongoDB');

    const catways = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'catways.json'), 'utf8'));
    const reservations = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'reservations.json'), 'utf8'));

    await Catway.deleteMany({});
    await Reservation.deleteMany({});

    await Catway.insertMany(catways);
    await Reservation.insertMany(reservations.map(r=>({ ...r, startDate: new Date(r.startDate), endDate: new Date(r.endDate) })));

    console.log('Données importées ✅');

    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && process.env.ADMIN_USERNAME) {
      const exists = await User.findOne({ email: process.env.ADMIN_EMAIL });
      if (!exists) {
        await User.create({ username: process.env.ADMIN_USERNAME, email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD });
        console.log('Compte admin créé ✅');
      } else {
        console.log('Compte admin déjà existant');
      }
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

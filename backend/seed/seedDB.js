require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');
const Show = require('../models/Show');
const Booking = require('../models/Booking');
const User = require('../models/User');

const movies = [
  {
    title: 'Interstellar',
    description:
      "When Earth's future is threatened by a catastrophic blight, a group of explorers travel through a wormhole near Saturn in search of a new home for humanity. A breathtaking journey through space and time.",
    genre: ['Sci-Fi', 'Drama', 'Adventure'],
    languages: ['English'],
    duration: 169,
    rating: 8.6,
    releaseDate: new Date('2014-11-07'),
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
    director: 'Christopher Nolan',
    poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    trailer: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
  },
  {
    title: 'Inception',
    description:
      'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O. A mind-bending masterpiece.',
    genre: ['Sci-Fi', 'Action', 'Thriller'],
    languages: ['English', 'Hindi'],
    duration: 148,
    rating: 8.8,
    releaseDate: new Date('2010-07-16'),
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Ellen Page', 'Tom Hardy'],
    director: 'Christopher Nolan',
    poster: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    trailer: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
  },
  {
    title: 'The Dark Knight',
    description:
      'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    genre: ['Action', 'Crime', 'Drama'],
    languages: ['English', 'Hindi', 'Tamil'],
    duration: 152,
    rating: 9.0,
    releaseDate: new Date('2008-07-18'),
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Michael Caine'],
    director: 'Christopher Nolan',
    poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    trailer: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
  },
  {
    title: 'Avengers: Endgame',
    description:
      "After the devastating events of Infinity War, the universe is in ruins. The Avengers assemble once more to reverse Thanos's actions and restore balance to the universe.",
    genre: ['Action', 'Sci-Fi', 'Adventure'],
    languages: ['English', 'Hindi', 'Tamil', 'Telugu'],
    duration: 181,
    rating: 8.4,
    releaseDate: new Date('2019-04-26'),
    cast: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo', 'Chris Hemsworth', 'Scarlett Johansson'],
    director: 'Anthony Russo, Joe Russo',
    poster: 'https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg',
    trailer: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
  },
  {
    title: 'Parasite',
    description:
      'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan. A Palme d\'Or winning masterpiece.',
    genre: ['Drama', 'Thriller', 'Comedy'],
    languages: ['Korean'],
    duration: 132,
    rating: 8.5,
    releaseDate: new Date('2019-11-08'),
    cast: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong', 'Choi Woo-shik'],
    director: 'Bong Joon-ho',
    poster: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    trailer: 'https://www.youtube.com/watch?v=5xH0HfJHsaY',
  },
  {
    title: 'RRR',
    description:
      'A fictional story about two legendary Indian revolutionaries, Alluri Sitarama Raju and Komaram Bheem, and their period of absence before they joined the Indian Independence Movement.',
    genre: ['Action', 'Drama', 'History'],
    languages: ['Telugu', 'Hindi', 'Tamil'],
    duration: 187,
    rating: 7.8,
    releaseDate: new Date('2022-03-25'),
    cast: ['N.T. Rama Rao Jr.', 'Ram Charan', 'Ajay Devgn', 'Alia Bhatt'],
    director: 'S. S. Rajamouli',
    poster: 'https://image.tmdb.org/t/p/w500/u0XUBNQWlOvrh0Gd97ARGpIkL0.jpg',
    trailer: 'https://www.youtube.com/watch?v=f_vbAtFSEc0',
  },
  {
    title: 'Oppenheimer',
    description:
      'The story of J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II. A haunting exploration of science, ethics, and consequence.',
    genre: ['Drama', 'History', 'Thriller'],
    languages: ['English'],
    duration: 180,
    rating: 8.5,
    releaseDate: new Date('2023-07-21'),
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.'],
    director: 'Christopher Nolan',
    poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    trailer: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
  },
  {
    title: 'Spider-Man: No Way Home',
    description:
      "Peter Parker's identity is revealed. He asks Doctor Strange for help, but when the spell goes wrong, dangerous enemies from other worlds start to appear. The multiverse is open.",
    genre: ['Action', 'Sci-Fi', 'Adventure'],
    languages: ['English', 'Hindi', 'Tamil', 'Telugu'],
    duration: 148,
    rating: 8.2,
    releaseDate: new Date('2021-12-17'),
    cast: ['Tom Holland', 'Zendaya', 'Benedict Cumberbatch', 'Jamie Foxx'],
    director: 'Jon Watts',
    poster: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
    trailer: 'https://www.youtube.com/watch?v=JfVOs4VSpmA',
  },
];

const theatres = [
  {
    name: 'PVR Cinemas - Phoenix Mall',
    location: 'Phoenix Marketcity, Whitefield',
    city: 'Bangalore',
    totalSeats: 120,
    rows: 10,
    seatsPerRow: 12,
  },
  {
    name: 'INOX - Forum Mall',
    location: 'Forum Mall, Koramangala',
    city: 'Bangalore',
    totalSeats: 100,
    rows: 10,
    seatsPerRow: 10,
  },
  {
    name: 'Cinepolis - VR Chennai',
    location: 'VR Mall, Anna Nagar',
    city: 'Chennai',
    totalSeats: 110,
    rows: 10,
    seatsPerRow: 11,
  },
  {
    name: 'AMB Cinemas - Gachibowli',
    location: 'SLN Terminus, Gachibowli',
    city: 'Hyderabad',
    totalSeats: 130,
    rows: 10,
    seatsPerRow: 13,
  },
];

const showTimes = ['10:00 AM', '01:30 PM', '04:00 PM', '07:00 PM', '10:00 PM'];
const prices = [180, 220, 250, 280, 320];

const getDatesFromToday = (numDays) => {
  const dates = [];
  for (let i = 0; i < numDays; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    d.setHours(0, 0, 0, 0);
    dates.push(d);
  }
  return dates;
};

const seedDB = async () => {
  try {
    await connectDB();
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      Movie.deleteMany({}),
      Theatre.deleteMany({}),
      Show.deleteMany({}),
      Booking.deleteMany({}),
    ]);

    console.log('🎬 Seeding movies...');
    const createdMovies = await Movie.insertMany(movies);

    console.log('🏛️  Seeding theatres...');
    const createdTheatres = await Theatre.insertMany(theatres);

    console.log('🎟️  Seeding shows...');
    const showsToCreate = [];
    const dates = getDatesFromToday(14); // 14 days of shows

    for (const movie of createdMovies) {
      for (const theatre of createdTheatres) {
        for (const date of dates.slice(0, 7)) { // 7 days per movie-theatre combo
          // Pick 2-3 random showtimes
          const numShowtimes = Math.floor(Math.random() * 2) + 2;
          const shuffledTimes = showTimes.sort(() => 0.5 - Math.random()).slice(0, numShowtimes);
          for (const time of shuffledTimes) {
            const price = prices[Math.floor(Math.random() * prices.length)];
            showsToCreate.push({
              movie: movie._id,
              theatre: theatre._id,
              date,
              time,
              price,
              bookedSeats: [],
            });
          }
        }
      }
    }

    await Show.insertMany(showsToCreate);
    console.log(`✅ Created ${showsToCreate.length} shows`);
    console.log(`✅ Seeded ${createdMovies.length} movies and ${createdTheatres.length} theatres`);
    console.log('\n🎉 Database seeded successfully! You can now start the server.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedDB();

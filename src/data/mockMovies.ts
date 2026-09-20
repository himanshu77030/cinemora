import { Movie, MovieCredits, MovieVideo, TrendingActor } from '../types';

export const CURATED_MOVIES: Movie[] = [
  {
    id: 693134,
    title: 'Dune: Part Two',
    original_title: 'Dune: Part Two',
    overview: 'Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.',
    poster_path: '/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    backdrop_path: '/xOMo8BRK7PfcJv9JCnx7s520Wio.jpg',
    vote_average: 8.2,
    vote_count: 5420,
    release_date: '2024-03-01',
    genre_ids: [878, 12],
    runtime: 166,
    tagline: 'Long live the fighters.',
    status: 'Released',
    budget: 190000000,
    revenue: 711844358,
    original_language: 'en',
    popularity: 420.5,
    production_companies: [
      { id: 923, name: 'Legendary Pictures', logo_path: '/80f68c347.png', origin_country: 'US' },
      { id: 174, name: 'Warner Bros. Pictures', logo_path: '/I637042.png', origin_country: 'US' }
    ],
    spoken_languages: [{ english_name: 'English', iso_639_1: 'en', name: 'English' }]
  },
  {
    id: 872585,
    title: 'Oppenheimer',
    original_title: 'Oppenheimer',
    overview: 'The story of J. Robert Oppenheimer’s role in the development of the atomic bomb during World War II, probing the moral complexity, personal cost, and catastrophic consequences of human scientific achievement.',
    poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdrop_path: '/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    vote_average: 8.1,
    vote_count: 9140,
    release_date: '2023-07-21',
    genre_ids: [18, 36],
    runtime: 180,
    tagline: 'The world forever changes.',
    status: 'Released',
    budget: 100000000,
    revenue: 957000000,
    original_language: 'en',
    popularity: 380.2,
    production_companies: [
      { id: 33, name: 'Universal Pictures', logo_path: null, origin_country: 'US' },
      { id: 9996, name: 'Syncopy', logo_path: null, origin_country: 'GB' }
    ],
    spoken_languages: [{ english_name: 'English', iso_639_1: 'en', name: 'English' }]
  },
  {
    id: 157336,
    title: 'Interstellar',
    original_title: 'Interstellar',
    overview: 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
    poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdrop_path: '/pbrkL804c8yAv3zBZR4QPEafpAR.jpg',
    vote_average: 8.4,
    vote_count: 36200,
    release_date: '2014-11-07',
    genre_ids: [12, 18, 878],
    runtime: 169,
    tagline: 'Mankind was born on Earth. It was never meant to die here.',
    status: 'Released',
    budget: 165000000,
    revenue: 730000000,
    original_language: 'en',
    popularity: 340.8,
    production_companies: [
      { id: 923, name: 'Legendary Pictures', logo_path: null, origin_country: 'US' },
      { id: 9996, name: 'Syncopy', logo_path: null, origin_country: 'GB' },
      { id: 4, name: 'Paramount Pictures', logo_path: null, origin_country: 'US' }
    ],
    spoken_languages: [{ english_name: 'English', iso_639_1: 'en', name: 'English' }]
  },
  {
    id: 155,
    title: 'The Dark Knight',
    original_title: 'The Dark Knight',
    overview: 'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.',
    poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdrop_path: '/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg',
    vote_average: 8.5,
    vote_count: 33400,
    release_date: '2008-07-18',
    genre_ids: [18, 28, 80, 53],
    runtime: 152,
    tagline: 'Welcome to a world without rules.',
    status: 'Released',
    budget: 185000000,
    revenue: 1004558444,
    original_language: 'en',
    popularity: 310.4,
    production_companies: [
      { id: 174, name: 'Warner Bros. Pictures', logo_path: null, origin_country: 'US' },
      { id: 923, name: 'Legendary Pictures', logo_path: null, origin_country: 'US' }
    ],
    spoken_languages: [{ english_name: 'English', iso_639_1: 'en', name: 'English' }]
  },
  {
    id: 569094,
    title: 'Spider-Man: Across the Spider-Verse',
    original_title: 'Spider-Man: Across the Spider-Verse',
    overview: 'After reuniting with Gwen Stacy, Brooklyn’s full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters the Spider-Society, a team of Spider-People charged with protecting the Multiverse’s very existence. But when the heroes clash on how to handle a new threat, Miles finds himself pitted against the other Spiders and must redefine what it means to be a hero so he can save the people he loves most.',
    poster_path: '/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    backdrop_path: '/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    vote_average: 8.4,
    vote_count: 7300,
    release_date: '2023-06-02',
    genre_ids: [16, 28, 12, 878],
    runtime: 140,
    tagline: 'It’s how you wear the mask that matters.',
    status: 'Released',
    budget: 100000000,
    revenue: 690516673,
    original_language: 'en',
    popularity: 290.1,
    production_companies: [
      { id: 5, name: 'Columbia Pictures', logo_path: null, origin_country: 'US' },
      { id: 2251, name: 'Sony Pictures Animation', logo_path: null, origin_country: 'US' }
    ],
    spoken_languages: [{ english_name: 'English', iso_639_1: 'en', name: 'English' }]
  },
  {
    id: 27205,
    title: 'Inception',
    original_title: 'Inception',
    overview: 'Cobb, a skilled thief who steals corporate secrets through the use of dream-sharing technology, is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
    poster_path: '/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    backdrop_path: '/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
    vote_average: 8.4,
    vote_count: 36700,
    release_date: '2010-07-16',
    genre_ids: [28, 878, 12],
    runtime: 148,
    tagline: 'Your mind is the scene of the crime.',
    status: 'Released',
    budget: 160000000,
    revenue: 836836967,
    original_language: 'en',
    popularity: 280.9,
    production_companies: [
      { id: 174, name: 'Warner Bros. Pictures', logo_path: null, origin_country: 'US' },
      { id: 923, name: 'Legendary Pictures', logo_path: null, origin_country: 'US' }
    ],
    spoken_languages: [{ english_name: 'English', iso_639_1: 'en', name: 'English' }]
  },
  {
    id: 558449,
    title: 'Gladiator II',
    original_title: 'Gladiator II',
    overview: 'Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius must enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome with an iron fist. With rage in his heart and the future of the Empire at stake, Lucius must look to his past to find strength.',
    poster_path: '/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg',
    backdrop_path: '/euYIwmqkmz95mnXvufEmbL69mZ9.jpg',
    vote_average: 7.0,
    vote_count: 2800,
    release_date: '2024-11-22',
    genre_ids: [28, 12, 18],
    runtime: 148,
    tagline: 'Prepare to be entertained.',
    status: 'Released',
    budget: 250000000,
    revenue: 462000000,
    original_language: 'en',
    popularity: 450.7,
    production_companies: [
      { id: 4, name: 'Paramount Pictures', logo_path: null, origin_country: 'US' },
      { id: 1645, name: 'Scott Free Productions', logo_path: null, origin_country: 'US' }
    ],
    spoken_languages: [{ english_name: 'English', iso_639_1: 'en', name: 'English' }]
  },
  {
    id: 496243,
    title: 'Parasite',
    original_title: '기생충',
    overview: 'All unemployed, Ki-taek’s family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.',
    poster_path: '/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    backdrop_path: '/hiKmpZMGZsrkA3cdEv9aOsIbXZC.jpg',
    vote_average: 8.5,
    vote_count: 18400,
    release_date: '2019-10-11',
    genre_ids: [35, 53, 18],
    runtime: 132,
    tagline: 'Act like you own the place.',
    status: 'Released',
    budget: 11400000,
    revenue: 263100000,
    original_language: 'ko',
    popularity: 240.3,
    production_companies: [
      { id: 4399, name: 'CJ Entertainment', logo_path: null, origin_country: 'KR' },
      { id: 7036, name: 'Barunson E&A', logo_path: null, origin_country: 'KR' }
    ],
    spoken_languages: [{ english_name: 'Korean', iso_639_1: 'ko', name: '한국어/조선말' }]
  },
  {
    id: 335984,
    title: 'Blade Runner 2049',
    original_title: 'Blade Runner 2049',
    overview: 'Thirty years after the events of the first film, a new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what’s left of society into chaos. K’s discovery leads him on a quest to find Rick Deckard, a former LAPD blade runner who has been missing for 30 years.',
    poster_path: '/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg',
    backdrop_path: '/ilRyAZwN39G5iG2z2wS1jU887eD.jpg',
    vote_average: 8.0,
    vote_count: 13500,
    release_date: '2017-10-06',
    genre_ids: [878, 18, 9648],
    runtime: 164,
    tagline: 'There are still pages left in your story.',
    status: 'Released',
    budget: 150000000,
    revenue: 259239658,
    original_language: 'en',
    popularity: 210.6,
    production_companies: [
      { id: 4922, name: 'Alcon Entertainment', logo_path: null, origin_country: 'US' },
      { id: 5, name: 'Columbia Pictures', logo_path: null, origin_country: 'US' }
    ],
    spoken_languages: [{ english_name: 'English', iso_639_1: 'en', name: 'English' }]
  },
  {
    id: 545611,
    title: 'Everything Everywhere All at Once',
    original_title: 'Everything Everywhere All at Once',
    overview: 'An aging Chinese immigrant is swept up in an insane adventure, where she alone can save what’s important to her by connecting with the lives she could have led in other universes.',
    poster_path: '/w3LxiVYPq6ABGxd8OEjNzy21qgu.jpg',
    backdrop_path: '/ss0HgUtMM9hgEiVh9ne6W1NsVOV.jpg',
    vote_average: 7.8,
    vote_count: 6100,
    release_date: '2022-03-25',
    genre_ids: [28, 12, 878, 35],
    runtime: 139,
    tagline: 'The universe is so much bigger than you realize.',
    status: 'Released',
    budget: 25000000,
    revenue: 143411000,
    original_language: 'en',
    popularity: 230.2,
    production_companies: [
      { id: 41077, name: 'A24', logo_path: null, origin_country: 'US' },
      { id: 82819, name: 'AGBO', logo_path: null, origin_country: 'US' }
    ],
    spoken_languages: [{ english_name: 'English', iso_639_1: 'en', name: 'English' }]
  },
  {
    id: 129,
    title: 'Spirited Away',
    original_title: '千と千尋の神隠し',
    overview: 'A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had to free her family and return to the outside world.',
    poster_path: '/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
    backdrop_path: '/mSDmvTKvjB3c4731hE4qT3s22s.jpg',
    vote_average: 8.5,
    vote_count: 16800,
    release_date: '2001-07-20',
    genre_ids: [16, 14, 10751],
    runtime: 125,
    tagline: 'Tunnel to another world.',
    status: 'Released',
    budget: 19000000,
    revenue: 395800000,
    original_language: 'ja',
    popularity: 220.4,
    production_companies: [
      { id: 10342, name: 'Studio Ghibli', logo_path: null, origin_country: 'JP' }
    ],
    spoken_languages: [{ english_name: 'Japanese', iso_639_1: 'ja', name: '日本語' }]
  },
  {
    id: 1022789,
    title: 'Inside Out 2',
    original_title: 'Inside Out 2',
    overview: 'Teenager Riley’s mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions! Joy, Sadness, Anger, Fear and Disgust aren’t sure how to feel when Anxiety shows up.',
    poster_path: '/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
    backdrop_path: '/stKGOmbuwhLfqj3u7Y11Tq0t3T5.jpg',
    vote_average: 7.6,
    vote_count: 5120,
    release_date: '2024-06-14',
    genre_ids: [16, 10751, 12, 35],
    runtime: 96,
    tagline: 'Make room for new emotions.',
    status: 'Released',
    budget: 200000000,
    revenue: 1698000000,
    original_language: 'en',
    popularity: 390.4,
    production_companies: [
      { id: 2, name: 'Walt Disney Pictures', logo_path: null, origin_country: 'US' },
      { id: 3, name: 'Pixar', logo_path: null, origin_country: 'US' }
    ],
    spoken_languages: [{ english_name: 'English', iso_639_1: 'en', name: 'English' }]
  },
  {
    id: 76600,
    title: 'Avatar: The Way of Water',
    original_title: 'Avatar: The Way of Water',
    overview: 'Set more than a decade after the events of the first film, learn the story of the Sully family (Jake, Neytiri, and their kids), the trouble that follows them, the lengths they go to keep each other safe, the battles they fight to stay alive, and the tragedies they endure.',
    poster_path: '/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
    backdrop_path: '/s16H6tpK2utvwDtzZIMQvR6Eal.jpg',
    vote_average: 7.6,
    vote_count: 11400,
    release_date: '2022-12-16',
    genre_ids: [878, 12, 28],
    runtime: 192,
    tagline: 'Return to Pandora.',
    status: 'Released',
    budget: 350000000,
    revenue: 2320250281,
    original_language: 'en',
    popularity: 310.1,
    production_companies: [
      { id: 574, name: 'Lightstorm Entertainment', logo_path: null, origin_country: 'US' },
      { id: 25, name: '20th Century Studios', logo_path: null, origin_country: 'US' }
    ],
    spoken_languages: [{ english_name: 'English', iso_639_1: 'en', name: 'English' }]
  },
  {
    id: 666277,
    title: 'Past Lives',
    original_title: 'Past Lives',
    overview: 'Nora and Hae Sung, two deeply connected childhood friends, are wrested apart after Nora’s family emigrates from South Korea. Two decades later, they are reunited in New York for one fateful week as they confront notions of destiny, love, and the choices that make a life.',
    poster_path: '/k3waqVXSnvCZWfJYNtdamTgTtTA.jpg',
    backdrop_path: '/9Y9xnwP5m2v2j0wM9b8xY9wA6m.jpg',
    vote_average: 7.9,
    vote_count: 1980,
    release_date: '2023-06-02',
    genre_ids: [18, 10749],
    runtime: 106,
    tagline: 'In-Yun connects two souls across lives.',
    status: 'Released',
    budget: 12000000,
    revenue: 42000000,
    original_language: 'en',
    popularity: 180.5,
    production_companies: [
      { id: 41077, name: 'A24', logo_path: null, origin_country: 'US' },
      { id: 1088, name: 'Killer Films', logo_path: null, origin_country: 'US' }
    ],
    spoken_languages: [{ english_name: 'English', iso_639_1: 'en', name: 'English' }, { english_name: 'Korean', iso_639_1: 'ko', name: '한국어' }]
  },
  {
    id: 238,
    title: 'The Godfather',
    original_title: 'The Godfather',
    overview: 'Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers, launching a campaign of bloody revenge.',
    poster_path: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    backdrop_path: '/tmU7GeKVybMWFButWEGl2M4GeiP.jpg',
    vote_average: 8.7,
    vote_count: 20100,
    release_date: '1972-03-24',
    genre_ids: [18, 80],
    runtime: 175,
    tagline: 'An offer you can’t refuse.',
    status: 'Released',
    budget: 6000000,
    revenue: 245066411,
    original_language: 'en',
    popularity: 260.4,
    production_companies: [
      { id: 4, name: 'Paramount Pictures', logo_path: null, origin_country: 'US' },
      { id: 10211, name: 'Alfran Productions', logo_path: null, origin_country: 'US' }
    ],
    spoken_languages: [{ english_name: 'English', iso_639_1: 'en', name: 'English' }]
  },
  {
    id: 424,
    title: 'Schindler’s List',
    original_title: 'Schindler’s List',
    overview: 'The true story of how businessman Oskar Schindler saved over a thousand Jewish lives from the Nazis while exploiting them as workers in his factory during World War II.',
    poster_path: '/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg',
    backdrop_path: '/zb6fM1CX41D9r69hdYvv90R00.jpg',
    vote_average: 8.6,
    vote_count: 15600,
    release_date: '1993-12-15',
    genre_ids: [18, 36, 10752],
    runtime: 195,
    tagline: 'Whoever saves one life, saves the world entire.',
    status: 'Released',
    budget: 22000000,
    revenue: 322161245,
    original_language: 'en',
    popularity: 205.2,
    production_companies: [
      { id: 56, name: 'Amblin Entertainment', logo_path: null, origin_country: 'US' },
      { id: 33, name: 'Universal Pictures', logo_path: null, origin_country: 'US' }
    ],
    spoken_languages: [{ english_name: 'English', iso_639_1: 'en', name: 'English' }]
  },
  {
    id: 533535,
    title: 'Deadpool & Wolverine',
    original_title: 'Deadpool & Wolverine',
    overview: 'A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him. But when his homeworld faces an existential threat, Wade must reluctantly suit-up again with an even more reluctant Wolverine.',
    poster_path: '/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    backdrop_path: '/yDHYTfA3R0jFYba16jBB12RRIZ6.jpg',
    vote_average: 7.7,
    vote_count: 6100,
    release_date: '2024-07-26',
    genre_ids: [28, 35, 878],
    runtime: 128,
    tagline: 'Come together.',
    status: 'Released',
    budget: 200000000,
    revenue: 1338000000,
    original_language: 'en',
    popularity: 490.8,
    production_companies: [
      { id: 420, name: 'Marvel Studios', logo_path: null, origin_country: 'US' },
      { id: 104228, name: 'Maximum Effort', logo_path: null, origin_country: 'US' }
    ],
    spoken_languages: [{ english_name: 'English', iso_639_1: 'en', name: 'English' }]
  },
  {
    id: 933260,
    title: 'The Substance',
    original_title: 'The Substance',
    overview: 'A fading celebrity decides to use a black market drug, a cell-replicating substance that temporarily creates a younger, better version of herself, setting off a horrific battle of identity.',
    poster_path: '/lqoMzCcZYEFK729Fc6Zu2p39Fe2.jpg',
    backdrop_path: '/7h6evJe69vh2jhvWsoVToIRdvd.jpg',
    vote_average: 7.3,
    vote_count: 3100,
    release_date: '2024-09-20',
    genre_ids: [27, 878, 18],
    runtime: 141,
    tagline: 'Have you ever dreamt of a better version of yourself?',
    status: 'Released',
    budget: 17500000,
    revenue: 77000000,
    original_language: 'en',
    popularity: 410.2,
    production_companies: [
      { id: 10163, name: 'Working Title Films', logo_path: null, origin_country: 'GB' },
      { id: 41077, name: 'Mubi', logo_path: null, origin_country: 'GB' }
    ],
    spoken_languages: [{ english_name: 'English', iso_639_1: 'en', name: 'English' }]
  },
  {
    id: 1114513,
    title: 'Speak No Evil',
    original_title: 'Speak No Evil',
    overview: 'When an American family is invited to spend the weekend at the idyllic country estate of a charming British family they befriended on vacation, what begins as a dream-holiday soon warps into a snarled psychological nightmare.',
    poster_path: '/fDtkz2aKecOclZ1d1tQj17Yp37.jpg',
    backdrop_path: '/begse2rAnUeeo7AZwPbsq1Y0p1F.jpg',
    vote_average: 7.2,
    vote_count: 1800,
    release_date: '2024-09-13',
    genre_ids: [27, 53],
    runtime: 110,
    tagline: 'Never invite a stranger into your home.',
    status: 'Released',
    budget: 15000000,
    revenue: 76000000,
    original_language: 'en',
    popularity: 290.3,
    production_companies: [
      { id: 3172, name: 'Blumhouse Productions', logo_path: null, origin_country: 'US' }
    ],
    spoken_languages: [{ english_name: 'English', iso_639_1: 'en', name: 'English' }]
  },
  {
    id: 1034541,
    title: 'Terrifier 3',
    original_title: 'Terrifier 3',
    overview: 'Art the Clown is set to unleash chaos on the unsuspecting residents of Miles County as they peacefully drift off to sleep on Christmas Eve.',
    poster_path: '/63xYQOFfvGt13jE01691W92BwUu.jpg',
    backdrop_path: '/18TSJF1WLA4CkymvPGye3Q0jTps.jpg',
    vote_average: 6.9,
    vote_count: 1650,
    release_date: '2024-10-11',
    genre_ids: [27, 53],
    runtime: 125,
    tagline: 'Christmas will never be peaceful again.',
    status: 'Released',
    budget: 2000000,
    revenue: 90000000,
    original_language: 'en',
    popularity: 350.2,
    production_companies: [
      { id: 91195, name: 'Dark Age Cinema', logo_path: null, origin_country: 'US' }
    ],
    spoken_languages: [{ english_name: 'English', iso_639_1: 'en', name: 'English' }]
  },
  {
    id: 912649,
    title: 'Venom: The Last Dance',
    original_title: 'Venom: The Last Dance',
    overview: 'Eddie and Venom are on the run. Hunted by both of their worlds and with the net closing in, the duo are forced into a devastating decision that will bring the curtains down on Venom and Eddie’s last dance.',
    poster_path: '/aosm8NMQ3UyoBVpSxyimorCQykC.jpg',
    backdrop_path: '/3V4kLQg0kSqPLctI5ziYWMEAZYF.jpg',
    vote_average: 6.8,
    vote_count: 2400,
    release_date: '2024-10-25',
    genre_ids: [28, 878, 12],
    runtime: 109,
    tagline: 'Till death do them part.',
    status: 'Released',
    budget: 120000000,
    revenue: 478000000,
    original_language: 'en',
    popularity: 430.2,
    production_companies: [
      { id: 5, name: 'Columbia Pictures', logo_path: null, origin_country: 'US' },
      { id: 420, name: 'Marvel Entertainment', logo_path: null, origin_country: 'US' }
    ],
    spoken_languages: [{ english_name: 'English', iso_639_1: 'en', name: 'English' }]
  },
  {
    id: 1064028,
    title: 'Subservience',
    original_title: 'Subservience',
    overview: 'A struggling father purchases a domestic SIM to help care for his home and family, until she gains awareness and becomes dangerously possessive of his affection.',
    poster_path: '/gBenxR01AHUZAYFFcxoB2guOX3.jpg',
    backdrop_path: '/p5ozvmdgsmbWe0H8uvv7Y83BYmr.jpg',
    vote_average: 6.7,
    vote_count: 980,
    release_date: '2024-09-13',
    genre_ids: [878, 53],
    runtime: 105,
    tagline: 'She will do anything to serve.',
    status: 'Released',
    budget: 8000000,
    revenue: 15000000,
    original_language: 'en',
    popularity: 270.8,
    production_companies: [
      { id: 10221, name: 'Millennium Media', logo_path: null, origin_country: 'US' }
    ],
    spoken_languages: [{ english_name: 'English', iso_639_1: 'en', name: 'English' }]
  }
];

export const MOCK_CREDITS: Record<number, MovieCredits> = {
  693134: {
    id: 693134,
    cast: [
      { id: 1190668, name: 'Timothée Chalamet', character: 'Paul Atreides', profile_path: '/BE2sdjpgsa2rNTFa66UL7aMRL.jpg', known_for_department: 'Acting', popularity: 98.4 },
      { id: 505710, name: 'Zendaya', character: 'Chani', profile_path: '/tyFvN1m3H1b2R163g11.jpg', known_for_department: 'Acting', popularity: 94.2 },
      { id: 1373737, name: 'Florence Pugh', character: 'Princess Irulan', profile_path: '/8hU6m7o87n8V9B0u2.jpg', known_for_department: 'Acting', popularity: 88.5 },
      { id: 1918360, name: 'Austin Butler', character: 'Feyd-Rautha Harkonnen', profile_path: '/j2W0d41K72L9B4N6y.jpg', known_for_department: 'Acting', popularity: 82.1 },
      { id: 934, name: 'Rebecca Ferguson', character: 'Lady Jessica', profile_path: '/lJloTOheuQSirSLXq359.jpg', known_for_department: 'Acting', popularity: 80.3 },
      { id: 16851, name: 'Javier Bardem', character: 'Stilgar', profile_path: '/g38bV9z7UuN16M9Q.jpg', known_for_department: 'Acting', popularity: 75.9 }
    ],
    crew: [
      { id: 137427, name: 'Denis Villeneuve', job: 'Director', department: 'Directing', profile_path: '/vdN9zV5f8y0A2Z1Q.jpg' },
      { id: 137427, name: 'Denis Villeneuve', job: 'Writer', department: 'Writing', profile_path: '/vdN9zV5f8y0A2Z1Q.jpg' },
      { id: 947, name: 'Hans Zimmer', job: 'Original Music Composer', department: 'Sound', profile_path: '/tpQup1vWwVb2w9rV.jpg' },
      { id: 62453, name: 'Greig Fraser', job: 'Director of Photography', department: 'Camera', profile_path: null }
    ]
  },
  872585: {
    id: 872585,
    cast: [
      { id: 2037, name: 'Cillian Murphy', character: 'J. Robert Oppenheimer', profile_path: '/iRHd492fP61K6nN2.jpg', known_for_department: 'Acting', popularity: 95.1 },
      { id: 3223, name: 'Robert Downey Jr.', character: 'Lewis Strauss', profile_path: '/5qHNjhtjMD4YWH3viOqwv.jpg', known_for_department: 'Acting', popularity: 96.3 },
      { id: 5081, name: 'Emily Blunt', character: 'Kitty Oppenheimer', profile_path: '/nPJiqx16Qd1tw1sA.jpg', known_for_department: 'Acting', popularity: 87.2 },
      { id: 1892, name: 'Matt Damon', character: 'Leslie Groves', profile_path: '/elzaapdfd.jpg', known_for_department: 'Acting', popularity: 84.1 },
      { id: 1373737, name: 'Florence Pugh', character: 'Jean Tatlock', profile_path: '/8hU6m7o87n8V9B0u2.jpg', known_for_department: 'Acting', popularity: 88.5 }
    ],
    crew: [
      { id: 525, name: 'Christopher Nolan', job: 'Director', department: 'Directing', profile_path: '/xuAIuYSmsUzKlUMBFGVZa69.jpg' },
      { id: 525, name: 'Christopher Nolan', job: 'Writer', department: 'Writing', profile_path: '/xuAIuYSmsUzKlUMBFGVZa69.jpg' },
      { id: 282, name: 'Emma Thomas', job: 'Producer', department: 'Production', profile_path: null },
      { id: 10449, name: 'Ludwig Göransson', job: 'Original Music Composer', department: 'Sound', profile_path: null }
    ]
  },
  157336: {
    id: 157336,
    cast: [
      { id: 10297, name: 'Matthew McConaughey', character: 'Joseph Cooper', profile_path: '/wDea.jpg', known_for_department: 'Acting', popularity: 91.2 },
      { id: 1813, name: 'Anne Hathaway', character: 'Dr. Amelia Brand', profile_path: '/tL.jpg', known_for_department: 'Acting', popularity: 89.4 },
      { id: 83002, name: 'Jessica Chastain', character: 'Murphy Cooper', profile_path: '/jh.jpg', known_for_department: 'Acting', popularity: 85.3 },
      { id: 3895, name: 'Michael Caine', character: 'Professor Brand', profile_path: '/ca.jpg', known_for_department: 'Acting', popularity: 78.4 }
    ],
    crew: [
      { id: 525, name: 'Christopher Nolan', job: 'Director', department: 'Directing', profile_path: '/xuAIuYSmsUzKlUMBFGVZa69.jpg' },
      { id: 947, name: 'Hans Zimmer', job: 'Original Music Composer', department: 'Sound', profile_path: '/tpQup1vWwVb2w9rV.jpg' }
    ]
  }
};

export const MOCK_VIDEOS: Record<number, MovieVideo[]> = {
  693134: [
    {
      id: '6452ba3933a376012674e2a8',
      iso_639_1: 'en',
      iso_3166_1: 'US',
      key: 'Way9Dexny3w',
      name: 'Official Trailer 3',
      site: 'YouTube',
      size: 1080,
      type: 'Trailer',
      official: true,
      published_at: '2023-12-12T17:00:10.000Z'
    }
  ],
  872585: [
    {
      id: '64582f342f8d09015c7a20c3',
      iso_639_1: 'en',
      iso_3166_1: 'US',
      key: 'uYPbbksJxIg',
      name: 'Official Trailer',
      site: 'YouTube',
      size: 1080,
      type: 'Trailer',
      official: true,
      published_at: '2023-05-08T16:00:20.000Z'
    }
  ],
  157336: [
    {
      id: '533ec654c3a36854480003eb',
      iso_639_1: 'en',
      iso_3166_1: 'US',
      key: 'zSWdZVtXT7E',
      name: 'Official Trailer 3',
      site: 'YouTube',
      size: 1080,
      type: 'Trailer',
      official: true,
      published_at: '2014-07-30T21:40:02.000Z'
    }
  ],
  155: [
    {
      id: '5cd981d09251410b00c3b88b',
      iso_639_1: 'en',
      iso_3166_1: 'US',
      key: 'EXeTwQWrcwY',
      name: 'Official Trailer',
      site: 'YouTube',
      size: 1080,
      type: 'Trailer',
      official: true,
      published_at: '2014-02-12T17:00:00.000Z'
    }
  ],
  569094: [
    {
      id: '63991ad81b729400dbf59ae4',
      iso_639_1: 'en',
      iso_3166_1: 'US',
      key: 'cqGjhVJWtEg',
      name: 'Official Trailer #2',
      site: 'YouTube',
      size: 1080,
      type: 'Trailer',
      official: true,
      published_at: '2023-04-04T13:00:00.000Z'
    }
  ],
  558449: [
    {
      id: '668d2f5a0be5ea694f4c27a9',
      iso_639_1: 'en',
      iso_3166_1: 'US',
      key: '4rgYUipGJNo',
      name: 'Official Trailer',
      site: 'YouTube',
      size: 1080,
      type: 'Trailer',
      official: true,
      published_at: '2024-07-09T13:00:00.000Z'
    }
  ],
  533535: [
    {
      id: '66266ad85ab2c9014b09c2a1',
      iso_639_1: 'en',
      iso_3166_1: 'US',
      key: '73_1biulkYk',
      name: 'Official Trailer',
      site: 'YouTube',
      size: 1080,
      type: 'Trailer',
      official: true,
      published_at: '2024-04-22T13:00:00.000Z'
    }
  ]
};

export const TRENDING_ACTORS: TrendingActor[] = [
  {
    id: 1190668,
    name: 'Timothée Chalamet',
    popularity: 98.4,
    profile_path: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop',
    known_for_department: 'Acting',
    known_for: [CURATED_MOVIES[0]]
  },
  {
    id: 505710,
    name: 'Zendaya',
    popularity: 94.2,
    profile_path: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    known_for_department: 'Acting',
    known_for: [CURATED_MOVIES[0], CURATED_MOVIES[4]]
  },
  {
    id: 2037,
    name: 'Cillian Murphy',
    popularity: 92.6,
    profile_path: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    known_for_department: 'Acting',
    known_for: [CURATED_MOVIES[1], CURATED_MOVIES[3], CURATED_MOVIES[5]]
  },
  {
    id: 1373737,
    name: 'Florence Pugh',
    popularity: 88.5,
    profile_path: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop',
    known_for_department: 'Acting',
    known_for: [CURATED_MOVIES[0], CURATED_MOVIES[1]]
  },
  {
    id: 1918360,
    name: 'Austin Butler',
    popularity: 85.4,
    profile_path: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    known_for_department: 'Acting',
    known_for: [CURATED_MOVIES[0]]
  },
  {
    id: 3223,
    name: 'Robert Downey Jr.',
    popularity: 96.3,
    profile_path: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=400&auto=format&fit=crop',
    known_for_department: 'Acting',
    known_for: [CURATED_MOVIES[1]]
  }
];

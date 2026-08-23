import "dotenv/config";
import { db, pool } from "./db";
import {
  users, packages, destinations, specialOffers, testimonials, bookings,
  InsertPackage, InsertDestination, InsertSpecialOffer, InsertTestimonial
} from "@shared/schema";

async function seed() {
  const existingUsers = await db.select().from(users);
  if (existingUsers.length > 0) {
    console.log("Database already has data, skipping seed.");
    await pool.end();
    return;
  }

  const [adminUser] = await db.insert(users).values({
    name: "Admin User",
    email: "admin@wanderlust.com",
    password: "$2b$10$GzGrcz7w6uzaH3/YmKYz7OovI3Cl4OFdmQ9j3bDOzuqIibd29PDDi", // admin123
    role: "admin",
  }).returning();

  const [regularUser] = await db.insert(users).values({
    name: "John Doe",
    email: "john@example.com",
    password: "$2b$10$GzGrcz7w6uzaH3/YmKYz7OovI3Cl4OFdmQ9j3bDOzuqIibd29PDDi", // admin123
    role: "user",
  }).returning();

  const samplePackages: InsertPackage[] = [
    {
      name: "Santorini Island Escape",
      shortDescription: "Experience the magic of Santorini with its stunning sunsets, blue-domed churches, and crystal-clear waters.",
      description: "Escape to the idyllic island of Santorini, where whitewashed buildings cascade down volcanic cliffs, offering breathtaking views of the Aegean Sea. This carefully crafted package lets you experience the island's unique charm, from its iconic blue-domed churches to its world-famous sunsets. Explore ancient ruins, relax on distinctive beaches with red, black, or white sand, and indulge in authentic Greek cuisine paired with local wines. With comfortable accommodations and expert guides, this Santorini escape promises memories that will last a lifetime.",
      price: 1299,
      duration: 7,
      location: "Santorini, Greece",
      region: "europe",
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
      rating: 4.9,
      reviews: 128,
      groupSize: 12,
      tags: ["Island", "Culture", "Relaxation"],
      highlights: [
        "Watch the famous sunset from Oia",
        "Visit the ancient ruins of Akrotiri",
        "Cruise around the caldera",
        "Wine tasting at local vineyards",
        "Explore the unique black sand beaches"
      ],
      inclusions: [
        "6 nights accommodation in boutique hotels",
        "Daily breakfast",
        "Welcome dinner with Greek specialties",
        "Guided tour of Akrotiri archaeological site",
        "Sunset catamaran cruise with dinner",
        "Wine tasting experience",
        "Airport transfers"
      ],
      exclusions: [
        "International flights",
        "Travel insurance",
        "Personal expenses",
        "Optional activities not mentioned in inclusions",
        "Lunches and some dinners"
      ],
      itinerary: [
        { title: "Arrival in Santorini", description: "Arrival at Santorini Airport and transfer to your hotel in Fira. Evening welcome dinner with local specialties and orientation briefing." },
        { title: "Fira & Firostefani Exploration", description: "Morning walking tour of Fira, the island's capital. Continue to neighboring Firostefani for stunning caldera views. Afternoon at leisure to explore the winding streets and boutique shops." },
        { title: "Ancient Akrotiri & Beach Time", description: "Morning visit to the archaeological site of Akrotiri, a Minoan Bronze Age settlement. Afternoon relaxation at Kamari black sand beach with optional water activities." },
        { title: "Wine & Culture Experience", description: "Visit traditional wineries and taste the unique volcanic wines of Santorini. Afternoon visit to a local art gallery and traditional crafts workshop." },
        { title: "Caldera Cruise", description: "Full-day catamaran cruise around the caldera, visiting hot springs, red beach, and white beach with opportunities for swimming and snorkeling. BBQ lunch onboard." },
        { title: "Oia & Sunset Experience", description: "Morning at leisure. Afternoon transfer to the picturesque village of Oia with its blue-domed churches and winding alleys. Farewell dinner at a cliff-side restaurant while watching the world-famous Santorini sunset." },
        { title: "Departure Day", description: "After breakfast, transfer to Santorini Airport for your departure flight." }
      ],
      gallery: [
        "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
        "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
        "https://images.unsplash.com/photo-1555400038-63f5ba517a47?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500"
      ]
    },
    {
      name: "Bali Tropical Paradise",
      shortDescription: "Discover the enchanting island of Bali with its lush landscapes, ancient temples, and vibrant culture.",
      description: "Immerse yourself in the tropical paradise of Bali, where lush rice terraces, ancient temples, and pristine beaches create a perfect backdrop for an unforgettable adventure. This comprehensive tour takes you through the island's most breathtaking landscapes, from the cultural heart of Ubud to the stunning coastal areas. Experience authentic Balinese culture through traditional dance performances, temple visits, and local craft workshops. Indulge in rejuvenating spa treatments, exciting water activities, and the warm hospitality that has made Bali famous worldwide. Whether you seek spiritual enrichment, adventure, or simply relaxation, this Bali journey offers the perfect blend of experiences.",
      price: 1599,
      duration: 10,
      location: "Bali, Indonesia",
      region: "asia",
      image: "https://pixabay.com/get/gd1cfd9117336e015c18a93ac3d8f2cce204180d3656936f2bbd91cb0b5877892fdda61ad98d72a2cf346edec698ab4ccd7479750fe7bf37d0104c5adca6c8dcc_1280.jpg",
      rating: 4.8,
      reviews: 156,
      groupSize: 14,
      tags: ["Beaches", "Temples", "Adventure"],
      highlights: [
        "Visit the sacred monkey forest sanctuary",
        "Explore the iconic Tegalalang Rice Terraces",
        "Witness the magnificent Uluwatu Temple sunset",
        "Experience traditional Balinese dance performances",
        "Snorkel in crystal clear waters of Nusa Penida"
      ],
      inclusions: [
        "9 nights accommodation in luxury resorts",
        "Daily breakfast and select meals",
        "Private airport transfers",
        "Guided tours and entrance fees",
        "Traditional Balinese massage",
        "Snorkeling equipment",
        "Local English-speaking guides"
      ],
      exclusions: [
        "International flights",
        "Travel insurance",
        "Optional activities not listed in the itinerary",
        "Personal expenses and gratuities",
        "Visa fees (if applicable)"
      ],
      itinerary: [
        { title: "Arrival in Bali", description: "Welcome to Bali! Upon arrival at Ngurah Rai International Airport, transfer to your hotel in Seminyak. Rest of the day at leisure to recover from your flight and enjoy the hotel facilities." },
        { title: "Seminyak Beach & Sunset", description: "Morning at leisure to enjoy Seminyak's beaches. Afternoon shopping tour through stylish boutiques. Evening sunset dinner at a renowned beach club with spectacular ocean views." },
        { title: "Journey to Ubud", description: "After breakfast, transfer to Ubud. En route, visit Batuan Temple and a traditional art village. Afternoon check-in at your Ubud resort surrounded by lush jungle." },
        { title: "Ubud Cultural Immersion", description: "Morning visit to the Sacred Monkey Forest and Ubud Palace. Afternoon traditional craft workshop where you'll try your hand at batik making or wood carving. Evening traditional dance performance." },
        { title: "Tegalalang & Cooking Class", description: "Morning visit to the stunning Tegalalang Rice Terraces. Afternoon authentic Balinese cooking class where you'll learn to prepare local specialties, followed by dinner enjoying your creations." },
        { title: "Mount Batur Sunrise Trek", description: "Optional early morning trek to Mount Batur to witness a spectacular sunrise (additional cost). Afternoon visit to coffee plantation and holy water temple of Tirta Empul." },
        { title: "Transfer to Nusa Dua", description: "Morning transfer to the luxury beach area of Nusa Dua. En route, visit the dramatic Tegenungan Waterfall. Evening at leisure at your beachfront resort." },
        { title: "Nusa Penida Island Excursion", description: "Full-day boat trip to Nusa Penida Island. Visit the iconic Kelingking Beach, Angel's Billabong, and Broken Beach. Snorkeling opportunity at Crystal Bay to see vibrant marine life." },
        { title: "Temple & Cultural Tour", description: "Morning visit to the seaside Tanah Lot Temple. Afternoon tour of Uluwatu Temple perched on dramatic cliffs, followed by traditional Kecak fire dance performance at sunset." },
        { title: "Departure Day", description: "Free time until your airport transfer for your departure flight. Optional spa treatment can be arranged (additional cost)." }
      ],
      gallery: [
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
        "https://images.unsplash.com/photo-1592364395653-83e648b6a14f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
        "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500"
      ]
    },
    {
      name: "Japanese Cultural Tour",
      shortDescription: "Journey through Japan's rich heritage, from ancient temples to modern cities, with authentic cultural experiences.",
      description: "Embark on a fascinating journey through Japan, a land where ancient traditions harmoniously coexist with cutting-edge modernity. This carefully curated tour takes you from the bustling streets of Tokyo to the serene temples of Kyoto, offering a comprehensive experience of Japan's multifaceted culture. Discover historic sites that date back centuries, participate in traditional tea ceremonies, and indulge in authentic Japanese cuisine that ranges from street food to fine dining. Along the way, witness the breathtaking natural beauty of Mount Fuji and the peaceful bamboo groves of Arashiyama. This tour offers an ideal balance of guided experiences and free time, allowing you to discover both the iconic highlights and hidden treasures of this captivating country.",
      price: 2199,
      duration: 8,
      location: "Tokyo & Kyoto, Japan",
      region: "asia",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
      rating: 4.7,
      reviews: 94,
      groupSize: 16,
      tags: ["Culture", "Food", "History"],
      highlights: [
        "Experience ancient temples and modern skyscrapers in Tokyo",
        "Participate in a traditional Japanese tea ceremony",
        "Visit the iconic Fushimi Inari Shrine with thousands of torii gates",
        "Explore the serene bamboo groves of Arashiyama",
        "Witness the majestic Mount Fuji (weather permitting)"
      ],
      inclusions: [
        "7 nights accommodation in centrally located hotels",
        "Daily breakfast and select special meals",
        "Japan Rail Pass for train transportation",
        "English-speaking guide for scheduled tours",
        "Traditional tea ceremony experience",
        "Entrance fees to listed attractions",
        "Airport transfers"
      ],
      exclusions: [
        "International flights",
        "Travel insurance",
        "Optional activities not mentioned in inclusions",
        "Personal expenses and gratuities",
        "Meals not specified in the itinerary"
      ],
      itinerary: [
        { title: "Arrival in Tokyo", description: "Arrive at Tokyo Narita or Haneda Airport and transfer to your centrally located hotel. Evening welcome dinner featuring authentic Japanese cuisine and orientation briefing." },
        { title: "Tokyo Exploration", description: "Full day exploring Tokyo's highlights: Meiji Shrine, Harajuku's trendy Takeshita Street, serene Shinjuku Gyoen National Garden, and the famous Shibuya Crossing. Evening visit to Tokyo Skytree for panoramic night views." },
        { title: "Tokyo Cultural Immersion", description: "Morning visit to Tsukiji Outer Market for a taste of Japan's food culture. Afternoon boat cruise on the Sumida River, followed by exploration of traditional Asakusa district and the ancient Senso-ji Temple." },
        { title: "Mount Fuji Excursion", description: "Day trip to the Mount Fuji area. Visit the 5th Station (weather permitting), cruise on Lake Ashi, and ride the Hakone Ropeway for breathtaking views. Return to Tokyo in the evening." },
        { title: "Tokyo to Kyoto", description: "Morning bullet train (Shinkansen) to Kyoto. Afternoon visit to Nijo Castle with its 'nightingale floors' and the spectacular golden Kinkaku-ji (Golden Pavilion)." },
        { title: "Kyoto's Ancient Treasures", description: "Full day exploring Kyoto's UNESCO World Heritage sites: Fushimi Inari Shrine with its thousands of vermilion torii gates, the zen rock garden at Ryoan-ji Temple, and a traditional tea ceremony experience." },
        { title: "Arashiyama & Gion District", description: "Morning visit to the bamboo grove and temples of Arashiyama. Afternoon walking tour of the preserved historic district of Higashiyama. Evening guided walk through Gion with the possibility of spotting geisha on their way to appointments." },
        { title: "Departure Day", description: "After breakfast, transfer to Kansai International Airport for your departure flight or extend your stay in Japan." }
      ],
      gallery: [
        "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
        "https://images.unsplash.com/photo-1528360983277-13d401cdc186?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
        "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500"
      ]
    },
    {
      name: "Peru Inca Trail Adventure",
      shortDescription: "Trek the legendary Inca Trail to Machu Picchu and discover Peru's ancient wonders and vibrant culture.",
      description: "Embark on the adventure of a lifetime as you follow in the footsteps of the ancient Incas to discover the legendary citadel of Machu Picchu. This carefully crafted journey combines Peru's rich cultural heritage with breathtaking natural landscapes, creating an unforgettable experience. Starting in historic Lima and continuing to the colonial city of Cusco, you'll gradually acclimatize to the Andean altitude before undertaking the iconic Inca Trail trek. As you journey through cloud forests, alpine tundra, and subtropical jungle, you'll encounter ancient ruins and incredible biodiversity. The climax of your adventure is witnessing the sunrise over Machu Picchu, one of the world's most spectacular archaeological sites. Throughout the journey, you'll experience authentic Peruvian cuisine, interact with local communities, and gain insights into both ancient and contemporary Andean culture.",
      price: 1899,
      duration: 9,
      location: "Lima & Cusco, Peru",
      region: "america",
      image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
      rating: 4.9,
      reviews: 87,
      groupSize: 12,
      tags: ["Hiking", "History", "Adventure"],
      highlights: [
        "Trek the legendary Inca Trail to Machu Picchu",
        "Explore ancient Inca ruins along the trail",
        "Witness sunrise over Machu Picchu",
        "Discover colonial architecture in Cusco",
        "Experience authentic Peruvian cuisine and culture"
      ],
      inclusions: [
        "8 nights accommodation (hotels and camping)",
        "All meals during the Inca Trail trek",
        "Professional English-speaking guides",
        "Inca Trail permit and entrance fees",
        "Porters to carry camping equipment",
        "Domestic flights (Lima-Cusco-Lima)",
        "All ground transportation"
      ],
      exclusions: [
        "International flights",
        "Travel insurance",
        "Sleeping bag (can be rented)",
        "Additional porters for personal items",
        "Gratuities for guides and porters",
        "Some meals in Lima and Cusco"
      ],
      itinerary: [
        { title: "Arrival in Lima", description: "Arrive in Lima, Peru's capital. Transfer to your hotel in the Miraflores district. Evening welcome dinner at a renowned Peruvian restaurant featuring diverse regional cuisines." },
        { title: "Lima City Tour & Flight to Cusco", description: "Morning exploration of Lima's historic center, a UNESCO World Heritage site. Afternoon flight to Cusco. Evening at leisure to acclimate to the altitude (11,152 ft)." },
        { title: "Cusco & Sacred Valley", description: "Morning visit to Sacsayhuaman fortress overlooking Cusco. Afternoon excursion to the Sacred Valley, visiting the Pisac ruins and traditional market. Overnight in Ollantaytambo, exploring this living Inca town." },
        { title: "Inca Trail Day 1: Km 82 to Huayllabamba", description: "Early transfer to Km 82, the starting point of the Inca Trail. Hike through the Urubamba Valley, visiting the Llactapata archaeological site. Overnight camp at Huayllabamba (9,842 ft)." },
        { title: "Inca Trail Day 2: Dead Woman's Pass", description: "The most challenging day, climbing to Dead Woman's Pass (13,829 ft), the highest point of the trail. Descend to Pacaymayu Valley for overnight camping. Spectacular mountain views throughout." },
        { title: "Inca Trail Day 3: Cloud Forest & Inca Ruins", description: "Hike through beautiful cloud forest and visit several impressive Inca sites: Runkurakay, Sayacmarca, and Phuyupatamarca. Camp at Wiñay Wayna with its extensive terraces and ritual baths." },
        { title: "Inca Trail Day 4: Machu Picchu", description: "Early morning hike to Inti Punku (Sun Gate) for sunrise over Machu Picchu. Guided tour of the citadel, exploring temples, plazas, and residential areas. Afternoon train to Aguas Calientes for overnight hotel stay." },
        { title: "Machu Picchu (Optional Second Visit) & Return to Cusco", description: "Optional second entry to Machu Picchu (additional cost) to explore areas like Huayna Picchu. Afternoon train and transfer back to Cusco. Evening farewell dinner featuring traditional music and dance." },
        { title: "Departure Day", description: "Morning flight from Cusco to Lima, connecting with your international departure flight." }
      ],
      gallery: [
        "https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
        "https://images.unsplash.com/photo-1531261562434-593dcc628900?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
        "https://images.unsplash.com/photo-1519958246916-cff27ed40275?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500"
      ]
    },
    {
      name: "Turkish Delight Tour",
      shortDescription: "Experience the magic of Turkey from bustling Istanbul to the surreal landscapes of Cappadocia.",
      description: "Turkey is a land where East meets West, where ancient history and modern culture blend seamlessly. This comprehensive tour takes you from the magnificent monuments of Istanbul to the otherworldly landscapes of Cappadocia, with its famous fairy chimneys and hot air balloons. Along the way, you'll explore the ancient ruins of Ephesus, witness the natural wonder of Pamukkale's terraced thermal pools, and enjoy the beautiful coastline of the Turquoise Coast. Immerse yourself in Turkish cuisine with cooking classes, visit local markets bursting with spices and crafts, and relax in traditional hammams. This journey offers a perfect balance of guided exploration and personal discovery, providing deep insights into Turkey's rich cultural tapestry and natural wonders.",
      price: 1499,
      duration: 8,
      location: "Istanbul & Cappadocia, Turkey",
      region: "europe",
      image: "https://pixabay.com/get/gdd138586207dd2140aa8f08b1539494cc900811468246329eef1624218f572a9d838d0a29eb4197f481de5ea7ed12e836d0adadba52d7422b5a6f536764cd6a2_1280.jpg",
      rating: 4.8,
      reviews: 114,
      groupSize: 14,
      tags: ["Hot Air Balloon", "History", "Food"],
      highlights: [
        "Explore Istanbul's magnificent Blue Mosque and Hagia Sophia",
        "Witness dawn from a hot air balloon over Cappadocia",
        "Discover the ancient Roman city of Ephesus",
        "Experience a traditional Turkish bath (hammam)",
        "Cruise along the scenic Bosphorus Strait"
      ],
      inclusions: [
        "7 nights accommodation in boutique hotels",
        "Daily breakfast and select meals",
        "Domestic flights within Turkey",
        "Hot air balloon ride in Cappadocia",
        "Professional English-speaking guide",
        "All ground transportation and entrance fees",
        "Bosphorus cruise in Istanbul"
      ],
      exclusions: [
        "International flights",
        "Travel insurance",
        "Optional activities not listed in inclusions",
        "Personal expenses and gratuities",
        "Visa fees (if applicable)"
      ],
      itinerary: [
        { title: "Arrival in Istanbul", description: "Arrive in Istanbul, the city straddling two continents. Transfer to your hotel in the historic Sultanahmet district. Evening welcome dinner featuring traditional Turkish cuisine with views of the illuminated city." },
        { title: "Istanbul Historical Tour", description: "Full day exploring Istanbul's UNESCO-listed sites: the magnificent Blue Mosque with its six minarets, the 1,500-year-old Hagia Sophia, Topkapi Palace with its imperial treasures, and the underground Basilica Cistern. End the day at the Grand Bazaar, one of the world's oldest and largest covered markets." },
        { title: "Bosphorus Cruise & Modern Istanbul", description: "Morning cruise along the Bosphorus Strait, viewing Ottoman palaces and wooden villas. Afternoon visit to the Spice Bazaar followed by exploration of modern Istanbul: Istiklal Street, Galata Tower, and the trendy Karakoy district." },
        { title: "Flight to Cappadocia", description: "Morning flight to Kayseri/Nevsehir. Transfer to your unique cave hotel in Cappadocia. Afternoon visit to Goreme Open Air Museum with its rock-cut churches and Byzantine frescoes. Evening traditional Turkish folk dance show with dinner." },
        { title: "Cappadocia Hot Air Balloon & Exploration", description: "Pre-dawn departure for a magical hot air balloon ride over Cappadocia's fairy chimneys at sunrise (weather permitting). After breakfast, explore the underground city of Derinkuyu, Pasabag Valley, and visit a local pottery workshop in Avanos." },
        { title: "Red Valley Hike & Local Experience", description: "Morning hike through the scenic Red Valley with its striking rock formations. Afternoon cooking class learning to prepare traditional Turkish dishes, followed by a visit to a local family's home for tea." },
        { title: "Return to Istanbul", description: "Morning flight back to Istanbul. Afternoon visit to Dolmabahce Palace, the last residence of Ottoman sultans, and exploration of the Ortakoy neighborhood with its vibrant waterfront scene. Evening at leisure for personal discoveries." },
        { title: "Departure Day", description: "After breakfast, transfer to Istanbul International Airport for your departure flight, or extend your stay in Turkey." }
      ],
      gallery: [
        "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
        "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
        "https://images.unsplash.com/photo-1570854009436-32dea5270b2b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500"
      ]
    },
    {
      name: "Luxury Maldives Retreat",
      shortDescription: "Indulge in ultimate relaxation at an exclusive overwater villa in the pristine Maldives paradise.",
      description: "Escape to the epitome of tropical luxury in the Maldives, where pristine white sand beaches meet crystal-clear turquoise waters teeming with vibrant marine life. This exclusive retreat offers a perfect balance of relaxation and adventure in one of the world's most beautiful destinations. Stay in a luxurious overwater villa with direct access to the lagoon, where you can snorkel right from your private deck. Indulge in world-class spa treatments, savor gourmet cuisine featuring fresh seafood and international flavors, and experience spectacular sunsets from your own infinity pool. For the more active traveler, a range of water sports and excursions allows you to explore the rich underwater world of coral reefs and exotic fish. This Maldives experience promises to create memories that will last a lifetime in a setting that defines paradise.",
      price: 2999,
      duration: 6,
      location: "Maldives",
      region: "asia",
      image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
      rating: 5.0,
      reviews: 76,
      groupSize: 2,
      tags: ["Luxury", "Beach", "Snorkeling"],
      highlights: [
        "Stay in a luxurious overwater villa with private pool",
        "Snorkel or dive in crystal-clear waters with abundant marine life",
        "Indulge in couples spa treatments in an overwater pavilion",
        "Enjoy a private sunset dinner on a secluded sandbank",
        "Take a dolphin-watching cruise at sunset"
      ],
      inclusions: [
        "5 nights in an overwater villa with private pool",
        "Daily breakfast, lunch, and dinner (full board)",
        "Welcome champagne and tropical fruit basket",
        "One private sunset dinner on the beach",
        "Couples massage treatment",
        "Snorkeling equipment and guided reef tour",
        "Roundtrip seaplane transfers from Malé International Airport"
      ],
      exclusions: [
        "International flights",
        "Travel insurance",
        "Premium alcoholic beverages",
        "Optional activities not mentioned in inclusions",
        "Personal expenses",
        "Additional spa treatments"
      ],
      itinerary: [
        { title: "Arrival in Paradise", description: "Arrive at Malé International Airport where you'll be greeted and escorted to the seaplane terminal. Enjoy refreshments in the private lounge before your scenic seaplane flight to the resort. Upon arrival, receive a warm welcome with cold towels and tropical drinks. After check-in to your overwater villa, enjoy the rest of the day at leisure, perhaps with a swim in your private infinity pool overlooking the ocean." },
        { title: "Reef Exploration", description: "After breakfast on your private deck, join a marine biologist for a guided snorkeling tour of the house reef, discovering vibrant coral gardens and diverse marine life including tropical fish, rays, and turtles. Afternoon at leisure. Evening sunset cocktails followed by dinner at the resort's main restaurant featuring international cuisine with Maldivian influences." },
        { title: "Spa & Relaxation Day", description: "Morning yoga session on the beach. Late morning couples' treatment at the overwater spa pavilion, including a massage ritual using indigenous ingredients and techniques. Afternoon relaxation. Evening sunset dolphin-watching cruise with canapés and champagne, followed by dinner at the resort's specialty restaurant." },
        { title: "Water Adventure Day", description: "After breakfast, choose from various water activities: windsurfing, kayaking, paddleboarding, or jet skiing (some at additional cost). Afternoon guided snorkeling or diving trip to a nearby reef known for manta rays or whale sharks (seasonal). Evening cooking class learning to prepare Maldivian specialties, followed by dinner enjoying your creations." },
        { title: "Island Exploration", description: "Morning visit to a nearby local island to experience authentic Maldivian culture and traditional crafts (optional). Afternoon fishing trip using traditional Maldivian methods. Your catch can be prepared for your dinner by the resort chefs. Evening stargazing session with an astronomer, identifying constellations in the clear Maldivian sky." },
        { title: "Farewell to Paradise", description: "Breakfast at leisure. Final morning to enjoy your villa and the resort facilities. Private beach farewell lunch. Afternoon seaplane transfer to Malé International Airport for your departure flight." }
      ],
      gallery: [
        "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
        "https://images.unsplash.com/photo-1540202404-d0c7fe46a087?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
        "https://images.unsplash.com/photo-1578922746477-28f9026a128d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500"
      ]
    }
  ];

  const insertedPackages = await db.insert(packages).values(samplePackages).returning();

  const sampleDestinations: InsertDestination[] = [
    { name: "Paris", country: "France", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=800", tourCount: 124, featured: true },
    { name: "Dubai", country: "United Arab Emirates", image: "https://pixabay.com/get/ge50ebababd575d8ff8a41cbac30781f54e6426b733621789ec74c028d6b0ae2ee2489c2f4feb39d53339265e0addc360cf81d46322bbc758c52bfa5c3399926a_1280.jpg", tourCount: 86, featured: true },
    { name: "Rome", country: "Italy", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=800", tourCount: 108, featured: true },
    { name: "New York", country: "United States", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=800", tourCount: 96, featured: true },
    { name: "Rio de Janeiro", country: "Brazil", image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=600", tourCount: 74, featured: true },
    { name: "Sydney", country: "Australia", image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=600", tourCount: 82, featured: true }
  ];
  await db.insert(destinations).values(sampleDestinations);

  const sampleOffers: InsertSpecialOffer[] = [
    {
      title: "Luxury Beach Resort Package",
      description: "Experience the ultimate beach getaway with our luxury resort package, including spa treatments and fine dining.",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600",
      originalPrice: 2999,
      discountedPrice: 2249,
      discountPercent: 25,
      expiryDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString()
    },
    {
      title: "Adventure Tour Bundle",
      description: "Embark on an adrenaline-pumping journey with hiking, zip-lining, and white-water rafting activities.",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600",
      originalPrice: 1899,
      discountedPrice: 1329,
      discountPercent: 30,
      expiryDate: new Date(new Date().setDate(new Date().getDate() + 45)).toISOString()
    }
  ];
  await db.insert(specialOffers).values(sampleOffers);

  const sampleTestimonials: InsertTestimonial[] = [
    {
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100",
      comment: "Our trip to Santorini was absolutely magical! Wanderlust took care of every detail, from the luxury accommodations to the guided tours. The sunset cruise was a highlight of our trip. Cannot recommend them enough!",
      rating: 5,
      packageName: "Santorini Island Escape"
    },
    {
      name: "Michael Rodriguez",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100",
      comment: "The Peru Inca Trail Adventure exceeded all expectations. Our guide was incredibly knowledgeable, and the trek was perfectly paced. Seeing Machu Picchu at sunrise was a once-in-a-lifetime experience that I'll never forget.",
      rating: 5,
      packageName: "Peru Inca Trail Adventure"
    },
    {
      name: "David & Emma Chen",
      avatar: "https://images.unsplash.com/photo-1541216970279-affbfdd55aa8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100",
      comment: "Our honeymoon in Bali was perfect thanks to Wanderlust! From the private villa with infinity pool to the couples' spa treatments, every detail was thoughtfully arranged. We'll definitely book our anniversary trip with them!",
      rating: 5,
      packageName: "Bali Tropical Paradise"
    }
  ];
  await db.insert(testimonials).values(sampleTestimonials);

  const santorini = insertedPackages.find(p => p.name === "Santorini Island Escape")!;
  await db.insert(bookings).values({
    userId: regularUser.id,
    packageId: santorini.id,
    packageName: "Santorini Island Escape",
    packageLocation: "Santorini, Greece",
    bookingDate: new Date().toISOString(),
    startDate: new Date(new Date().setDate(new Date().getDate() + 60)).toISOString(),
    travelers: 2,
    totalPrice: 2598,
    contactName: "John Doe",
    contactEmail: "john@example.com",
    contactPhone: "+1234567890",
    specialRequests: "We would prefer a room with an ocean view if possible."
  });

  console.log("Seed complete:", { adminUser: adminUser.email, regularUser: regularUser.email, packages: insertedPackages.length });
  await pool.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

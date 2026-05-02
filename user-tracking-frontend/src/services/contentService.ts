export interface ContentItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  source: string;
  publishedAt: string;
  url?: string;
  readTime: string;
  category: string;
  subcategory: string;
}

// TheMealDB — no API key needed
async function fetchMeals(area: string, subcategory: string): Promise<ContentItem[]> {
  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
    );
    const data = await res.json();
    const meals: any[] = (data.meals || []).slice(0, 8);
    return meals.map((meal: any) => ({
      id: meal.idMeal,
      title: meal.strMeal,
      description: `Explore the flavors of ${meal.strMeal} — a classic ${area} dish with rich tradition and vibrant ingredients. Perfect for food lovers looking to discover new cuisines.`,
      imageUrl: meal.strMealThumb,
      source: 'TheMealDB',
      publishedAt: randomRecentDate(),
      readTime: `${Math.floor(Math.random() * 4) + 2} min read`,
      category: 'food',
      subcategory,
    }));
  } catch {
    return staticContent.food[subcategory as keyof typeof staticContent.food] || [];
  }
}

async function fetchDesserts(subcategory: string): Promise<ContentItem[]> {
  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert`
    );
    const data = await res.json();
    const meals: any[] = (data.meals || []).slice(0, 8);
    return meals.map((meal: any) => ({
      id: meal.idMeal,
      title: meal.strMeal,
      description: `Indulge in ${meal.strMeal} — a delightful dessert that satisfies every sweet craving. Discover the recipe and bring this treat to your table.`,
      imageUrl: meal.strMealThumb,
      source: 'TheMealDB',
      publishedAt: randomRecentDate(),
      readTime: `${Math.floor(Math.random() * 3) + 2} min read`,
      category: 'food',
      subcategory,
    }));
  } catch {
    return staticContent.food.desserts;
  }
}

function randomRecentDate(): string {
  const hoursAgo = Math.floor(Math.random() * 72);
  const d = new Date(Date.now() - hoursAgo * 3600 * 1000);
  return d.toISOString();
}

export function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// Rich static content for News, Sports, Movies
const staticContent = {
  news: {
    political: [
      {
        id: 'n-p-1', title: 'Parliament Approves Historic Climate Policy Bill in Unanimous Vote',
        description: 'In a landmark session, Parliament passed the most ambitious climate legislation in the nation\'s history, committing to net-zero emissions by 2045 and allocating ₹5 lakh crore for green infrastructure.',
        imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80',
        source: 'The Hindu', publishedAt: randomRecentDate(), readTime: '4 min read', category: 'news', subcategory: 'political', url: '#',
      },
      {
        id: 'n-p-2', title: 'Supreme Court Delivers Landmark Ruling on Electoral Reform',
        description: 'The Supreme Court\'s nine-judge bench issued a unanimous verdict that fundamentally reshapes campaign financing rules, mandating full disclosure of all political donations above ₹1,000.',
        imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80',
        source: 'Indian Express', publishedAt: randomRecentDate(), readTime: '5 min read', category: 'news', subcategory: 'political', url: '#',
      },
      {
        id: 'n-p-3', title: 'New Cabinet Reshuffle: Key Ministers Assigned Critical Portfolios',
        description: 'The Prime Minister announced a major cabinet reshuffle, bringing in technocrats and economists to lead the Finance and Commerce ministries as the country prepares for the next phase of economic reforms.',
        imageUrl: 'https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=800&q=80',
        source: 'NDTV', publishedAt: randomRecentDate(), readTime: '3 min read', category: 'news', subcategory: 'political', url: '#',
      },
      {
        id: 'n-p-4', title: 'Opposition Forms Grand Alliance Ahead of State Elections',
        description: 'Six opposition parties have formally announced a coalition ahead of five state elections, presenting a unified candidate list and a joint manifesto focused on employment and rural development.',
        imageUrl: 'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=800&q=80',
        source: 'Times of India', publishedAt: randomRecentDate(), readTime: '4 min read', category: 'news', subcategory: 'political', url: '#',
      },
      {
        id: 'n-p-5', title: 'India Signs Landmark Trade Agreement with EU Bloc',
        description: 'After 16 years of negotiations, India and the European Union finalized a comprehensive free trade agreement that is expected to boost bilateral trade to $200 billion by 2030.',
        imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
        source: 'Business Standard', publishedAt: randomRecentDate(), readTime: '6 min read', category: 'news', subcategory: 'political', url: '#',
      },
      {
        id: 'n-p-6', title: 'Budget Session: Finance Minister Unveils ₹50 Lakh Crore Plan',
        description: 'The Union Budget focuses on infrastructure, clean energy, and job creation, with the highest-ever capital expenditure allocation and a new ₹1 lakh crore innovation fund for startups.',
        imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
        source: 'Mint', publishedAt: randomRecentDate(), readTime: '7 min read', category: 'news', subcategory: 'political', url: '#',
      },
    ],
    domestic: [
      {
        id: 'n-d-1', title: 'India\'s Infrastructure Boom: 50,000 km of Roads Completed This Year',
        description: 'The National Highways Authority of India achieved a record-breaking milestone, completing 50,000 kilometres of new roads in a single fiscal year, connecting remote villages to major economic centres.',
        imageUrl: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&q=80',
        source: 'Economic Times', publishedAt: randomRecentDate(), readTime: '4 min read', category: 'news', subcategory: 'domestic', url: '#',
      },
      {
        id: 'n-d-2', title: 'New Education Policy Doubles Enrollment in Rural Schools',
        description: 'Three years after implementation, the New Education Policy has resulted in a 40% increase in rural school enrollment, with vernacular language instruction credited as the key driver of change.',
        imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80',
        source: 'The Hindu', publishedAt: randomRecentDate(), readTime: '5 min read', category: 'news', subcategory: 'domestic', url: '#',
      },
      {
        id: 'n-d-3', title: 'Healthcare Reforms: Universal Coverage Reaches 85% of Population',
        description: 'India\'s Ayushman Bharat scheme has expanded to cover 85% of the population, with 40 new AIIMS hospitals operational across tier-2 and tier-3 cities.',
        imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
        source: 'Hindustan Times', publishedAt: randomRecentDate(), readTime: '4 min read', category: 'news', subcategory: 'domestic', url: '#',
      },
      {
        id: 'n-d-4', title: 'Start-Up India: 1 Lakh New Companies Register in Single Quarter',
        description: 'India\'s startup ecosystem hit a record high with over 1 lakh new company registrations in Q1 2026, driven by government incentives, cheap credit, and a surge in tier-2 city entrepreneurship.',
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
        source: 'Inc42', publishedAt: randomRecentDate(), readTime: '3 min read', category: 'news', subcategory: 'domestic', url: '#',
      },
      {
        id: 'n-d-5', title: 'Monsoon 2026: IMD Predicts Above-Normal Rainfall for Most Regions',
        description: 'The India Meteorological Department has forecast above-normal monsoon rainfall for 80% of the country, bringing relief to farmers and raising hopes for a bumper Kharif crop this season.',
        imageUrl: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=800&q=80',
        source: 'Aaj Tak', publishedAt: randomRecentDate(), readTime: '3 min read', category: 'news', subcategory: 'domestic', url: '#',
      },
      {
        id: 'n-d-6', title: 'Digital India: UPI Crosses 20 Billion Transactions Per Month',
        description: 'India\'s Unified Payments Interface processed over 20 billion transactions in April 2026, cementing India\'s position as the world\'s largest real-time digital payments market.',
        imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80',
        source: 'Financial Express', publishedAt: randomRecentDate(), readTime: '3 min read', category: 'news', subcategory: 'domestic', url: '#',
      },
    ],
    international: [
      {
        id: 'n-i-1', title: 'G7 Nations Agree on Binding AI Governance Framework',
        description: 'Leaders of the G7 signed a historic agreement establishing mandatory safety standards for advanced AI systems, with enforcement mechanisms and a new international AI Safety Institute headquartered in Geneva.',
        imageUrl: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&q=80',
        source: 'Reuters', publishedAt: randomRecentDate(), readTime: '5 min read', category: 'news', subcategory: 'international', url: '#',
      },
      {
        id: 'n-i-2', title: 'Middle East Peace Talks: New Framework Wins Arab League Support',
        description: 'A Saudi-brokered peace framework has received backing from all 22 Arab League members, marking the most significant diplomatic breakthrough in the region in two decades.',
        imageUrl: 'https://images.unsplash.com/photo-1494270611680-f0669063a2b7?w=800&q=80',
        source: 'Al Jazeera', publishedAt: randomRecentDate(), readTime: '6 min read', category: 'news', subcategory: 'international', url: '#',
      },
      {
        id: 'n-i-3', title: 'China\'s Economy Grows 6.2%: Fastest Pace in Three Years',
        description: 'China posted GDP growth of 6.2% in Q1 2026, beating analyst expectations, driven by a rebound in consumer spending, record EV exports, and a government stimulus package worth $500 billion.',
        imageUrl: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80',
        source: 'Bloomberg', publishedAt: randomRecentDate(), readTime: '4 min read', category: 'news', subcategory: 'international', url: '#',
      },
      {
        id: 'n-i-4', title: 'EU Launches €1 Trillion Green Deal Investment Programme',
        description: 'The European Commission unveiled the most ambitious climate investment plan in history, funding renewable energy, electric transport, and green hydrogen infrastructure across all 27 member states.',
        imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&q=80',
        source: 'BBC', publishedAt: randomRecentDate(), readTime: '4 min read', category: 'news', subcategory: 'international', url: '#',
      },
      {
        id: 'n-i-5', title: 'WHO Declares End of Global Health Emergency for Novel Pathogen',
        description: 'The World Health Organization lifted the Public Health Emergency of International Concern for XEC-2, citing successful vaccine deployment across 140 countries and sharp declines in hospitalizations.',
        imageUrl: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800&q=80',
        source: 'AP News', publishedAt: randomRecentDate(), readTime: '4 min read', category: 'news', subcategory: 'international', url: '#',
      },
      {
        id: 'n-i-6', title: 'SpaceX Mars Mission: First Crew Completes 6-Month Journey',
        description: 'A six-person crew aboard SpaceX\'s Starship completed the first crewed Mars transit, entering Mars orbit successfully. The mission marks the beginning of humanity\'s multi-planetary era.',
        imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80',
        source: 'NASA / SpaceX', publishedAt: randomRecentDate(), readTime: '6 min read', category: 'news', subcategory: 'international', url: '#',
      },
    ],
  },
  sports: {
    cricket: [
      {
        id: 's-c-1', title: 'India Beats Australia in Thrilling Last-Ball Finish at MCG',
        description: 'Hardik Pandya smashed a six off the final delivery to seal a stunning 3-wicket victory for India at the Melbourne Cricket Ground, completing a historic series win on Australian soil.',
        imageUrl: 'https://images.unsplash.com/photo-1624971497044-3b338527dc48?w=800&q=80',
        source: 'ESPNcricinfo', publishedAt: randomRecentDate(), readTime: '4 min read', category: 'sports', subcategory: 'cricket', url: '#',
      },
      {
        id: 's-c-2', title: 'Rohit Sharma Scores Record 13th Test Century Against England',
        description: 'India\'s captain Rohit Sharma etched his name in the record books with his 13th Test century, surpassing Sunil Gavaskar\'s record as the highest-scoring Indian opener in Test history.',
        imageUrl: 'https://images.unsplash.com/photo-1540747913346-19212a4b423e?w=800&q=80',
        source: 'Cricbuzz', publishedAt: randomRecentDate(), readTime: '3 min read', category: 'sports', subcategory: 'cricket', url: '#',
      },
      {
        id: 's-c-3', title: 'IPL 2026 Final: Mumbai Indians Defend Title with Dominant Display',
        description: 'Mumbai Indians lifted their seventh IPL trophy with a comprehensive 45-run victory over Chennai Super Kings in a sold-out Narendra Modi Stadium, with Jasprit Bumrah taking 5 wickets.',
        imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80',
        source: 'BCCI', publishedAt: randomRecentDate(), readTime: '4 min read', category: 'sports', subcategory: 'cricket', url: '#',
      },
      {
        id: 's-c-4', title: 'Women\'s T20 World Cup: India Clinches Maiden Title in Final',
        description: 'Smriti Mandhana\'s unbeaten 78 powered India to their first-ever Women\'s T20 World Cup title, defeating Australia by 6 wickets in a record-breaking final in Durban.',
        imageUrl: 'https://images.unsplash.com/photo-1593766827218-e4e35e8c2562?w=800&q=80',
        source: 'ICC', publishedAt: randomRecentDate(), readTime: '5 min read', category: 'sports', subcategory: 'cricket', url: '#',
      },
      {
        id: 's-c-5', title: 'Shubman Gill Ranked World\'s No.1 Test Batter by ICC',
        description: 'Shubman Gill reached the pinnacle of Test batting rankings after a phenomenal series against South Africa, scoring back-to-back double centuries and becoming the youngest Indian to reach the top spot.',
        imageUrl: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
        source: 'The Telegraph', publishedAt: randomRecentDate(), readTime: '3 min read', category: 'sports', subcategory: 'cricket', url: '#',
      },
      {
        id: 's-c-6', title: 'Ben Stokes Retires from Test Cricket After Record Innings',
        description: 'England captain Ben Stokes announced his retirement from Test cricket following his farewell match at Lord\'s, where he scored a breathtaking 192 to complete one final Bazball miracle.',
        imageUrl: 'https://images.unsplash.com/photo-1540747913346-19212a4b423e?w=800&q=80',
        source: 'Guardian Sport', publishedAt: randomRecentDate(), readTime: '4 min read', category: 'sports', subcategory: 'cricket', url: '#',
      },
    ],
    football: [
      {
        id: 's-f-1', title: 'Real Madrid Wins Champions League for 16th Time in Dramatic Final',
        description: 'Kylian Mbappé scored a hat-trick as Real Madrid defeated Manchester City 4-3 in a breathtaking Champions League final in Munich, bringing the trophy home for a record-extending 16th time.',
        imageUrl: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80',
        source: 'UEFA', publishedAt: randomRecentDate(), readTime: '5 min read', category: 'sports', subcategory: 'football', url: '#',
      },
      {
        id: 's-f-2', title: 'Arsenal Win Premier League Title After 22-Year Wait',
        description: 'Arsenal clinched the Premier League title with four games to spare, ending a 22-year drought. Manager Mikel Arteta was carried shoulder-high off the pitch at the Emirates to thunderous celebrations.',
        imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80',
        source: 'Sky Sports', publishedAt: randomRecentDate(), readTime: '4 min read', category: 'sports', subcategory: 'football', url: '#',
      },
      {
        id: 's-f-3', title: 'Erling Haaland Breaks All-Time Premier League Scoring Record',
        description: 'Erling Haaland surpassed Alan Shearer\'s all-time Premier League goal record with his 261st league goal, celebrating with characteristic deadpan composure after heading home from a corner kick.',
        imageUrl: 'https://images.unsplash.com/photo-1552667466-07770ae110d0?w=800&q=80',
        source: 'BBC Sport', publishedAt: randomRecentDate(), readTime: '3 min read', category: 'sports', subcategory: 'football', url: '#',
      },
      {
        id: 's-f-4', title: 'Brazil Qualify for 2026 World Cup with 10-Game Winning Run',
        description: 'Brazil secured their World Cup berth with a perfect ten-game South American qualifying streak, scoring 35 goals in the process under new coach Carlo Ancelotti\'s attacking system.',
        imageUrl: 'https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=800&q=80',
        source: 'FIFA', publishedAt: randomRecentDate(), readTime: '3 min read', category: 'sports', subcategory: 'football', url: '#',
      },
      {
        id: 's-f-5', title: 'India Women\'s Football Team Qualifies for AFC Championship',
        description: 'India\'s women\'s national football team qualified for the AFC Championship for the first time in history, defeating Japan 2-1 in a tense qualifier in Bengaluru.',
        imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
        source: 'AIFF', publishedAt: randomRecentDate(), readTime: '3 min read', category: 'sports', subcategory: 'football', url: '#',
      },
      {
        id: 's-f-6', title: 'Lionel Messi Announces Retirement from International Football',
        description: 'Lionel Messi confirmed he will retire from international football after the 2026 World Cup, ending a playing career that yielded one World Cup, four Copa Américas, and a record eight Ballon d\'Or awards.',
        imageUrl: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&q=80',
        source: 'ESPN', publishedAt: randomRecentDate(), readTime: '5 min read', category: 'sports', subcategory: 'football', url: '#',
      },
    ],
    olympics: [
      {
        id: 's-o-1', title: 'Los Angeles 2028 Olympics: Venues Revealed in Stunning Presentation',
        description: 'The LA28 organizing committee unveiled detailed plans for 25 Olympic venues, including a reimagined Coliseum, a new aquatics centre, and the first-ever stadium surfing venue on Venice Beach.',
        imageUrl: 'https://images.unsplash.com/photo-1471295253337-3ceaaedca402?w=800&q=80',
        source: 'Olympics.com', publishedAt: randomRecentDate(), readTime: '4 min read', category: 'sports', subcategory: 'olympics', url: '#',
      },
      {
        id: 's-o-2', title: 'India\'s Olympic Mission 2028: 100 Athletes Enter Full-Time Camp',
        description: 'The Sports Authority of India launched its most ambitious training programme yet, with 100 Olympic-level athletes entering a full-time residential camp funded by a ₹500 crore government grant.',
        imageUrl: 'https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?w=800&q=80',
        source: 'SAI', publishedAt: randomRecentDate(), readTime: '4 min read', category: 'sports', subcategory: 'olympics', url: '#',
      },
      {
        id: 's-o-3', title: 'Neeraj Chopra Breaks World Record with 97.32m Javelin Throw',
        description: 'Neeraj Chopra shattered the world record with a sensational 97.32m throw at the Diamond League meet in Stockholm, becoming the first athlete to throw a javelin beyond 97 metres.',
        imageUrl: 'https://images.unsplash.com/photo-1486286701208-1d58e9338013?w=800&q=80',
        source: 'World Athletics', publishedAt: randomRecentDate(), readTime: '3 min read', category: 'sports', subcategory: 'olympics', url: '#',
      },
      {
        id: 's-o-4', title: 'IOC Adds Esports as Full Medal Sport for LA 2028',
        description: 'The International Olympic Committee confirmed that Esports will be a full medal sport at the 2028 Los Angeles Olympics, with six titles across FIFA, StreetFighter, and three other games.',
        imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
        source: 'IOC', publishedAt: randomRecentDate(), readTime: '4 min read', category: 'sports', subcategory: 'olympics', url: '#',
      },
      {
        id: 's-o-5', title: 'PV Sindhu Wins Gold at World Badminton Championships',
        description: 'PV Sindhu captured her second World Championships gold medal in a stunning comeback victory, rallying from a set down to defeat the world number one 15-21, 21-17, 21-14.',
        imageUrl: 'https://images.unsplash.com/photo-1627479424699-e7cd5501fd27?w=800&q=80',
        source: 'BWF', publishedAt: randomRecentDate(), readTime: '3 min read', category: 'sports', subcategory: 'olympics', url: '#',
      },
      {
        id: 's-o-6', title: 'Paris 2024 Legacy: All Olympic Venues Now Carbon Neutral',
        description: 'Two years after the Paris Games, all 35 Olympic venues have achieved carbon-neutral certification, with the athletes\' village converted into 3,000 affordable housing units for Parisians.',
        imageUrl: 'https://images.unsplash.com/photo-1444491741275-3747c53c99b4?w=800&q=80',
        source: 'Paris 2024', publishedAt: randomRecentDate(), readTime: '4 min read', category: 'sports', subcategory: 'olympics', url: '#',
      },
    ],
  },
  movies: {
    bollywood: [
      {
        id: 'm-b-1', title: 'Pathaan 2 Shatters Box Office Records on Opening Day',
        description: 'Shah Rukh Khan\'s return in Pathaan 2 broke every Bollywood opening day record, earning ₹145 crore worldwide on Day 1. The action thriller has been hailed as the most technically advanced Indian film ever made.',
        imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
        source: 'Bollywood Hungama', publishedAt: randomRecentDate(), readTime: '4 min read', category: 'movies', subcategory: 'bollywood', url: '#',
      },
      {
        id: 'm-b-2', title: 'Alia Bhatt\'s New Drama Wins Palme d\'Or at Cannes 2026',
        description: 'The Cannes jury awarded the Palme d\'Or to Alia Bhatt\'s upcoming drama, a first for an Indian actor-producer. The film, shot entirely in Bihar, explores caste, identity, and modern India.',
        imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80',
        source: 'Film Companion', publishedAt: randomRecentDate(), readTime: '4 min read', category: 'movies', subcategory: 'bollywood', url: '#',
      },
      {
        id: 'm-b-3', title: 'Top 10 Bollywood Films You Must Watch This Summer',
        description: 'From blockbuster action to heart-wrenching drama, this summer\'s Bollywood lineup has something for everyone. We rank the 10 most anticipated releases across all genres and streaming platforms.',
        imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80',
        source: 'Filmfare', publishedAt: randomRecentDate(), readTime: '5 min read', category: 'movies', subcategory: 'bollywood', url: '#',
      },
      {
        id: 'm-b-4', title: 'Ranveer Singh\'s Don 3 Begins Shoot in Prague and Morocco',
        description: 'Filming for Don 3 has officially commenced on location in Prague and Morocco. Director Farhan Akhtar confirmed this will be the biggest-budget Bollywood production ever, with an all-star international cast.',
        imageUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&q=80',
        source: 'Pinkvilla', publishedAt: randomRecentDate(), readTime: '3 min read', category: 'movies', subcategory: 'bollywood', url: '#',
      },
      {
        id: 'm-b-5', title: 'RRR Sequel: SS Rajamouli Announces Cast and Release Date',
        description: 'SS Rajamouli officially announced RRR 2, bringing back Ram Charan and Jr. NTR alongside five international co-stars. The film is set for a Diwali 2027 release in six languages simultaneously.',
        imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80',
        source: 'Variety', publishedAt: randomRecentDate(), readTime: '4 min read', category: 'movies', subcategory: 'bollywood', url: '#',
      },
      {
        id: 'm-b-6', title: 'Netflix India\'s Sacred Games 3 Gets Greenlit After Fan Petition',
        description: 'Following a record 10-million signature petition, Netflix greenlit Sacred Games Season 3, reuniting the original cast and crew. The show returns with a new geopolitical thriller arc.',
        imageUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&q=80',
        source: 'OTTplay', publishedAt: randomRecentDate(), readTime: '3 min read', category: 'movies', subcategory: 'bollywood', url: '#',
      },
    ],
    hollywood: [
      {
        id: 'm-h-1', title: 'Avengers: Secret Wars — Official Trailer Breaks Viewing Records',
        description: 'Marvel\'s Avengers: Secret Wars trailer amassed 300 million views in 24 hours, breaking every MCU record. The film promises the return of all previous Avengers teams across the multiverse.',
        imageUrl: 'https://images.unsplash.com/photo-1624213111452-35e8d3d5cc18?w=800&q=80',
        source: 'Deadline', publishedAt: randomRecentDate(), readTime: '4 min read', category: 'movies', subcategory: 'hollywood', url: '#',
      },
      {
        id: 'm-h-2', title: 'Christopher Nolan\'s New Film "Odyssey" Gets July 2027 Release',
        description: 'Universal Pictures confirmed that Christopher Nolan\'s next project, titled Odyssey, will open globally in July 2027. Shot on 70mm IMAX film, the epic is described as a "love letter to cinema itself".',
        imageUrl: 'https://images.unsplash.com/photo-1515634928627-2a4e0dae3ddf?w=800&q=80',
        source: 'The Hollywood Reporter', publishedAt: randomRecentDate(), readTime: '4 min read', category: 'movies', subcategory: 'hollywood', url: '#',
      },
      {
        id: 'm-h-3', title: 'Dune: Messiah Wraps Filming — Denis Villeneuve Shares First Look',
        description: 'Director Denis Villeneuve confirmed that Dune: Messiah has completed principal photography. The first behind-the-scenes photos reveal an older Paul Atreides and an entirely redesigned Arrakeen set.',
        imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80',
        source: 'IGN', publishedAt: randomRecentDate(), readTime: '3 min read', category: 'movies', subcategory: 'hollywood', url: '#',
      },
      {
        id: 'm-h-4', title: 'Oscar Winners 2026: The Complete List of This Year\'s Winners',
        description: 'A sweeping historical drama took Best Picture at the 98th Academy Awards, while Best Actress went to a first-time nominee for her role as a real-life activist who changed Indian education forever.',
        imageUrl: 'https://images.unsplash.com/photo-1547005327-90e4e56b7f2e?w=800&q=80',
        source: 'Academy', publishedAt: randomRecentDate(), readTime: '5 min read', category: 'movies', subcategory: 'hollywood', url: '#',
      },
      {
        id: 'm-h-5', title: 'Top Gun 3: Tom Cruise Returns for Final Mission — Teaser Released',
        description: 'Paramount dropped the first teaser for Top Gun 3, showing Tom Cruise in a next-generation stealth aircraft with a new international cast. Production wrapped in only 90 days thanks to real aerial shooting.',
        imageUrl: 'https://images.unsplash.com/photo-1513553404607-988bf2703777?w=800&q=80',
        source: 'Paramount', publishedAt: randomRecentDate(), readTime: '3 min read', category: 'movies', subcategory: 'hollywood', url: '#',
      },
      {
        id: 'm-h-6', title: 'Gladiator II Earns $500M Globally in Opening Weekend',
        description: 'Ridley Scott\'s Gladiator II opened to a historic $500 million global weekend, making it the biggest non-superhero opening in Hollywood history. Paul Mescal\'s performance has already generated Oscar buzz.',
        imageUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&q=80',
        source: 'Box Office Mojo', publishedAt: randomRecentDate(), readTime: '3 min read', category: 'movies', subcategory: 'hollywood', url: '#',
      },
    ],
    documentaries: [
      {
        id: 'm-doc-1', title: 'The Ocean Crisis: Netflix\'s New Doc Exposes Deep-Sea Destruction',
        description: 'This stunning four-part Netflix documentary uses cutting-edge underwater cameras to expose how deep-sea mining is decimating ecosystems untouched for millions of years — and what\'s being done to stop it.',
        imageUrl: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&q=80',
        source: 'Netflix', publishedAt: randomRecentDate(), readTime: '4 min read', category: 'movies', subcategory: 'documentaries', url: '#',
      },
      {
        id: 'm-doc-2', title: 'Inside Silicon Valley: Untold Stories of Tech Giants Exposed',
        description: 'A two-hour documentary featuring 60 interviews with ex-employees of Google, Meta, and OpenAI, revealing the internal tensions, ethical debates, and power struggles that shaped modern technology.',
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
        source: 'Apple TV+', publishedAt: randomRecentDate(), readTime: '5 min read', category: 'movies', subcategory: 'documentaries', url: '#',
      },
      {
        id: 'm-doc-3', title: 'Ancient India Reimagined: New Archaeological Discoveries in Harappa',
        description: 'Using AI-powered analysis of 50,000 previously unexamined artifacts, archaeologists have rewritten the history of the Harappan civilisation. This documentary takes viewers on the discovery journey.',
        imageUrl: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800&q=80',
        source: 'Disney+ Hotstar', publishedAt: randomRecentDate(), readTime: '5 min read', category: 'movies', subcategory: 'documentaries', url: '#',
      },
      {
        id: 'm-doc-4', title: 'The Mind Explained: Season 3 Explores AI and Human Consciousness',
        description: 'Vox Media\'s acclaimed series returns for a third season, featuring neuroscientists and AI researchers exploring what it means to be conscious — and whether machines can ever truly think.',
        imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
        source: 'Netflix', publishedAt: randomRecentDate(), readTime: '4 min read', category: 'movies', subcategory: 'documentaries', url: '#',
      },
      {
        id: 'm-doc-5', title: 'Wild India: Saving the Last Tigers of Central India',
        description: 'Shot over three years across Madhya Pradesh\'s jungle corridors, this BBC Earth co-production documents the race to save Bengal tigers from habitat loss, poaching, and climate change.',
        imageUrl: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=800&q=80',
        source: 'BBC Earth', publishedAt: randomRecentDate(), readTime: '4 min read', category: 'movies', subcategory: 'documentaries', url: '#',
      },
      {
        id: 'm-doc-6', title: 'The Formula: Inside One Season of F1 Championship Racing',
        description: 'A fly-on-the-wall documentary embedded with three F1 teams across the full 2025 season, revealing the engineering, psychology, and politics behind the world\'s most technically complex sport.',
        imageUrl: 'https://images.unsplash.com/photo-1541956066953-0bb9b59aa4f3?w=800&q=80',
        source: 'Amazon Prime', publishedAt: randomRecentDate(), readTime: '4 min read', category: 'movies', subcategory: 'documentaries', url: '#',
      },
    ],
  },
  food: {
    indian: [] as ContentItem[],
    continental: [] as ContentItem[],
    desserts: [] as ContentItem[],
  },
};

export async function getContent(category: string, subcategory: string): Promise<ContentItem[]> {
  const cat = category.toLowerCase();
  const sub = subcategory.toLowerCase();

  if (cat === 'food') {
    if (sub === 'indian') return fetchMeals('Indian', sub);
    if (sub === 'continental') return fetchMeals('French', sub);
    if (sub === 'desserts') return fetchDesserts(sub);
  }

  if (cat === 'news') {
    return (staticContent.news[sub as keyof typeof staticContent.news] || []) as ContentItem[];
  }
  if (cat === 'sports') {
    return (staticContent.sports[sub as keyof typeof staticContent.sports] || []) as ContentItem[];
  }
  if (cat === 'movies') {
    return (staticContent.movies[sub as keyof typeof staticContent.movies] || []) as ContentItem[];
  }

  return [];
}

export async function getFeedContent(selectedCategory?: string): Promise<ContentItem[]> {
  const allSubcategories: { category: string; subcategory: string }[] = [
    { category: 'news', subcategory: 'political' },
    { category: 'news', subcategory: 'domestic' },
    { category: 'news', subcategory: 'international' },
    { category: 'sports', subcategory: 'cricket' },
    { category: 'sports', subcategory: 'football' },
    { category: 'sports', subcategory: 'olympics' },
    { category: 'movies', subcategory: 'bollywood' },
    { category: 'movies', subcategory: 'hollywood' },
    { category: 'movies', subcategory: 'documentaries' },
    { category: 'food', subcategory: 'indian' },
    { category: 'food', subcategory: 'desserts' },
  ];

  const filtered = selectedCategory
    ? allSubcategories.filter(s => s.category === selectedCategory.toLowerCase())
    : allSubcategories;

  const results = await Promise.all(
    filtered.map(({ category, subcategory }) => getContent(category, subcategory))
  );

  // Interleave results to get a mixed feed
  const mixed: ContentItem[] = [];
  const maxLen = Math.max(...results.map(r => r.length));
  for (let i = 0; i < maxLen; i++) {
    for (const arr of results) {
      if (arr[i]) mixed.push(arr[i]);
    }
  }

  // Shuffle a bit for variety
  for (let i = mixed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mixed[i], mixed[j]] = [mixed[j], mixed[i]];
  }

  return mixed.slice(0, 30);
}

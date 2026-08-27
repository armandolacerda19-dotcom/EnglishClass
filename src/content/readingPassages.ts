// Leitura extensiva — item da crítica de produto (2026-08-26) sinalizado como alto
// impacto: exposição a texto conectado (não frases isoladas) é um dos maiores
// preditores de aquisição de língua. Conteúdo estático (não passa pelo schema
// Exercise/Lesson) para não exigir alterações de schema nem seed — mais rápido
// de expandir no futuro, basta acrescentar entradas a este array.

export interface ReadingQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
}

export interface ReadingPassage {
  id: string;
  title: string;
  level: string;
  text: string;
  questions: ReadingQuestion[];
}

export const READING_PASSAGES: ReadingPassage[] = [
  {
    id: "morning-at-the-cafe",
    title: "A Morning at the Café",
    level: "A1",
    text: "Every morning, Sofia walks to the small café near her house. She always orders a coffee and a croissant. The café is quiet before 8am, so she likes to read the news there. Today, she meets her friend Paulo, and they talk about their weekend plans. Paulo wants to go to the beach, but Sofia prefers to stay in the city.",
    questions: [
      {
        id: "q1",
        prompt: "Where does Sofia go every morning?",
        options: ["To a small café", "To the beach", "To her office", "To the gym"],
        correctAnswer: "To a small café",
      },
      {
        id: "q2",
        prompt: "What does Sofia usually order?",
        options: ["Tea and toast", "A coffee and a croissant", "Juice and eggs", "Just water"],
        correctAnswer: "A coffee and a croissant",
      },
      {
        id: "q3",
        prompt: "What does Paulo want to do this weekend?",
        options: ["Stay in the city", "Go to the beach", "Read the news", "Work"],
        correctAnswer: "Go to the beach",
      },
    ],
  },
  {
    id: "annas-weekend",
    title: "Anna's Weekend",
    level: "A1",
    text: "Last weekend, Anna had a lot of free time. On Saturday, she woke up late and cleaned her apartment. In the afternoon, she visited her parents and had lunch with them. On Sunday, she went for a long walk in the park with her dog. In the evening, she cooked pasta and watched a movie with her sister.",
    questions: [
      {
        id: "q1",
        prompt: "What did Anna do on Saturday morning?",
        options: ["She went for a walk", "She woke up late and cleaned her apartment", "She cooked pasta", "She visited her parents"],
        correctAnswer: "She woke up late and cleaned her apartment",
      },
      {
        id: "q2",
        prompt: "Who did Anna have lunch with?",
        options: ["Her sister", "Her dog", "Her parents", "Her friend"],
        correctAnswer: "Her parents",
      },
      {
        id: "q3",
        prompt: "What did Anna do on Sunday evening?",
        options: ["She went for a walk", "She cleaned her apartment", "She cooked pasta and watched a movie", "She visited her parents"],
        correctAnswer: "She cooked pasta and watched a movie",
      },
    ],
  },
  {
    id: "the-weekly-market",
    title: "The Weekly Market",
    level: "A1",
    text: "Every Saturday morning, there is a market in the main square of the town. Local farmers sell fresh fruit, vegetables and cheese. There is also a stand with fresh bread and one with homemade jam. Maria goes there every week to buy vegetables for her family. She likes the market because the food is cheaper than at the supermarket, and she can talk to the farmers.",
    questions: [
      {
        id: "q1",
        prompt: "When does the market happen?",
        options: ["Every Saturday morning", "Every Sunday evening", "Every day", "Only in summer"],
        correctAnswer: "Every Saturday morning",
      },
      {
        id: "q2",
        prompt: "Why does Maria like the market?",
        options: [
          "Because it's close to her house",
          "Because the food is cheaper and she can talk to the farmers",
          "Because it's the only shop in town",
          "Because she works there",
        ],
        correctAnswer: "Because the food is cheaper and she can talk to the farmers",
      },
      {
        id: "q3",
        prompt: "What does Maria buy at the market?",
        options: ["Vegetables", "Only bread", "Clothes", "Nothing, she just visits"],
        correctAnswer: "Vegetables",
      },
    ],
  },
  {
    id: "toms-new-job",
    title: "Tom's New Job",
    level: "A1",
    text: "Tom started a new job last month. He works in an office in the city centre, and he commutes by train every day. His new manager is friendly and helpful. Tom's job is difficult, but he is learning a lot. On his first day, he was very nervous, but now he feels more confident. He usually has lunch with his colleagues at a restaurant near the office.",
    questions: [
      {
        id: "q1",
        prompt: "How does Tom get to work?",
        options: ["By car", "By train", "He walks", "By bicycle"],
        correctAnswer: "By train",
      },
      {
        id: "q2",
        prompt: "How did Tom feel on his first day?",
        options: ["Confident", "Bored", "Very nervous", "Angry"],
        correctAnswer: "Very nervous",
      },
      {
        id: "q3",
        prompt: "Where does Tom usually have lunch?",
        options: ["At home", "At a restaurant near the office", "In the park", "At his manager's house"],
        correctAnswer: "At a restaurant near the office",
      },
    ],
  },
  {
    id: "my-family",
    title: "My Family",
    level: "Pre-A1",
    text: "My name is Sara. I have a small family. My father is a teacher and my mother is a nurse. I have one brother. His name is Miguel and he is ten years old. We live in a small flat in the city. On Sundays, we have lunch together at my grandparents' house.",
    questions: [
      {
        id: "q1",
        prompt: "What is Sara's father's job?",
        options: ["Teacher", "Nurse", "Doctor", "Driver"],
        correctAnswer: "Teacher",
      },
      {
        id: "q2",
        prompt: "How old is Miguel?",
        options: ["Ten", "Eight", "Twelve", "Six"],
        correctAnswer: "Ten",
      },
      {
        id: "q3",
        prompt: "Where do they have lunch on Sundays?",
        options: ["At home", "At a restaurant", "At the grandparents' house", "At school"],
        correctAnswer: "At the grandparents' house",
      },
    ],
  },
  {
    id: "trip-to-the-supermarket",
    title: "A Trip to the Supermarket",
    level: "A1",
    text: "On Friday afternoons, Rui goes to the supermarket after work. He always makes a shopping list first. Today he needs bread, milk, eggs, and some fruit. The supermarket is busy, so he waits in a long queue at the checkout. He pays with his card and puts the bags in his car. He usually spends about thirty euros a week on food.",
    questions: [
      {
        id: "q1",
        prompt: "When does Rui go to the supermarket?",
        options: ["Friday afternoons", "Monday mornings", "Every day", "Sunday evenings"],
        correctAnswer: "Friday afternoons",
      },
      {
        id: "q2",
        prompt: "What does Rui do before he goes shopping?",
        options: ["He calls his mother", "He makes a shopping list", "He cooks dinner", "He cleans the car"],
        correctAnswer: "He makes a shopping list",
      },
      {
        id: "q3",
        prompt: "How does Rui pay?",
        options: ["With cash", "With his card", "He doesn't pay", "By cheque"],
        correctAnswer: "With his card",
      },
    ],
  },
  {
    id: "the-weather-today",
    title: "The Weather Today",
    level: "A1",
    text: "It's a cold morning in November. The sky is grey and it's raining a little. Ines is looking out of the window. She is wearing a warm coat and boots because she is going to work. Her umbrella is next to the door. Later today, the forecast says it will be sunny in the afternoon, so she is hoping the rain stops soon.",
    questions: [
      {
        id: "q1",
        prompt: "What is the weather like this morning?",
        options: ["Sunny and warm", "Cold and rainy", "Snowing", "Very hot"],
        correctAnswer: "Cold and rainy",
      },
      {
        id: "q2",
        prompt: "What is Ines wearing?",
        options: ["A swimsuit", "A warm coat and boots", "Sandals", "Shorts"],
        correctAnswer: "A warm coat and boots",
      },
      {
        id: "q3",
        prompt: "What does the forecast say about the afternoon?",
        options: ["More rain", "Snow", "It will be sunny", "A storm"],
        correctAnswer: "It will be sunny",
      },
    ],
  },
  {
    id: "places-i-have-visited",
    title: "Places I Have Visited",
    level: "A2",
    text: "I have travelled to several countries, but I have never been to Asia. I have visited France twice, and I have also been to Germany and Italy. Last year, I went to Rome with my sister, and we saw the Colosseum together. I have tried a lot of different food on my trips, but I have never eaten sushi. Next year, I would like to visit Japan for the first time.",
    questions: [
      {
        id: "q1",
        prompt: "Which continent has the writer never visited?",
        options: ["Europe", "Asia", "Africa", "South America"],
        correctAnswer: "Asia",
      },
      {
        id: "q2",
        prompt: "Who did the writer go to Rome with?",
        options: ["Her mother", "Her sister", "Alone", "Her colleagues"],
        correctAnswer: "Her sister",
      },
      {
        id: "q3",
        prompt: "What food has the writer never tried?",
        options: ["Pasta", "Pizza", "Sushi", "Paella"],
        correctAnswer: "Sushi",
      },
    ],
  },
  {
    id: "rules-at-the-gym",
    title: "Rules at the Gym",
    level: "A2",
    text: "There are several rules at my gym. You must bring a towel every time you go. You don't have to book the machines in advance, but during busy hours you should wait your turn politely. You must not leave weights on the floor after using them. You should also wear proper trainers, not sandals or bare feet. If you follow these simple rules, everyone can train comfortably.",
    questions: [
      {
        id: "q1",
        prompt: "What must you always bring to the gym?",
        options: ["A towel", "A water bottle", "Headphones", "A friend"],
        correctAnswer: "A towel",
      },
      {
        id: "q2",
        prompt: "Do you have to book the machines?",
        options: ["Yes, always", "No, you don't have to", "Only on Mondays", "Only in the morning"],
        correctAnswer: "No, you don't have to",
      },
      {
        id: "q3",
        prompt: "What must you not do after using weights?",
        options: ["Wipe them", "Leave them on the floor", "Put them away", "Share them"],
        correctAnswer: "Leave them on the floor",
      },
    ],
  },
  {
    id: "weekend-plans",
    title: "Weekend Plans",
    level: "A2",
    text: "Marta is planning her weekend. If it rains on Saturday, she will stay home and read a book. If the weather is good, she will go hiking with her friends in the mountains. On Sunday, if she has enough energy after the hike, she will visit her grandmother in the countryside. If not, she will just relax at home and prepare for the working week ahead.",
    questions: [
      {
        id: "q1",
        prompt: "What will Marta do if it rains on Saturday?",
        options: ["Go hiking", "Stay home and read", "Visit her grandmother", "Go to work"],
        correctAnswer: "Stay home and read",
      },
      {
        id: "q2",
        prompt: "Who will Marta go hiking with if the weather is good?",
        options: ["Her grandmother", "Alone", "Her friends", "Her colleagues"],
        correctAnswer: "Her friends",
      },
      {
        id: "q3",
        prompt: "What will Marta do on Sunday if she doesn't have energy?",
        options: ["Go hiking again", "Visit her grandmother", "Relax at home", "Go to the mountains"],
        correctAnswer: "Relax at home",
      },
    ],
  },
  {
    id: "a-busy-afternoon",
    title: "A Busy Afternoon",
    level: "A2",
    text: "It's three o'clock and the office is very busy today. Carla is writing an important report while her phone is ringing constantly. Two colleagues are preparing for a meeting in the next room, and someone is printing documents near the window. Meanwhile, the manager is talking to a client on a video call. Everyone is working hard because the deadline is tomorrow morning.",
    questions: [
      {
        id: "q1",
        prompt: "What is Carla doing?",
        options: ["Printing documents", "Writing an important report", "Talking to a client", "Preparing for a meeting"],
        correctAnswer: "Writing an important report",
      },
      {
        id: "q2",
        prompt: "What is the manager doing?",
        options: ["Writing a report", "Talking to a client on a video call", "Printing documents", "Reading emails"],
        correctAnswer: "Talking to a client on a video call",
      },
      {
        id: "q3",
        prompt: "Why is everyone working hard?",
        options: ["It's a holiday", "The deadline is tomorrow morning", "The manager is watching", "Nobody knows"],
        correctAnswer: "The deadline is tomorrow morning",
      },
    ],
  },
  {
    id: "a-new-flat",
    title: "A New Flat",
    level: "A2",
    text: "Diego just moved into a new flat in the city centre. It has a small kitchen, a bedroom, and a living room with a big window. The flat doesn't have much furniture yet, so he bought a sofa and a table last week. There is a supermarket on the corner and a bus stop just outside the building. Diego loves the flat because it's close to his office and quiet at night.",
    questions: [
      {
        id: "q1",
        prompt: "What did Diego buy last week?",
        options: ["A bed and a wardrobe", "A sofa and a table", "A television", "A fridge"],
        correctAnswer: "A sofa and a table",
      },
      {
        id: "q2",
        prompt: "What is on the corner near the flat?",
        options: ["A restaurant", "A supermarket", "A park", "A school"],
        correctAnswer: "A supermarket",
      },
      {
        id: "q3",
        prompt: "Why does Diego love the flat?",
        options: ["It's cheap", "It's close to his office and quiet at night", "It has a garden", "It's very big"],
        correctAnswer: "It's close to his office and quiet at night",
      },
    ],
  },
  {
    id: "packing-for-a-trip",
    title: "Packing for a Trip",
    level: "A2",
    text: "Beatriz is packing for a trip to the coast. She doesn't have much time, so she is packing quickly. She needs some clothes, a few pairs of shoes, and a little sun cream. She doesn't have many days there, just a long weekend, so she isn't taking much luggage. She has some euros in cash, but not much, so she plans to use her card for most things.",
    questions: [
      {
        id: "q1",
        prompt: "How much time does Beatriz have to pack?",
        options: ["A lot of time", "Not much time", "One week", "No time at all"],
        correctAnswer: "Not much time",
      },
      {
        id: "q2",
        prompt: "How long is the trip?",
        options: ["A month", "A long weekend", "Two weeks", "One day"],
        correctAnswer: "A long weekend",
      },
      {
        id: "q3",
        prompt: "How will Beatriz pay for most things?",
        options: ["With cash", "With her card", "She won't pay", "With a cheque"],
        correctAnswer: "With her card",
      },
    ],
  },
  {
    id: "the-power-cut",
    title: "The Power Cut",
    level: "A2",
    text: "Yesterday evening, something strange happened. I was cooking dinner when the lights suddenly went out. My neighbours were watching television when it happened too, so we knew it wasn't just our flat. While we were waiting for the power to come back, we lit some candles and talked in the kitchen. After about an hour, the electricity came back and I finished cooking dinner, much later than planned.",
    questions: [
      {
        id: "q1",
        prompt: "What was the writer doing when the lights went out?",
        options: ["Sleeping", "Cooking dinner", "Watching television", "Reading"],
        correctAnswer: "Cooking dinner",
      },
      {
        id: "q2",
        prompt: "What were the neighbours doing when it happened?",
        options: ["Cooking", "Watching television", "Sleeping", "Working"],
        correctAnswer: "Watching television",
      },
      {
        id: "q3",
        prompt: "How long did the power cut last?",
        options: ["About an hour", "All night", "Ten minutes", "Two days"],
        correctAnswer: "About an hour",
      },
    ],
  },
  {
    id: "a-job-interview",
    title: "A Job Interview",
    level: "A2",
    text: "\"So, why do you want to work here?\" the interviewer asked. \"I've always admired this company,\" I said, \"and I think my experience matches the role well.\" \"You worked at your last job for three years, didn't you?\" she asked. \"Yes, that's right,\" I replied. \"And you're available to start next month, aren't you?\" \"Definitely,\" I said, feeling more confident than when the interview started.",
    questions: [
      {
        id: "q1",
        prompt: "How long did the speaker work at their last job?",
        options: ["One year", "Two years", "Three years", "Five years"],
        correctAnswer: "Three years",
      },
      {
        id: "q2",
        prompt: "When is the speaker available to start?",
        options: ["Immediately", "Next month", "Next year", "In two months"],
        correctAnswer: "Next month",
      },
      {
        id: "q3",
        prompt: "How did the speaker feel by the end of the interview?",
        options: ["More nervous", "More confident", "Angry", "Bored"],
        correctAnswer: "More confident",
      },
    ],
  },
  {
    id: "a-late-arrival",
    title: "A Late Arrival",
    level: "B1",
    text: "By the time Marcos arrived at the airport, his flight had already left. He had planned everything carefully, but the traffic had been much worse than he had expected. He had never missed a flight before, so he felt quite anxious. Fortunately, he had bought travel insurance, and after speaking to an airline representative, he found out that he could take a later flight the same evening, although he had to pay a small fee.",
    questions: [
      {
        id: "q1",
        prompt: "What had already happened by the time Marcos arrived?",
        options: ["The flight had left", "The airport had closed", "His luggage had arrived", "His friend had left"],
        correctAnswer: "The flight had left",
      },
      {
        id: "q2",
        prompt: "Why was the traffic a problem?",
        options: ["It was worse than expected", "There was no traffic", "He liked driving in traffic", "He had never driven before"],
        correctAnswer: "It was worse than expected",
      },
      {
        id: "q3",
        prompt: "What could Marcos do about the situation?",
        options: ["Nothing at all", "Take a later flight for a small fee", "Get a full refund only", "Wait until the next day for free"],
        correctAnswer: "Take a later flight for a small fee",
      },
    ],
  },
  {
    id: "if-i-won-the-lottery",
    title: "If I Won the Lottery",
    level: "B1",
    text: "If I won the lottery, I wouldn't change my life completely. I would probably keep my job, because I actually enjoy what I do. However, I would definitely travel more, and I would buy a small house near the sea. If I had that much money, I would also help my family and give some to charity. I think if people suddenly became very rich, they would still need a purpose in life, not just money.",
    questions: [
      {
        id: "q1",
        prompt: "Would the writer keep their job if they won the lottery?",
        options: ["No, they would quit immediately", "Yes, because they enjoy it", "They don't say", "They would change jobs"],
        correctAnswer: "Yes, because they enjoy it",
      },
      {
        id: "q2",
        prompt: "What would the writer buy?",
        options: ["A car", "A small house near the sea", "A boat", "Nothing"],
        correctAnswer: "A small house near the sea",
      },
      {
        id: "q3",
        prompt: "According to the writer, what do rich people still need?",
        options: ["More money", "A purpose in life", "A bigger house", "Fame"],
        correctAnswer: "A purpose in life",
      },
    ],
  },
  {
    id: "how-coffee-is-made",
    title: "How Coffee Is Made",
    level: "B1",
    text: "Coffee is grown in many countries near the equator. First, the coffee cherries are picked by hand or by machine. Then, the beans are removed from the cherries and dried in the sun. After that, the beans are roasted at a high temperature, which gives coffee its dark colour and strong smell. Finally, the roasted beans are ground and brewed with hot water. Most of the coffee sold in shops has been processed this way before it reaches your cup.",
    questions: [
      {
        id: "q1",
        prompt: "Where is coffee usually grown?",
        options: ["Near the poles", "Near the equator", "Only in Europe", "Underground"],
        correctAnswer: "Near the equator",
      },
      {
        id: "q2",
        prompt: "What happens to the beans after they are dried?",
        options: ["They are eaten raw", "They are roasted", "They are thrown away", "They are frozen"],
        correctAnswer: "They are roasted",
      },
      {
        id: "q3",
        prompt: "What gives coffee its dark colour?",
        options: ["Being picked by hand", "Being roasted", "Being dried in the sun", "Being ground"],
        correctAnswer: "Being roasted",
      },
    ],
  },
  {
    id: "what-she-told-me",
    title: "What She Told Me",
    level: "B1",
    text: "My colleague told me that she was moving to another city for a new job. She said that she had been thinking about it for months, but that the decision hadn't been easy. She explained that she would miss her friends here, but that the opportunity was too good to refuse. She also mentioned that she would visit often, and that we should keep in touch. I told her that I understood completely and wished her good luck.",
    questions: [
      {
        id: "q1",
        prompt: "What did the colleague say she was doing?",
        options: ["Changing careers", "Moving to another city for a new job", "Retiring", "Going on holiday"],
        correctAnswer: "Moving to another city for a new job",
      },
      {
        id: "q2",
        prompt: "How long had she been thinking about the decision?",
        options: ["One day", "A few months", "Years", "She hadn't thought about it"],
        correctAnswer: "A few months",
      },
      {
        id: "q3",
        prompt: "What did she say she would do?",
        options: ["Never come back", "Visit often and keep in touch", "Forget her old friends", "Stay in the same city"],
        correctAnswer: "Visit often and keep in touch",
      },
    ],
  },
  {
    id: "this-time-next-year",
    title: "This Time Next Year",
    level: "B1",
    text: "This time next year, I'll be living in a different country. I've decided to study abroad for my master's degree, and by next spring, I'll be settling into a new routine in a new city. While I'm studying there, I'll also be working part-time to cover some of my expenses. I know it will be a big change, but I'll be learning so much, both about my subject and about myself. In two years, I hope I'll be starting a new career with much wider opportunities.",
    questions: [
      {
        id: "q1",
        prompt: "What will the writer be doing this time next year?",
        options: ["Living in a different country", "Working in the same job", "On holiday", "Retiring"],
        correctAnswer: "Living in a different country",
      },
      {
        id: "q2",
        prompt: "What will the writer be doing while studying?",
        options: ["Nothing else", "Working part-time", "Travelling constantly", "Sleeping all day"],
        correctAnswer: "Working part-time",
      },
      {
        id: "q3",
        prompt: "What does the writer hope for in two years?",
        options: ["To go back home immediately", "To start a new career with wider opportunities", "To stop studying", "To retire early"],
        correctAnswer: "To start a new career with wider opportunities",
      },
    ],
  },
  {
    id: "the-woman-who-changed-my-life",
    title: "The Woman Who Changed My Life",
    level: "B1",
    text: "The woman who taught me to read was my grandmother. She was the person who first showed me that books could take you anywhere. Every evening, she would read stories that were full of adventure, and I would listen for hours. Later, when I was struggling at school, she was the one who helped me practise every day. I still have the books that she gave me, and I think of her whenever I open one.",
    questions: [
      {
        id: "q1",
        prompt: "Who taught the writer to read?",
        options: ["A teacher", "The writer's grandmother", "A friend", "The writer's mother"],
        correctAnswer: "The writer's grandmother",
      },
      {
        id: "q2",
        prompt: "What did the grandmother do every evening?",
        options: ["Cook dinner", "Read stories", "Watch television", "Go for a walk"],
        correctAnswer: "Read stories",
      },
      {
        id: "q3",
        prompt: "What does the writer still have?",
        options: ["A photo of the grandmother", "The books she gave", "Her house", "Nothing"],
        correctAnswer: "The books she gave",
      },
    ],
  },
  {
    id: "new-years-resolutions",
    title: "My New Year's Resolutions",
    level: "B1",
    text: "Every January, I decide to make some changes. This year, I've promised myself to start exercising regularly and to stop eating so much sugar. I've also decided to try learning a new skill, so I've begun practising the guitar. I don't enjoy going to bed late, so I'm planning on sleeping earlier too. I know it's difficult to keep every resolution, but I'm determined to succeed with at least a few of them this time.",
    questions: [
      {
        id: "q1",
        prompt: "What has the writer decided to stop doing?",
        options: ["Exercising", "Eating so much sugar", "Learning new skills", "Sleeping early"],
        correctAnswer: "Eating so much sugar",
      },
      {
        id: "q2",
        prompt: "What new skill is the writer practising?",
        options: ["Cooking", "The guitar", "Painting", "Swimming"],
        correctAnswer: "The guitar",
      },
      {
        id: "q3",
        prompt: "How does the writer feel about the resolutions?",
        options: ["Certain to fail", "Determined to succeed with at least a few", "Uninterested", "Already given up"],
        correctAnswer: "Determined to succeed with at least a few",
      },
    ],
  },
  {
    id: "working-from-home",
    title: "Working From Home",
    level: "B1",
    text: "Since more companies allow remote work, many employees have started working from home. Some people enjoy it because they save time on commuting and can organise their day more flexibly. Others find it difficult to concentrate, especially if their home is noisy or small. A good work-life balance can be harder to achieve when the office is also the living room. Even so, surveys suggest that most workers who have tried remote work would prefer to keep at least some of it permanently.",
    questions: [
      {
        id: "q1",
        prompt: "Why do some people enjoy working from home?",
        options: ["They save time on commuting", "They earn more money", "They see colleagues more", "They travel more"],
        correctAnswer: "They save time on commuting",
      },
      {
        id: "q2",
        prompt: "What can be difficult about working from home?",
        options: ["Achieving a good work-life balance", "Finding a job", "Learning new skills", "Making friends"],
        correctAnswer: "Achieving a good work-life balance",
      },
      {
        id: "q3",
        prompt: "What do surveys suggest about remote work?",
        options: ["Most workers hate it", "Most workers would prefer to keep some of it", "It's illegal", "Nobody wants it"],
        correctAnswer: "Most workers would prefer to keep some of it",
      },
    ],
  },
];

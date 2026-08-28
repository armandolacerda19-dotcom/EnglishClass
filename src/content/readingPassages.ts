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
  // Fase 14 (auditoria 2026-08-27, "Inglês autêntico") — campo pedido
  // explicitamente no roadmap. Opcional e não retroativo: os 60 textos
  // existentes são todos narrativa curta em 3ª pessoa (o único género usado
  // até agora) e continuam válidos sem esta informação — só os textos novos,
  // escritos deliberadamente noutros formatos (diálogo, email, notícia), a
  // preenchem. Sem isto, não havia forma nenhuma de a app algum dia filtrar
  // ou variar por tipo de texto.
  genre?: "story" | "dialogue" | "email" | "news" | "instructions";
  source?: string; // ex. "original" — nunca um nome de publicação real (evita direitos de autor)
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
  {
    id: "this-is-my-house",
    title: "This Is My House",
    level: "Pre-A1",
    text: "This is my house. It is small but nice. There is a kitchen and a living room. There are two bedrooms and one bathroom. My bedroom is next to the bathroom. There is a small garden behind the house. I like my house very much.",
    questions: [
      {
        id: "q1",
        prompt: "How many bedrooms are there?",
        options: ["One", "Two", "Three", "Four"],
        correctAnswer: "Two",
      },
      {
        id: "q2",
        prompt: "Where is the writer's bedroom?",
        options: ["Next to the kitchen", "Next to the bathroom", "Next to the garden", "In the living room"],
        correctAnswer: "Next to the bathroom",
      },
      {
        id: "q3",
        prompt: "Where is the garden?",
        options: ["In front of the house", "Inside the kitchen", "Behind the house", "There is no garden"],
        correctAnswer: "Behind the house",
      },
    ],
  },
  {
    id: "what-time-is-it",
    title: "What Time Is It?",
    level: "Pre-A1",
    text: "I wake up at seven o'clock. I have breakfast at half past seven. School starts at nine o'clock. I have lunch at one o'clock. School finishes at four o'clock. I go to bed at ten o'clock.",
    questions: [
      {
        id: "q1",
        prompt: "What time does the writer wake up?",
        options: ["Six o'clock", "Seven o'clock", "Eight o'clock", "Nine o'clock"],
        correctAnswer: "Seven o'clock",
      },
      {
        id: "q2",
        prompt: "What time does school start?",
        options: ["Seven o'clock", "Eight o'clock", "Nine o'clock", "Ten o'clock"],
        correctAnswer: "Nine o'clock",
      },
      {
        id: "q3",
        prompt: "What time does the writer go to bed?",
        options: ["Nine o'clock", "Half past nine", "Ten o'clock", "Eleven o'clock"],
        correctAnswer: "Ten o'clock",
      },
    ],
  },
  {
    id: "a-day-at-school",
    title: "A Day at School",
    level: "A1",
    text: "Marta is a student. Every day, she goes to school by bus. Her first class is Maths, and she really likes it. After Maths, she has English and Science. At lunchtime, she eats with her friends in the cafeteria. In the afternoon, she has Art, which is her favourite subject. After school, she does her homework and then plays with her little brother.",
    questions: [
      {
        id: "q1",
        prompt: "How does Marta go to school?",
        options: ["By bus", "By car", "On foot", "By bicycle"],
        correctAnswer: "By bus",
      },
      {
        id: "q2",
        prompt: "What is Marta's favourite subject?",
        options: ["Maths", "English", "Science", "Art"],
        correctAnswer: "Art",
      },
      {
        id: "q3",
        prompt: "What does Marta do after school?",
        options: ["She goes to bed", "She does homework and plays with her brother", "She goes to work", "She watches TV all day"],
        correctAnswer: "She does homework and plays with her brother",
      },
    ],
  },
  {
    id: "my-favourite-season",
    title: "My Favourite Season",
    level: "A1",
    text: "My favourite season is summer. I like summer because the weather is warm and sunny. I don't like winter because it is too cold. In summer, I go to the beach with my family every weekend. We swim in the sea and eat ice cream. My sister prefers autumn because she loves the colourful leaves, but for me, nothing is better than a hot summer day.",
    questions: [
      {
        id: "q1",
        prompt: "What is the writer's favourite season?",
        options: ["Spring", "Summer", "Autumn", "Winter"],
        correctAnswer: "Summer",
      },
      {
        id: "q2",
        prompt: "What does the family do at the beach?",
        options: ["They read books", "They swim and eat ice cream", "They play football", "They sleep"],
        correctAnswer: "They swim and eat ice cream",
      },
      {
        id: "q3",
        prompt: "What season does the writer's sister prefer?",
        options: ["Summer", "Winter", "Autumn", "Spring"],
        correctAnswer: "Autumn",
      },
    ],
  },
  {
    id: "at-the-bus-station",
    title: "At the Bus Station",
    level: "A1",
    text: "\"Excuse me, can I have a ticket to the city centre, please?\" \"Sure, that's three euros. Single or return?\" \"Return, please.\" \"Here you go. The bus leaves from platform two in ten minutes.\" \"Thank you very much. Do you know if it stops near the museum?\" \"Yes, it does. Just tell the driver where you want to get off.\"",
    questions: [
      {
        id: "q1",
        prompt: "How much does the ticket cost?",
        options: ["One euro", "Two euros", "Three euros", "Four euros"],
        correctAnswer: "Three euros",
      },
      {
        id: "q2",
        prompt: "Which platform does the bus leave from?",
        options: ["Platform one", "Platform two", "Platform three", "Platform four"],
        correctAnswer: "Platform two",
      },
      {
        id: "q3",
        prompt: "Does the bus stop near the museum?",
        options: ["Yes, it does", "No, it doesn't", "The passenger doesn't ask", "Only on weekends"],
        correctAnswer: "Yes, it does",
      },
    ],
  },
  {
    id: "learning-a-new-hobby",
    title: "Learning a New Hobby",
    level: "A2",
    text: "Six months ago, I decided to learn how to paint. I've never been very artistic, so it wasn't easy at first. I've already finished five paintings, and I've learned a lot about colours and shapes. I practise for an hour every evening after work. My teacher says I've improved a lot since I started. I haven't sold any paintings yet, but I'm really proud of what I've achieved so far.",
    questions: [
      {
        id: "q1",
        prompt: "What hobby did the writer decide to learn?",
        options: ["Painting", "Playing guitar", "Cooking", "Dancing"],
        correctAnswer: "Painting",
      },
      {
        id: "q2",
        prompt: "How many paintings has the writer finished?",
        options: ["Three", "Four", "Five", "Six"],
        correctAnswer: "Five",
      },
      {
        id: "q3",
        prompt: "Has the writer sold any paintings?",
        options: ["Yes, many", "Yes, just one", "No, not yet", "The text doesn't say"],
        correctAnswer: "No, not yet",
      },
    ],
  },
  {
    id: "a-visit-to-the-doctor",
    title: "A Visit to the Doctor",
    level: "A2",
    text: "I haven't been feeling well this week, so I made an appointment with my doctor. She listened to my symptoms and said I should rest more and drink plenty of water. She also said I have to take these tablets twice a day for a week. I don't have to stay in bed all day, but I should avoid going to work until I feel better. I have another appointment next Friday to see how I'm doing.",
    questions: [
      {
        id: "q1",
        prompt: "What does the doctor say the writer should do?",
        options: ["Rest more and drink water", "Go to work as normal", "Stop taking medicine", "Travel abroad"],
        correctAnswer: "Rest more and drink water",
      },
      {
        id: "q2",
        prompt: "How often should the writer take the tablets?",
        options: ["Once a day", "Twice a day", "Three times a day", "Once a week"],
        correctAnswer: "Twice a day",
      },
      {
        id: "q3",
        prompt: "When is the writer's next appointment?",
        options: ["Tomorrow", "Next Monday", "Next Friday", "In a month"],
        correctAnswer: "Next Friday",
      },
    ],
  },
  {
    id: "a-difficult-decision",
    title: "A Difficult Decision",
    level: "B1",
    text: "By the time I finished university, I had already received two job offers. One was in my home city, close to my family, and the other was abroad, with a much higher salary. If I took the job abroad, I would earn more money, but I would miss important moments with my family. In the end, I decided to stay close to home, because some things are more valuable than a bigger paycheque. I've never regretted that decision.",
    questions: [
      {
        id: "q1",
        prompt: "How many job offers had the writer received?",
        options: ["One", "Two", "Three", "None"],
        correctAnswer: "Two",
      },
      {
        id: "q2",
        prompt: "What would happen if the writer took the job abroad?",
        options: ["They would earn less money", "They would miss family moments", "They would move back home", "They would lose the job"],
        correctAnswer: "They would miss family moments",
      },
      {
        id: "q3",
        prompt: "Has the writer regretted the decision?",
        options: ["Yes, often", "Yes, a little", "No, never", "The text doesn't say"],
        correctAnswer: "No, never",
      },
    ],
  },
  {
    id: "how-paper-is-recycled",
    title: "How Paper Is Recycled",
    level: "B1",
    text: "Used paper is collected from homes and offices and taken to a recycling plant. There, it is sorted by type and mixed with water to create a pulp. The pulp is cleaned to remove ink and other materials, and then it is pressed and dried into new sheets of paper. This process saves trees and reduces the amount of waste sent to landfills. On average, most paper can be recycled several times before the fibres become too short to be reused.",
    questions: [
      {
        id: "q1",
        prompt: "What is used paper mixed with to create a pulp?",
        options: ["Oil", "Water", "Sand", "Glue"],
        correctAnswer: "Water",
      },
      {
        id: "q2",
        prompt: "What does the pulp become after being pressed and dried?",
        options: ["New sheets of paper", "Plastic", "Cardboard boxes", "Fuel"],
        correctAnswer: "New sheets of paper",
      },
      {
        id: "q3",
        prompt: "Why does the fibre eventually stop being reusable?",
        options: ["It becomes too wet", "It becomes too short", "It changes colour", "It becomes too heavy"],
        correctAnswer: "It becomes too short",
      },
    ],
  },
  {
    id: "choosing-a-university-course",
    title: "Choosing a University Course",
    level: "B1",
    text: "Choosing what to study at university can be one of the hardest decisions a young person makes. Some students already know exactly what they want to do, while others might change their minds several times before deciding. It could be helpful to talk to people already working in a field you're interested in, or you might try a short course first to see if you enjoy it. There's no single right answer — what matters most is choosing something that could keep you motivated for years to come.",
    questions: [
      {
        id: "q1",
        prompt: "What might help someone choose a university course?",
        options: ["Talking to people working in that field", "Choosing randomly", "Copying a friend's choice", "Avoiding all research"],
        correctAnswer: "Talking to people working in that field",
      },
      {
        id: "q2",
        prompt: "What does the text suggest trying before deciding?",
        options: ["A short course", "A full degree", "A different country", "Nothing at all"],
        correctAnswer: "A short course",
      },
      {
        id: "q3",
        prompt: "What matters most, according to the text?",
        options: ["Choosing the highest-paid course", "Choosing something that could keep you motivated", "Choosing what your parents want", "Choosing the shortest course"],
        correctAnswer: "Choosing something that could keep you motivated",
      },
    ],
  },
  {
    id: "my-best-friend",
    title: "My Best Friend",
    level: "Pre-A1",
    text: "My best friend is called Ines. She is tall and she has long black hair. She is very kind and funny. We are in the same class at school. Ines likes music and dancing. I like books and drawing. We are different, but we are good friends.",
    questions: [
      {
        id: "q1",
        prompt: "What colour is Ines's hair?",
        options: ["Black", "Brown", "Red", "Blonde"],
        correctAnswer: "Black",
      },
      {
        id: "q2",
        prompt: "What does Ines like?",
        options: ["Books and drawing", "Music and dancing", "Sport", "Cooking"],
        correctAnswer: "Music and dancing",
      },
      {
        id: "q3",
        prompt: "Are Ines and the writer in the same class?",
        options: ["Yes", "No", "The text doesn't say", "They go to different schools"],
        correctAnswer: "Yes",
      },
    ],
  },
  {
    id: "at-the-zoo",
    title: "At the Zoo",
    level: "Pre-A1",
    text: "There is a big zoo in my city. There are lions, elephants and monkeys. There is also a small lake with ducks. My favourite animals are the monkeys because they are funny. There isn't a tiger in this zoo, but there is one in the zoo in the next city.",
    questions: [
      {
        id: "q1",
        prompt: "What are the writer's favourite animals?",
        options: ["Lions", "Elephants", "Monkeys", "Ducks"],
        correctAnswer: "Monkeys",
      },
      {
        id: "q2",
        prompt: "What is in the small lake?",
        options: ["Fish", "Ducks", "Monkeys", "Nothing"],
        correctAnswer: "Ducks",
      },
      {
        id: "q3",
        prompt: "Is there a tiger in this zoo?",
        options: ["Yes", "No", "There are two tigers", "The text doesn't say"],
        correctAnswer: "No",
      },
    ],
  },
  {
    id: "a-letter-to-my-cousin",
    title: "A Letter to My Cousin",
    level: "A1",
    text: "Dear Sofia, How are you? I am fine. I live in Porto now with my parents. My new school is nice and I have three new friends. Next month, I am going to visit you in Lisbon. We are going to go to the beach and eat pastel de nata together. I am very excited! Write back soon. Love, Beatriz.",
    questions: [
      {
        id: "q1",
        prompt: "Where does Beatriz live now?",
        options: ["Lisbon", "Porto", "Faro", "Coimbra"],
        correctAnswer: "Porto",
      },
      {
        id: "q2",
        prompt: "How many new friends does Beatriz have?",
        options: ["One", "Two", "Three", "Four"],
        correctAnswer: "Three",
      },
      {
        id: "q3",
        prompt: "What are Beatriz and Sofia going to do together?",
        options: ["Go to school", "Go to the beach and eat pastel de nata", "Go shopping", "Watch a film"],
        correctAnswer: "Go to the beach and eat pastel de nata",
      },
    ],
  },
  {
    id: "a-trip-to-the-library",
    title: "A Trip to the Library",
    level: "A1",
    text: "Every Wednesday afternoon, I go to the public library. I can borrow up to five books at a time, and I can keep them for three weeks. There is a quiet room where I can study, and a children's area with lots of picture books. I can't eat or drink inside, but I can use my laptop if I am quiet. My favourite part is the big window next to the English books.",
    questions: [
      {
        id: "q1",
        prompt: "How many books can the writer borrow at a time?",
        options: ["Three", "Four", "Five", "Ten"],
        correctAnswer: "Five",
      },
      {
        id: "q2",
        prompt: "What can't the writer do inside the library?",
        options: ["Study", "Use a laptop", "Eat or drink", "Borrow books"],
        correctAnswer: "Eat or drink",
      },
      {
        id: "q3",
        prompt: "Where is the writer's favourite part of the library?",
        options: ["Next to the children's area", "Next to the English books", "In the quiet room", "Near the entrance"],
        correctAnswer: "Next to the English books",
      },
    ],
  },
  {
    id: "my-neighbours-dog",
    title: "My Neighbour's Dog",
    level: "A1",
    text: "My neighbour has a small dog called Bolt. Bolt can run very fast and he can jump really high. He can't swim, though — he is afraid of water. Every morning, my neighbour takes Bolt for a walk in the park. Bolt likes to play with other dogs, but he can't stay still for very long. He is a very energetic little dog.",
    questions: [
      {
        id: "q1",
        prompt: "What can Bolt do well?",
        options: ["Swim", "Run fast and jump high", "Sing", "Read"],
        correctAnswer: "Run fast and jump high",
      },
      {
        id: "q2",
        prompt: "What can't Bolt do?",
        options: ["Run", "Jump", "Swim", "Play"],
        correctAnswer: "Swim",
      },
      {
        id: "q3",
        prompt: "Where does the neighbour take Bolt every morning?",
        options: ["To the park", "To the beach", "To school", "To the vet"],
        correctAnswer: "To the park",
      },
    ],
  },
  {
    id: "learning-to-drive",
    title: "Learning to Drive",
    level: "A2",
    text: "I've started taking driving lessons this month. My instructor says I have to practise parking more, but I don't have to worry about the motorway yet. I should read the theory book every night before my test. Some of my friends say I shouldn't be nervous, but I can't help it — the exam is in three weeks! I have to book at least two more lessons before then.",
    questions: [
      {
        id: "q1",
        prompt: "What does the instructor say the writer has to practise?",
        options: ["Parking", "The motorway", "Reading signs", "Reversing"],
        correctAnswer: "Parking",
      },
      {
        id: "q2",
        prompt: "What should the writer do every night?",
        options: ["Drive alone", "Read the theory book", "Call the instructor", "Sleep early"],
        correctAnswer: "Read the theory book",
      },
      {
        id: "q3",
        prompt: "When is the exam?",
        options: ["Tomorrow", "In one week", "In three weeks", "Next year"],
        correctAnswer: "In three weeks",
      },
    ],
  },
  {
    id: "a-surprise-party",
    title: "A Surprise Party",
    level: "A2",
    text: "Last Saturday, we threw a surprise party for my grandmother's seventieth birthday. We spent the whole afternoon decorating the house and hiding the food. When she arrived, everyone shouted \"Surprise!\" and she was completely shocked. She said she hadn't expected anything at all. We ate cake, danced, and told old family stories until midnight. It was one of the best parties I've ever been to.",
    questions: [
      {
        id: "q1",
        prompt: "Whose birthday was it?",
        options: ["The writer's mother", "The writer's grandmother", "The writer's sister", "A friend"],
        correctAnswer: "The writer's grandmother",
      },
      {
        id: "q2",
        prompt: "How did the grandmother react?",
        options: ["She was angry", "She was bored", "She was completely shocked", "She left early"],
        correctAnswer: "She was completely shocked",
      },
      {
        id: "q3",
        prompt: "Until when did the party last?",
        options: ["9pm", "10pm", "Midnight", "It lasted all week"],
        correctAnswer: "Midnight",
      },
    ],
  },
  {
    id: "saving-money",
    title: "Saving Money",
    level: "A2",
    text: "I've been trying to save more money this year. Cooking at home is much cheaper than eating out, so I only go to restaurants once a month now. Public transport is also cheaper than driving, so I'm planning to sell my car if I move to the city centre. If I keep saving like this, I'll have enough for a holiday by the summer. It's harder than I expected, but it feels good to watch my savings grow.",
    questions: [
      {
        id: "q1",
        prompt: "How often does the writer go to restaurants now?",
        options: ["Every day", "Once a week", "Once a month", "Never"],
        correctAnswer: "Once a month",
      },
      {
        id: "q2",
        prompt: "What is cheaper than driving, according to the text?",
        options: ["Public transport", "Taxis", "Renting a car", "Nothing"],
        correctAnswer: "Public transport",
      },
      {
        id: "q3",
        prompt: "What does the writer want to have enough money for?",
        options: ["A car", "A holiday", "A new house", "A party"],
        correctAnswer: "A holiday",
      },
    ],
  },
  {
    id: "the-history-of-my-town",
    title: "The History of My Town",
    level: "B1",
    text: "My town used to be a small fishing village a hundred years ago. Fishermen used to sell their catch right on the beach every morning. There didn't use to be any hotels or restaurants — just a few houses and a small church. Nowadays, the town has grown a lot, with tourists visiting every summer. Some older residents say they miss how quiet it used to be, but most people agree that the town's growth has brought new opportunities.",
    questions: [
      {
        id: "q1",
        prompt: "What did the town use to be?",
        options: ["A small fishing village", "A big city", "A farming village", "An industrial town"],
        correctAnswer: "A small fishing village",
      },
      {
        id: "q2",
        prompt: "What didn't use to exist in the town?",
        options: ["Houses", "A church", "Hotels or restaurants", "Fishermen"],
        correctAnswer: "Hotels or restaurants",
      },
      {
        id: "q3",
        prompt: "What do most residents think about the town's growth?",
        options: ["It has brought new opportunities", "It has ruined the town", "It hasn't changed anything", "It should be stopped"],
        correctAnswer: "It has brought new opportunities",
      },
    ],
  },
  {
    id: "an-unusual-job",
    title: "An Unusual Job",
    level: "B1",
    text: "My uncle, who has worked as a lighthouse keeper for twenty years, has one of the most unusual jobs I know. He lives on a small island that can only be reached by boat. His main task, which sounds simple, is to make sure the light works every night to guide ships safely. The job, which used to require someone present at all times, is now mostly automated, but my uncle still visits regularly to check the equipment.",
    questions: [
      {
        id: "q1",
        prompt: "What does the uncle's job involve?",
        options: ["Making sure the light works to guide ships", "Fishing", "Building boats", "Teaching sailors"],
        correctAnswer: "Making sure the light works to guide ships",
      },
      {
        id: "q2",
        prompt: "How can the island be reached?",
        options: ["By car", "By boat", "By plane", "On foot"],
        correctAnswer: "By boat",
      },
      {
        id: "q3",
        prompt: "Is the job still fully manual?",
        options: ["Yes, completely", "No, it's now mostly automated", "It was never automated", "The text doesn't say"],
        correctAnswer: "No, it's now mostly automated",
      },
    ],
  },
  {
    id: "my-body",
    title: "My Body",
    level: "Pre-A1",
    text: "I have two eyes, two ears and one nose. I have ten fingers and ten toes. I can walk with my legs. I can hear with my ears. I can see with my eyes. I can't fly, but I can run very fast.",
    questions: [
      {
        id: "q1",
        prompt: "How many eyes does the writer have?",
        options: ["One", "Two", "Three", "Four"],
        correctAnswer: "Two",
      },
      {
        id: "q2",
        prompt: "What can the writer do with their ears?",
        options: ["See", "Hear", "Walk", "Smell"],
        correctAnswer: "Hear",
      },
      {
        id: "q3",
        prompt: "What can't the writer do?",
        options: ["Walk", "Run", "Fly", "Hear"],
        correctAnswer: "Fly",
      },
    ],
  },
  {
    id: "the-colours-i-like",
    title: "The Colours I Like",
    level: "Pre-A1",
    text: "My favourite colour is blue. The sky is blue and the sea is blue too. I don't like yellow very much. My bedroom is green and white. My school bag is red. My best friend likes purple, but I think purple is a strange colour.",
    questions: [
      {
        id: "q1",
        prompt: "What is the writer's favourite colour?",
        options: ["Red", "Blue", "Green", "Purple"],
        correctAnswer: "Blue",
      },
      {
        id: "q2",
        prompt: "What colour is the writer's bedroom?",
        options: ["Blue", "Red", "Green and white", "Yellow"],
        correctAnswer: "Green and white",
      },
      {
        id: "q3",
        prompt: "What colour does the best friend like?",
        options: ["Blue", "Yellow", "Purple", "Red"],
        correctAnswer: "Purple",
      },
    ],
  },
  {
    id: "my-pet-cat",
    title: "My Pet Cat",
    level: "Pre-A1",
    text: "I have a cat called Luna. She is white and grey. She has green eyes. Luna likes to sleep on my bed. She doesn't like water. Every morning, I give Luna some food and clean water. Luna is very soft and I love her a lot.",
    questions: [
      {
        id: "q1",
        prompt: "What colour is Luna?",
        options: ["Black", "White and grey", "Orange", "Brown"],
        correctAnswer: "White and grey",
      },
      {
        id: "q2",
        prompt: "Where does Luna like to sleep?",
        options: ["On the floor", "On my bed", "In the kitchen", "Outside"],
        correctAnswer: "On my bed",
      },
      {
        id: "q3",
        prompt: "Does Luna like water?",
        options: ["Yes", "No", "The text doesn't say", "Sometimes"],
        correctAnswer: "No",
      },
    ],
  },
  {
    id: "a-birthday-party",
    title: "A Birthday Party",
    level: "A1",
    text: "Yesterday was my brother's birthday party. There were balloons and a big chocolate cake. Twenty people came to the party. We played games in the garden and listened to music. My brother opened his presents and thanked everyone. At the end, we ate the cake and sang \"Happy Birthday\". It was a great party.",
    questions: [
      {
        id: "q1",
        prompt: "How many people came to the party?",
        options: ["Ten", "Fifteen", "Twenty", "Thirty"],
        correctAnswer: "Twenty",
      },
      {
        id: "q2",
        prompt: "Where did they play games?",
        options: ["In the kitchen", "In the garden", "At school", "At the beach"],
        correctAnswer: "In the garden",
      },
      {
        id: "q3",
        prompt: "What did they eat at the end?",
        options: ["Pizza", "Sandwiches", "Cake", "Fruit"],
        correctAnswer: "Cake",
      },
    ],
  },
  {
    id: "going-to-the-cinema",
    title: "Going to the Cinema",
    level: "A1",
    text: "This weekend, I am going to go to the cinema with my friends. We are going to watch a new comedy film. Before the film, we are going to have dinner at a pizza restaurant. My friend Carla is going to buy the tickets online, so we don't have to wait in a queue. I am really looking forward to it.",
    questions: [
      {
        id: "q1",
        prompt: "What kind of film are they going to watch?",
        options: ["A comedy", "A horror film", "A documentary", "A cartoon"],
        correctAnswer: "A comedy",
      },
      {
        id: "q2",
        prompt: "What are they going to do before the film?",
        options: ["Go shopping", "Have dinner at a pizza restaurant", "Go home", "Watch TV"],
        correctAnswer: "Have dinner at a pizza restaurant",
      },
      {
        id: "q3",
        prompt: "Who is going to buy the tickets?",
        options: ["The writer", "Carla", "Nobody", "The cinema staff"],
        correctAnswer: "Carla",
      },
    ],
  },
  {
    id: "my-morning-routine",
    title: "My Morning Routine",
    level: "A1",
    text: "I usually get up at half past six. First, I take a shower and get dressed. Then I have breakfast with my family — I usually eat toast and drink orange juice. After breakfast, I brush my teeth and pack my bag. I leave the house at half past seven and walk to the bus stop. My morning routine never changes much, but I don't mind — I like having a routine.",
    questions: [
      {
        id: "q1",
        prompt: "What does the writer usually eat for breakfast?",
        options: ["Cereal", "Toast", "Eggs", "Nothing"],
        correctAnswer: "Toast",
      },
      {
        id: "q2",
        prompt: "What does the writer do after breakfast?",
        options: ["Go back to sleep", "Brush their teeth and pack their bag", "Watch TV", "Go for a run"],
        correctAnswer: "Brush their teeth and pack their bag",
      },
      {
        id: "q3",
        prompt: "How does the writer feel about their routine?",
        options: ["They hate it", "They don't mind it", "They want to change it completely", "They never think about it"],
        correctAnswer: "They don't mind it",
      },
    ],
  },
  {
    id: "volunteering-at-an-animal-shelter",
    title: "Volunteering at an Animal Shelter",
    level: "A2",
    text: "I've been volunteering at a local animal shelter for six months now. I go there every Saturday and help feed the dogs and clean their cages. Since I started, I've learned a lot about how to care for animals properly. I've also made some good friends among the other volunteers. It hasn't always been easy — some of the dogs have had difficult pasts — but I've never regretted signing up.",
    questions: [
      {
        id: "q1",
        prompt: "How long has the writer been volunteering?",
        options: ["Two months", "Six months", "A year", "Five years"],
        correctAnswer: "Six months",
      },
      {
        id: "q2",
        prompt: "What does the writer do at the shelter?",
        options: ["Feed dogs and clean cages", "Train new staff", "Sell tickets", "Walk cats"],
        correctAnswer: "Feed dogs and clean cages",
      },
      {
        id: "q3",
        prompt: "Has the writer regretted volunteering?",
        options: ["Yes, often", "Yes, once", "No, never", "The text doesn't say"],
        correctAnswer: "No, never",
      },
    ],
  },
  {
    id: "planning-a-wedding",
    title: "Planning a Wedding",
    level: "A2",
    text: "My sister is going to get married next summer, and the whole family is helping to plan the wedding. We have to choose a venue soon, because good places get booked up quickly. She should decide on the guest list before we can book the caterer. I don't have to organise the flowers, thankfully — that's my aunt's job. It's a lot of work, but it's going to be a beautiful day.",
    questions: [
      {
        id: "q1",
        prompt: "When is the sister going to get married?",
        options: ["This winter", "Next summer", "In two years", "Next month"],
        correctAnswer: "Next summer",
      },
      {
        id: "q2",
        prompt: "What does the sister need to decide before booking the caterer?",
        options: ["The guest list", "The music", "The dress", "The date"],
        correctAnswer: "The guest list",
      },
      {
        id: "q3",
        prompt: "Who is organising the flowers?",
        options: ["The writer", "The sister", "The aunt", "Nobody yet"],
        correctAnswer: "The aunt",
      },
    ],
  },
  {
    id: "the-benefits-of-cycling-to-work",
    title: "The Benefits of Cycling to Work",
    level: "B1",
    text: "More and more people are choosing to cycle to work instead of driving. Cycling is often faster than driving in busy cities, especially during rush hour, and it's certainly cheaper than paying for petrol and parking. It's also better for your health, since it's a form of daily exercise that doesn't require a trip to the gym. Bike lanes have been built in many cities to make cycling safer, although some cyclists still say more needs to be done to protect them from traffic.",
    questions: [
      {
        id: "q1",
        prompt: "Why can cycling be faster than driving in cities?",
        options: ["Bikes are more expensive", "Especially during rush hour", "Cars are always faster", "Bikes can fly"],
        correctAnswer: "Especially during rush hour",
      },
      {
        id: "q2",
        prompt: "Why is cycling good for health?",
        options: ["It's a form of daily exercise", "It requires a gym membership", "It's very fast", "It's free"],
        correctAnswer: "It's a form of daily exercise",
      },
      {
        id: "q3",
        prompt: "What do some cyclists say still needs improvement?",
        options: ["More parking", "More protection from traffic", "Cheaper bikes", "Faster bike lanes"],
        correctAnswer: "More protection from traffic",
      },
    ],
  },
  {
    id: "a-job-interview-that-went-wrong",
    title: "A Job Interview That Went Wrong",
    level: "B1",
    text: "By the time I arrived for the interview, I had already missed my bus twice and I was fifteen minutes late. I had prepared answers for the usual questions, but the interviewer asked things I hadn't expected at all. Halfway through, I realised I had forgotten to bring a copy of my CV, which made things even more awkward. Looking back, I think I had underestimated how nervous I would feel. I didn't get that job, but I learned a lot for the next interview.",
    questions: [
      {
        id: "q1",
        prompt: "Why was the writer late?",
        options: ["They overslept", "They missed the bus twice", "The car broke down", "They got lost"],
        correctAnswer: "They missed the bus twice",
      },
      {
        id: "q2",
        prompt: "What had the writer forgotten to bring?",
        options: ["A pen", "A copy of their CV", "Their ID", "Water"],
        correctAnswer: "A copy of their CV",
      },
      {
        id: "q3",
        prompt: "Did the writer get the job?",
        options: ["Yes", "No", "The text doesn't say", "They didn't want it"],
        correctAnswer: "No",
      },
    ],
  },
  {
    id: "my-favourite-toy",
    title: "My Favourite Toy",
    level: "Pre-A1",
    text: "My favourite toy is a small brown bear. Its name is Teddy. Teddy is soft and old. I sleep with Teddy every night. My grandmother gave me Teddy when I was a baby. I don't have many toys, but Teddy is the best one.",
    questions: [
      {
        id: "q1",
        prompt: "What is the toy's name?",
        options: ["Bear", "Teddy", "Brownie", "Softy"],
        correctAnswer: "Teddy",
      },
      {
        id: "q2",
        prompt: "Who gave the writer Teddy?",
        options: ["Their mother", "Their grandmother", "Their friend", "Their teacher"],
        correctAnswer: "Their grandmother",
      },
      {
        id: "q3",
        prompt: "When does the writer sleep with Teddy?",
        options: ["Never", "Every night", "Only on weekends", "Only in winter"],
        correctAnswer: "Every night",
      },
    ],
  },
  {
    id: "at-the-playground",
    title: "At the Playground",
    level: "Pre-A1",
    text: "There is a playground near my house. There is a slide, two swings and a small climbing frame. I go there with my little brother after school. He likes the swings, but I like the slide. There aren't many children there in the morning, but there are lots of children in the afternoon.",
    questions: [
      {
        id: "q1",
        prompt: "What does the little brother like?",
        options: ["The slide", "The swings", "The climbing frame", "Nothing"],
        correctAnswer: "The swings",
      },
      {
        id: "q2",
        prompt: "When does the writer go to the playground?",
        options: ["Before school", "After school", "At night", "On Sundays only"],
        correctAnswer: "After school",
      },
      {
        id: "q3",
        prompt: "When are there lots of children at the playground?",
        options: ["In the morning", "In the afternoon", "At night", "Never"],
        correctAnswer: "In the afternoon",
      },
    ],
  },
  {
    id: "a-rainy-day",
    title: "A Rainy Day",
    level: "A1",
    text: "It's raining outside today, so we can't go to the park. My sister is drawing at the table, and my father is reading the newspaper. I am watching a film on my laptop. Our dog is sleeping next to the window. My mother is making hot chocolate for everyone. Rainy days aren't so bad when you're at home with your family.",
    questions: [
      {
        id: "q1",
        prompt: "Why can't they go to the park?",
        options: ["It's too cold", "It's raining", "It's too late", "The park is closed"],
        correctAnswer: "It's raining",
      },
      {
        id: "q2",
        prompt: "What is the sister doing?",
        options: ["Reading", "Drawing", "Sleeping", "Cooking"],
        correctAnswer: "Drawing",
      },
      {
        id: "q3",
        prompt: "What is the mother making?",
        options: ["Coffee", "Tea", "Hot chocolate", "Soup"],
        correctAnswer: "Hot chocolate",
      },
    ],
  },
  {
    id: "my-favourite-food",
    title: "My Favourite Food",
    level: "A1",
    text: "My favourite food is pasta with tomato sauce. I eat it at least once a week. I also like chicken and rice, but I don't like fish very much. My mother makes the best pasta in the world — better than any restaurant. On my birthday, I always ask her to make it for dinner.",
    questions: [
      {
        id: "q1",
        prompt: "What is the writer's favourite food?",
        options: ["Chicken and rice", "Pasta with tomato sauce", "Fish", "Pizza"],
        correctAnswer: "Pasta with tomato sauce",
      },
      {
        id: "q2",
        prompt: "What food doesn't the writer like very much?",
        options: ["Pasta", "Chicken", "Rice", "Fish"],
        correctAnswer: "Fish",
      },
      {
        id: "q3",
        prompt: "What does the writer ask for on their birthday?",
        options: ["Cake", "Pasta made by their mother", "A restaurant meal", "Pizza"],
        correctAnswer: "Pasta made by their mother",
      },
    ],
  },
  {
    id: "starting-a-new-job",
    title: "Starting a New Job",
    level: "A2",
    text: "I started my new job last Monday, and it's been a busy first week. I've already met most of my colleagues, and everyone has been very friendly. On my first day, my manager showed me around the office and explained my main tasks. I haven't learned everyone's name yet, but I've written most of them down. It's a bit tiring learning so many new things at once, but I'm enjoying the challenge so far.",
    questions: [
      {
        id: "q1",
        prompt: "When did the writer start the new job?",
        options: ["Last Monday", "Last Friday", "Yesterday", "Next week"],
        correctAnswer: "Last Monday",
      },
      {
        id: "q2",
        prompt: "What did the manager do on the first day?",
        options: ["Gave a test", "Showed the writer around and explained the tasks", "Sent them home early", "Nothing"],
        correctAnswer: "Showed the writer around and explained the tasks",
      },
      {
        id: "q3",
        prompt: "How does the writer feel about the new job?",
        options: ["Bored", "Tired but enjoying the challenge", "Angry", "Confused and unhappy"],
        correctAnswer: "Tired but enjoying the challenge",
      },
    ],
  },
  {
    id: "learning-to-swim",
    title: "Learning to Swim",
    level: "A2",
    text: "When I was a child, I couldn't swim at all — I was actually quite afraid of water. My parents signed me up for swimming lessons when I was eight, and after a few months, I could swim a full length of the pool. Now I can swim for an hour without stopping, and I even joined a swimming club last year. It's strange to remember how scared I used to be of something I now really enjoy.",
    questions: [
      {
        id: "q1",
        prompt: "How did the writer feel about water as a young child?",
        options: ["Excited", "Afraid", "Bored", "Confident"],
        correctAnswer: "Afraid",
      },
      {
        id: "q2",
        prompt: "How old was the writer when they started swimming lessons?",
        options: ["Six", "Seven", "Eight", "Ten"],
        correctAnswer: "Eight",
      },
      {
        id: "q3",
        prompt: "What did the writer join last year?",
        options: ["A swimming club", "A running club", "A dance class", "A gym"],
        correctAnswer: "A swimming club",
      },
    ],
  },
  {
    id: "the-importance-of-sleep",
    title: "The Importance of Sleep",
    level: "B1",
    text: "Most adults are recommended to sleep between seven and nine hours a night, but many people get much less than that. Poor sleep has been linked to problems with memory, concentration and even long-term health. Simple habits, such as avoiding screens before bed and keeping a regular sleep schedule, are often suggested by doctors to improve sleep quality. It might seem tempting to stay up late finishing tasks, but a well-rested brain usually works far more efficiently the next day.",
    questions: [
      {
        id: "q1",
        prompt: "How many hours of sleep are adults recommended to get?",
        options: ["Four to six hours", "Seven to nine hours", "Ten to twelve hours", "Two to four hours"],
        correctAnswer: "Seven to nine hours",
      },
      {
        id: "q2",
        prompt: "What has poor sleep been linked to?",
        options: ["Better memory", "Problems with memory and concentration", "Faster reactions", "Nothing"],
        correctAnswer: "Problems with memory and concentration",
      },
      {
        id: "q3",
        prompt: "What habit is suggested to improve sleep quality?",
        options: ["Using screens before bed", "Avoiding screens before bed", "Sleeping less", "Skipping breakfast"],
        correctAnswer: "Avoiding screens before bed",
      },
    ],
  },
  // Fase 14 (auditoria 2026-08-27) — 1º lote de "inglês autêntico": 3 formatos
  // de texto que nunca existiam no currículo (só havia narrativa em 3ª
  // pessoa). Originais, não copiados de nenhuma fonte real — nunca reproduzir
  // letras de música reais ou notícias reais, questão de direitos de autor,
  // ver docs/decisions.md.
  {
    id: "email-to-a-colleague",
    title: "An Email to a Colleague",
    level: "B1",
    genre: "email",
    source: "original",
    text: "Subject: Meeting moved to Thursday\n\nHi Carlos,\n\nI hope you're doing well. I'm writing to let you know that our meeting on Wednesday has been moved to Thursday at 2pm, because the client asked for more time to review the proposal. Could you please confirm that this new time works for you? If not, let me know and we'll find another slot.\n\nAlso, could you send me the updated budget spreadsheet before the meeting? I'd like to go through the numbers beforehand so we don't waste time on Thursday.\n\nThanks in advance, and sorry for the short notice.\n\nBest regards,\nInês",
    questions: [
      {
        id: "q1",
        prompt: "Why was the meeting moved?",
        options: [
          "Carlos was on holiday",
          "The client asked for more time",
          "Inês was sick",
          "The office was closed",
        ],
        correctAnswer: "The client asked for more time",
      },
      {
        id: "q2",
        prompt: "What does Inês ask Carlos to send her?",
        options: ["A new proposal", "The updated budget spreadsheet", "His holiday dates", "A meeting invite"],
        correctAnswer: "The updated budget spreadsheet",
      },
      {
        id: "q3",
        prompt: "What time is the new meeting?",
        options: ["Wednesday at 2pm", "Thursday at 2pm", "Thursday morning", "It doesn't say"],
        correctAnswer: "Thursday at 2pm",
      },
    ],
  },
  {
    id: "planning-a-trip-dialogue",
    title: "Planning a Trip",
    level: "A2",
    genre: "dialogue",
    source: "original",
    text: "MARTA: So, have you decided where we're going for the long weekend?\nPEDRO: I was thinking maybe Porto? We haven't been there in ages.\nMARTA: That sounds good, but isn't it going to rain all weekend there?\nPEDRO: Actually, I checked — it's supposed to be sunny on Saturday, only a bit of rain on Sunday.\nMARTA: OK, that changes things. Should we book a hotel near the river?\nPEDRO: Yes, and I found one that isn't too expensive. Do you want me to book it tonight?\nMARTA: Go ahead. Let's leave early on Saturday so we have the whole day there.",
    questions: [
      {
        id: "q1",
        prompt: "Where are Marta and Pedro thinking of going?",
        options: ["Lisbon", "Porto", "The beach", "The mountains"],
        correctAnswer: "Porto",
      },
      {
        id: "q2",
        prompt: "What is the weather forecast for Saturday?",
        options: ["Rain all day", "Sunny", "Snow", "It doesn't say"],
        correctAnswer: "Sunny",
      },
      {
        id: "q3",
        prompt: "What does Marta ask Pedro to do?",
        options: ["Cancel the trip", "Book the hotel tonight", "Check the weather again", "Change the destination"],
        correctAnswer: "Book the hotel tonight",
      },
    ],
  },
  {
    id: "local-news-new-park",
    title: "New Park Opens Downtown",
    level: "A2",
    genre: "news",
    source: "original",
    text: "A new public park opened in the city centre last weekend, after almost two years of construction. The park has a large playground, a small lake, and space for outdoor sports. City officials say the project cost around 3 million euros and was built to give residents more green space in an area that previously had very few parks.\n\nLocal shop owners say the new park has already brought more visitors to the area, especially on weekends. \"We've seen many more families walking past the shop since the park opened,\" said one café owner nearby. The park will be open every day from 7am to 10pm, and entry is free.",
    questions: [
      {
        id: "q1",
        prompt: "How long did the park take to build?",
        options: ["Almost two years", "Six months", "Ten years", "It doesn't say"],
        correctAnswer: "Almost two years",
      },
      {
        id: "q2",
        prompt: "What did local shop owners notice?",
        options: [
          "Fewer customers",
          "More visitors to the area",
          "Higher prices",
          "The shops had to close",
        ],
        correctAnswer: "More visitors to the area",
      },
      {
        id: "q3",
        prompt: "Is there a fee to enter the park?",
        options: ["Yes, 3 euros", "No, it's free", "Only on weekends", "It doesn't say"],
        correctAnswer: "No, it's free",
      },
    ],
  },
  // Fase 14 (continuação, 2026-08-27) — 2º lote de formatos autênticos:
  // instructions (género que ainda faltava), mais um dialogue, email e news
  // originais, em níveis diferentes. Mesma regra: nada copiado de fonte real.
  {
    id: "recipe-instructions",
    title: "How to Make Simple Scrambled Eggs",
    level: "A1",
    genre: "instructions",
    source: "original",
    text: "First, crack three eggs into a bowl. Then, add a little salt and mix well with a fork. Next, heat a small pan with a little butter on medium heat. When the butter melts, pour in the eggs. Stir slowly with a spoon for about two minutes, until the eggs are soft but not liquid. Finally, take the pan off the heat and serve immediately with toast.",
    questions: [
      {
        id: "q1",
        prompt: "How many eggs does the recipe use?",
        options: ["Two", "Three", "Four", "It doesn't say"],
        correctAnswer: "Three",
      },
      {
        id: "q2",
        prompt: "What do you add to the pan before the eggs?",
        options: ["Oil", "A little butter", "Milk", "Cheese"],
        correctAnswer: "A little butter",
      },
      {
        id: "q3",
        prompt: "What should you do as soon as the eggs are ready?",
        options: ["Add more salt", "Serve immediately with toast", "Cook them for 10 more minutes", "Add milk"],
        correctAnswer: "Serve immediately with toast",
      },
    ],
  },
  {
    id: "job-interview-dialogue",
    title: "A Job Interview",
    level: "B1",
    genre: "dialogue",
    source: "original",
    text: "INTERVIEWER: So, tell me a little about your experience in customer service.\nCANDIDATE: Sure. I've worked in customer service for about three years now, mostly in retail. I handled complaints, returns, and general questions from customers every day.\nINTERVIEWER: What would you say is the most difficult part of that job?\nCANDIDATE: Probably staying calm when a customer is upset, even when the problem isn't really something I can control. I've learned to listen first, then explain what I can actually do to help.\nINTERVIEWER: That's a good approach. And why are you interested in this position specifically?\nCANDIDATE: I've heard great things about the team here, and I'd like to work somewhere with more opportunities to grow into a team leader role eventually.",
    questions: [
      {
        id: "q1",
        prompt: "How long has the candidate worked in customer service?",
        options: ["One year", "About three years", "Five years", "It doesn't say"],
        correctAnswer: "About three years",
      },
      {
        id: "q2",
        prompt: "What does the candidate say is the most difficult part of the job?",
        options: [
          "Working long hours",
          "Staying calm when a customer is upset",
          "Handling returns",
          "Working alone",
        ],
        correctAnswer: "Staying calm when a customer is upset",
      },
      {
        id: "q3",
        prompt: "What is the candidate hoping for in the future?",
        options: ["To work from home", "To grow into a team leader role", "To change industries", "To work fewer hours"],
        correctAnswer: "To grow into a team leader role",
      },
    ],
  },
  {
    id: "gym-membership-email",
    title: "Cancelling a Gym Membership",
    level: "A2",
    genre: "email",
    source: "original",
    text: "Subject: Cancelling my membership\n\nHi,\n\nI'd like to cancel my gym membership starting next month, please. I'm moving to a different city for work, so I won't be able to use the gym anymore.\n\nCould you confirm the last day I'll be charged? I remember reading that cancellations need at least 30 days' notice, so I wanted to write to you as early as possible.\n\nAlso, is there any way to pause the membership instead, in case I move back within a few months? I'd rather not lose my current rate if I don't have to.\n\nThank you for your help.\n\nKind regards,\nTiago",
    questions: [
      {
        id: "q1",
        prompt: "Why does Tiago want to cancel his membership?",
        options: ["He's unhappy with the gym", "He's moving to a different city", "It's too expensive", "He's injured"],
        correctAnswer: "He's moving to a different city",
      },
      {
        id: "q2",
        prompt: "What does Tiago ask about as an alternative to cancelling completely?",
        options: ["A refund", "Pausing the membership", "A cheaper plan", "Freezing his card"],
        correctAnswer: "Pausing the membership",
      },
      {
        id: "q3",
        prompt: "How much notice does Tiago think cancellations need?",
        options: ["7 days", "14 days", "At least 30 days", "It doesn't say"],
        correctAnswer: "At least 30 days",
      },
    ],
  },
  {
    id: "weather-warning-news",
    title: "Strong Winds Expected This Weekend",
    level: "B1",
    genre: "news",
    source: "original",
    text: "The national weather service has issued a warning for strong winds across the coastal region this weekend, with gusts expected to reach up to 90 km/h on Saturday afternoon. Residents in low-lying coastal areas are advised to secure loose objects outdoors and avoid unnecessary travel during the peak hours of the storm.\n\nSeveral outdoor events planned for Saturday have already been postponed, including a local market and an open-air concert. Officials say the winds should ease by Sunday morning, with calmer conditions expected for the rest of the week. Anyone experiencing storm damage is asked to contact the local council rather than emergency services, unless there is an immediate danger to life.",
    questions: [
      {
        id: "q1",
        prompt: "How strong are the expected wind gusts?",
        options: ["Up to 50 km/h", "Up to 90 km/h", "Up to 120 km/h", "It doesn't say"],
        correctAnswer: "Up to 90 km/h",
      },
      {
        id: "q2",
        prompt: "What happened to the local market and the open-air concert?",
        options: ["They were cancelled permanently", "They were postponed", "They were moved indoors", "Nothing changed"],
        correctAnswer: "They were postponed",
      },
      {
        id: "q3",
        prompt: "Who should people contact if they have storm damage but no danger to life?",
        options: ["Emergency services", "The local council", "The weather service", "Their neighbours"],
        correctAnswer: "The local council",
      },
    ],
  },
  // Fase 14 (continuação, 2026-08-27) — 3º lote de formatos autênticos.
  // Originais, nunca copiados de fonte real.
  {
    id: "flat-share-dialogue",
    title: "Looking for a Flatmate",
    level: "A2",
    genre: "dialogue",
    source: "original",
    text: "ANA: Hi, thanks for coming to see the room. So, it's a two-bedroom flat, and you'd be sharing the kitchen and living room with me.\nCARLOS: Great. How much is the rent, and does it include bills?\nANA: It's 450 euros a month, but bills are separate — usually around 60 euros between the two of us.\nCARLOS: That works for me. Is it okay if I have a cat? I should have mentioned that earlier.\nANA: Actually, yes, that's fine — I love cats. When would you be able to move in?\nCARLOS: I could move in next weekend, if that's not too soon.\nANA: That's perfect, actually. I was hoping to find someone before the end of the month.",
    questions: [
      {
        id: "q1",
        prompt: "Are bills included in the rent?",
        options: ["Yes, always", "No, they're separate", "Only electricity is included", "It doesn't say"],
        correctAnswer: "No, they're separate",
      },
      {
        id: "q2",
        prompt: "What does Carlos ask permission for?",
        options: ["Having a cat", "Painting the room", "Having guests", "Working from home"],
        correctAnswer: "Having a cat",
      },
      {
        id: "q3",
        prompt: "When could Carlos move in?",
        options: ["Tomorrow", "Next weekend", "Next month", "He can't move in"],
        correctAnswer: "Next weekend",
      },
    ],
  },
  {
    id: "library-instructions",
    title: "How to Borrow a Book from the Library",
    level: "A1",
    genre: "instructions",
    source: "original",
    text: "First, find the book you want using the computer or the shelves. Then, take the book to the front desk. Show the librarian your library card — if you don't have one, you can get one for free with proof of address. The librarian will scan the book and your card. You can borrow up to five books at a time, for three weeks. Finally, remember to return the books before the due date, or you may have to pay a small fine.",
    questions: [
      {
        id: "q1",
        prompt: "What do you need to get a library card?",
        options: ["Proof of address", "A passport", "Money", "A photo"],
        correctAnswer: "Proof of address",
      },
      {
        id: "q2",
        prompt: "How many books can you borrow at a time?",
        options: ["Two", "Three", "Five", "Ten"],
        correctAnswer: "Five",
      },
      {
        id: "q3",
        prompt: "What happens if you return a book late?",
        options: ["Nothing happens", "You may have to pay a fine", "You lose your card", "You can't borrow again"],
        correctAnswer: "You may have to pay a fine",
      },
    ],
  },
  {
    id: "office-relocation-email",
    title: "Office Moving to a New Building",
    level: "B1",
    genre: "email",
    source: "original",
    text: "Subject: Important — Office Relocation Next Month\n\nDear Team,\n\nAs some of you may already know, we will be moving to our new office on Elm Street starting the 15th of next month. The new building is closer to the train station, which should make the commute easier for most of us.\n\nA few things to keep in mind: please pack your personal belongings by the end of this week, as the moving company will collect boxes from all desks on Friday. IT will handle all computer equipment separately, so please don't unplug anything yourself.\n\nWe'll be closed for two working days during the actual move, and I'll send a reminder with the exact schedule closer to the date. Please let me know if you have any questions or concerns.\n\nBest,\nRicardo",
    questions: [
      {
        id: "q1",
        prompt: "Why might the new office make commuting easier?",
        options: [
          "It has free parking",
          "It's closer to the train station",
          "It's in the city centre",
          "It has a gym",
        ],
        correctAnswer: "It's closer to the train station",
      },
      {
        id: "q2",
        prompt: "Who will handle the computer equipment?",
        options: ["Each employee individually", "The moving company", "IT", "Ricardo"],
        correctAnswer: "IT",
      },
      {
        id: "q3",
        prompt: "By when should employees pack their personal belongings?",
        options: ["By the 15th of next month", "By the end of this week", "By Friday next month", "It doesn't say"],
        correctAnswer: "By the end of this week",
      },
    ],
  },
  // Fase 14 (continuação, 2026-08-27) — 4º lote. Inclui os primeiros textos
  // de nível B2, agora que esse nível existe no currículo (Fase 13, mesma
  // sessão). Originais, nunca copiados de fonte real.
  {
    id: "remote-work-debate-news",
    title: "Companies Rethink Remote Work Policies",
    level: "B2",
    genre: "news",
    source: "original",
    text: "Several major companies have announced changes to their remote work policies this year, requiring employees to return to the office for at least three days a week. Executives argue that in-person collaboration boosts innovation and helps younger employees learn from more experienced colleagues, something they say is harder to replicate over video calls.\n\nNot everyone agrees. Employee surveys conducted by independent researchers suggest that many workers value the flexibility of remote work more than almost any other benefit, and some have even said they would consider changing jobs rather than give it up entirely. A few companies have taken a middle path, letting individual teams decide what works best for them rather than imposing a single company-wide rule.\n\nWhat's clear is that neither side has definitive data proving their case, and the debate is likely to continue for years, shaped as much by the labour market as by any research.",
    questions: [
      {
        id: "q1",
        prompt: "Why do executives want employees back in the office?",
        options: [
          "To reduce office costs",
          "They believe it boosts innovation and helps junior staff learn",
          "Because remote work is against the law",
          "It doesn't say",
        ],
        correctAnswer: "They believe it boosts innovation and helps junior staff learn",
      },
      {
        id: "q2",
        prompt: "According to the surveys mentioned, what do many workers value most?",
        options: ["Higher salaries", "The flexibility of remote work", "Free lunches", "Shorter working hours"],
        correctAnswer: "The flexibility of remote work",
      },
      {
        id: "q3",
        prompt: "What approach have some companies taken instead of a single company-wide rule?",
        options: [
          "Banning remote work completely",
          "Letting individual teams decide",
          "Paying workers extra to come in",
          "Closing their offices"
        ],
        correctAnswer: "Letting individual teams decide",
      },
    ],
  },
  {
    id: "salary-negotiation-dialogue",
    title: "Negotiating a Pay Rise",
    level: "B2",
    genre: "dialogue",
    source: "original",
    text: "EMPLOYEE: Thanks for meeting with me. I wanted to talk about my salary, given everything I've taken on this year.\nMANAGER: Of course. Walk me through it — what would you say has changed since your last review?\nEMPLOYEE: I've been leading the onboarding process for new hires, on top of my usual responsibilities, and I've also mentored two junior colleagues.\nMANAGER: That's fair, and I have noticed the extra effort. I can't promise anything today, but I'll bring this to the next budget meeting and get back to you within two weeks.\nEMPLOYEE: That works for me. Is there anything else you'd need from me to make the case?\nMANAGER: If you could put together a short summary of your achievements this year, that would definitely help me argue for it.",
    questions: [
      {
        id: "q1",
        prompt: "What extra responsibilities does the employee mention?",
        options: [
          "Managing the budget",
          "Leading onboarding and mentoring colleagues",
          "Hiring new staff",
          "Travelling for work",
        ],
        correctAnswer: "Leading onboarding and mentoring colleagues",
      },
      {
        id: "q2",
        prompt: "When will the manager get back to the employee?",
        options: ["Immediately", "Within two weeks", "Next year", "Never"],
        correctAnswer: "Within two weeks",
      },
      {
        id: "q3",
        prompt: "What does the manager ask the employee to prepare?",
        options: [
          "A resignation letter",
          "A summary of their achievements",
          "A new job application",
          "A list of complaints",
        ],
        correctAnswer: "A summary of their achievements",
      },
    ],
  },
  {
    id: "returning-a-parcel-email",
    title: "Returning a Damaged Parcel",
    level: "A2",
    genre: "email",
    source: "original",
    text: "Subject: Damaged item — Order #48213\n\nHello,\n\nI received my order yesterday, but unfortunately the item arrived damaged — there's a large crack on one side. I've attached two photos showing the damage.\n\nCould you please let me know how to proceed? I would prefer a replacement rather than a refund, if that's possible. I can send the damaged item back once I receive a return label.\n\nThank you for your help, and I look forward to hearing from you soon.\n\nBest regards,\nBeatriz",
    questions: [
      {
        id: "q1",
        prompt: "What is wrong with the item Beatriz received?",
        options: ["It's the wrong colour", "It arrived damaged, with a crack", "It never arrived", "It's the wrong size"],
        correctAnswer: "It arrived damaged, with a crack",
      },
      {
        id: "q2",
        prompt: "What does Beatriz prefer: a refund or a replacement?",
        options: ["A refund", "A replacement", "Neither, just an apology", "Both"],
        correctAnswer: "A replacement",
      },
      {
        id: "q3",
        prompt: "What does Beatriz need before she can send the item back?",
        options: ["A new address", "A return label", "A phone call", "Nothing"],
        correctAnswer: "A return label",
      },
    ],
  },
  // Fase 14 (continuação, 2026-08-27) — 5º lote. Originais, nunca copiados
  // de fonte real.
  {
    id: "power-cut-instructions",
    title: "What to Do During a Power Cut",
    level: "A2",
    genre: "instructions",
    source: "original",
    text: "First, stay calm — most power cuts last only a few minutes. Check whether the problem is only in your home or in the whole street; if your neighbours also have no power, it's likely a wider cut, not a problem with your own wiring. Turn off and unplug sensitive electronics, such as computers, to protect them from a sudden surge when power returns. If you have a torch or candles, use them instead of matches near anything flammable. Finally, wait at least thirty minutes before calling the electricity company, since most cuts are fixed automatically within that time.",
    questions: [
      {
        id: "q1",
        prompt: "How can you tell if it's a wider power cut, not just your home?",
        options: [
          "Call the electricity company immediately",
          "Check if your neighbours also have no power",
          "Check your own wiring",
          "Wait for a text message",
        ],
        correctAnswer: "Check if your neighbours also have no power",
      },
      {
        id: "q2",
        prompt: "Why should you unplug electronics like computers?",
        options: [
          "To save battery",
          "To protect them from a power surge when it returns",
          "Because they cause the power cut",
          "It doesn't say",
        ],
        correctAnswer: "To protect them from a power surge when it returns",
      },
      {
        id: "q3",
        prompt: "How long should you wait before calling the electricity company?",
        options: ["5 minutes", "At least 30 minutes", "24 hours", "You should call immediately"],
        correctAnswer: "At least 30 minutes",
      },
    ],
  },
  {
    id: "neighbour-noise-dialogue",
    title: "Talking to a Neighbour About Noise",
    level: "B1",
    genre: "dialogue",
    source: "original",
    text: "SOFIA: Hi, sorry to bother you — I wanted to have a quick word about the noise late at night.\nPEDRO: Oh, I'm really sorry about that. Has it been a problem?\nSOFIA: A little, yes. My daughter has school in the mornings, and the music sometimes goes on until after midnight.\nPEDRO: I had no idea it was that loud through the walls. I'll definitely turn it down after 10pm from now on.\nSOFIA: I really appreciate that. I didn't want to make a big deal out of it, but it's been a rough couple of weeks.\nPEDRO: No, you did the right thing telling me directly. Let me know if it happens again.",
    questions: [
      {
        id: "q1",
        prompt: "Why does the noise bother Sofia specifically?",
        options: [
          "She works night shifts",
          "Her daughter has school in the mornings",
          "She has a headache",
          "She doesn't like music",
        ],
        correctAnswer: "Her daughter has school in the mornings",
      },
      {
        id: "q2",
        prompt: "What does Pedro agree to do?",
        options: [
          "Move to another flat",
          "Turn the music down after 10pm",
          "Stop playing music completely",
          "Talk to the building manager",
        ],
        correctAnswer: "Turn the music down after 10pm",
      },
      {
        id: "q3",
        prompt: "How does Pedro react to Sofia raising the issue?",
        options: ["He gets angry", "He says she did the right thing", "He ignores her", "He denies the problem"],
        correctAnswer: "He says she did the right thing",
      },
    ],
  },
  {
    id: "conference-registration-email",
    title: "Confirming Conference Registration",
    level: "B2",
    genre: "email",
    source: "original",
    text: "Subject: Registration Confirmed — Annual Marketing Summit\n\nDear Ms. Ferreira,\n\nThank you for registering for this year's Annual Marketing Summit. This email confirms your place at the conference, taking place from the 14th to the 16th of next month at the Riverside Convention Centre.\n\nYour registration includes access to all keynote sessions, two workshops of your choice (to be selected closer to the date), and the networking dinner on the second evening. Please note that workshop places are limited and allocated on a first-come, first-served basis, so we recommend submitting your preferences as soon as the workshop schedule is published.\n\nShould your plans change, cancellations made more than two weeks in advance are eligible for a full refund; after that point, only partial refunds can be offered, in line with our terms and conditions.\n\nWe look forward to welcoming you.\n\nKind regards,\nThe Summit Team",
    questions: [
      {
        id: "q1",
        prompt: "What is included in the registration, besides the keynote sessions?",
        options: [
          "Only one workshop",
          "Two workshops and the networking dinner",
          "A hotel stay",
          "Travel expenses",
        ],
        correctAnswer: "Two workshops and the networking dinner",
      },
      {
        id: "q2",
        prompt: "How are workshop places allocated?",
        options: ["Randomly", "First-come, first-served", "By seniority", "By payment amount"],
        correctAnswer: "First-come, first-served",
      },
      {
        id: "q3",
        prompt: "What happens if Ms. Ferreira cancels less than two weeks before the event?",
        options: [
          "She gets a full refund",
          "She can only get a partial refund",
          "She gets no refund at all, always",
          "It doesn't say",
        ],
        correctAnswer: "She can only get a partial refund",
      },
    ],
  },
  // Fase 14 (continuação, 2026-08-27) — 6º lote. Originais, nunca copiados
  // de fonte real.
  {
    id: "ai-in-the-workplace-news",
    title: "How AI Tools Are Changing Everyday Office Work",
    level: "B2",
    genre: "news",
    source: "original",
    text: "A growing number of office workers now use AI tools daily for tasks such as drafting emails, summarising long documents, and preparing first drafts of reports, according to a recent survey of workers across several industries. Most respondents said the tools saved them time on repetitive writing tasks, freeing them up to focus on more complex parts of their jobs.\n\nHowever, the survey also found notable concerns. Around a third of respondents worried about becoming too dependent on these tools, and several mentioned occasionally catching factual errors that the AI had confidently presented as correct. Companies are responding differently: some have introduced clear guidelines on when AI-generated content must be reviewed by a human before being sent externally, while others have left the decision entirely up to individual employees.\n\nAnalysts suggest that, regardless of company policy, the ability to check and edit AI output critically is quickly becoming as important a skill as writing itself.",
    questions: [
      {
        id: "q1",
        prompt: "What did most survey respondents say about AI tools?",
        options: [
          "They made mistakes too often to be useful",
          "They saved time on repetitive writing tasks",
          "They were banned at their workplace",
          "It doesn't say",
        ],
        correctAnswer: "They saved time on repetitive writing tasks",
      },
      {
        id: "q2",
        prompt: "What concern did about a third of respondents mention?",
        options: [
          "Losing their jobs",
          "Becoming too dependent on the tools",
          "The tools being too expensive",
          "Not having enough training",
        ],
        correctAnswer: "Becoming too dependent on the tools",
      },
      {
        id: "q3",
        prompt: "What skill do analysts say is becoming increasingly important?",
        options: [
          "Typing speed",
          "Checking and editing AI output critically",
          "Avoiding AI tools completely",
          "Learning to code"
        ],
        correctAnswer: "Checking and editing AI output critically",
      },
    ],
  },
  {
    id: "borrowing-money-dialogue",
    title: "Asking a Friend for a Small Loan",
    level: "B1",
    genre: "dialogue",
    source: "original",
    text: "MIGUEL: Hey, this is a bit awkward to ask, but could you lend me fifty euros until Friday? My card's not working and I still need to pay for groceries this week.\nJOANA: Sure, that's not a problem. Do you want me to transfer it now?\nMIGUEL: That would be great, thank you so much. I'll pay you back as soon as my salary comes in.\nJOANA: Honestly, don't worry about the exact day — just whenever works for you.\nMIGUEL: I really appreciate it. I promise I wouldn't ask if it wasn't a bit of an emergency.\nJOANA: I know, it's fine. That's what friends are for.",
    questions: [
      {
        id: "q1",
        prompt: "Why does Miguel need to borrow money?",
        options: ["His card isn't working and he needs groceries", "He lost his wallet", "He wants to buy a gift", "He needs to pay rent"],
        correctAnswer: "His card isn't working and he needs groceries",
      },
      {
        id: "q2",
        prompt: "When does Miguel say he will pay Joana back?",
        options: ["Tomorrow", "When his salary comes in", "Never", "Next year"],
        correctAnswer: "When his salary comes in",
      },
      {
        id: "q3",
        prompt: "How does Joana react to the request?",
        options: ["She refuses", "She agrees without any problem", "She asks for more details first", "She gets upset"],
        correctAnswer: "She agrees without any problem",
      },
    ],
  },
  {
    id: "changing-doctor-email",
    title: "Requesting to Change Family Doctor",
    level: "A2",
    genre: "email",
    source: "original",
    text: "Subject: Request to change doctor\n\nHello,\n\nI would like to request a change of family doctor, if possible. I've been a patient at this clinic for three years, but I recently moved to a different part of the city, and my current doctor's office is now quite far from my new home.\n\nCould you let me know which doctors are currently accepting new patients closer to my new address? I've included my new postcode below for reference.\n\nThank you very much for your help.\n\nKind regards,\nCatarina",
    questions: [
      {
        id: "q1",
        prompt: "Why does Catarina want to change doctor?",
        options: [
          "She's unhappy with her current doctor",
          "She moved to a different part of the city",
          "Her doctor retired",
          "It doesn't say",
        ],
        correctAnswer: "She moved to a different part of the city",
      },
      {
        id: "q2",
        prompt: "How long has Catarina been a patient at this clinic?",
        options: ["One year", "Three years", "Five years", "It doesn't say"],
        correctAnswer: "Three years",
      },
      {
        id: "q3",
        prompt: "What does Catarina ask the clinic to tell her?",
        options: [
          "Her test results",
          "Which doctors are accepting new patients near her new address",
          "Her appointment history",
          "The clinic's opening hours",
        ],
        correctAnswer: "Which doctors are accepting new patients near her new address",
      },
    ],
  },
];

export function getReadingPassage(id: string): ReadingPassage | undefined {
  return READING_PASSAGES.find((p) => p.id === id);
}

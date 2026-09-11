// Original content, retained as data. Add entries here; existing IDs derive from type and Chinese text.
const RADICALS = [
  // Nature
  {char:"水",variant:"氵",meaning:"water",pinyin:"shuǐ",cat:"Nature",hint:"Three drops on the left side of characters",examples:[{char:"河",pinyin:"hé",meaning:"river"},{char:"海",pinyin:"hǎi",meaning:"sea"},{char:"洗",pinyin:"xǐ",meaning:"to wash"}]},
  {char:"火",variant:"灬",meaning:"fire",pinyin:"huǒ",cat:"Nature",hint:"Four dots at the bottom in many characters",examples:[{char:"灯",pinyin:"dēng",meaning:"lamp"},{char:"烧",pinyin:"shāo",meaning:"to burn"},{char:"热",pinyin:"rè",meaning:"hot"}]},
  {char:"木",variant:null,meaning:"wood / tree",pinyin:"mù",cat:"Nature",hint:"A tree with branches and roots",examples:[{char:"林",pinyin:"lín",meaning:"forest (two trees)"},{char:"树",pinyin:"shù",meaning:"tree"},{char:"桥",pinyin:"qiáo",meaning:"bridge"}]},
  {char:"土",variant:null,meaning:"earth / soil",pinyin:"tǔ",cat:"Nature",hint:"Ground with something growing from it",examples:[{char:"地",pinyin:"dì",meaning:"ground"},{char:"城",pinyin:"chéng",meaning:"city"},{char:"场",pinyin:"chǎng",meaning:"field"}]},
  {char:"金",variant:"钅",meaning:"metal / gold",pinyin:"jīn",cat:"Nature",hint:"Appears on the left as 钅 in simplified",examples:[{char:"银",pinyin:"yín",meaning:"silver"},{char:"铁",pinyin:"tiě",meaning:"iron"},{char:"钱",pinyin:"qián",meaning:"money"}]},
  {char:"山",variant:null,meaning:"mountain",pinyin:"shān",cat:"Nature",hint:"Three peaks — the middle one tallest",examples:[{char:"岛",pinyin:"dǎo",meaning:"island"},{char:"岸",pinyin:"àn",meaning:"shore"},{char:"崩",pinyin:"bēng",meaning:"collapse"}]},
  {char:"日",variant:null,meaning:"sun / day",pinyin:"rì",cat:"Nature",hint:"A sun with a line through the middle",examples:[{char:"明",pinyin:"míng",meaning:"bright"},{char:"时",pinyin:"shí",meaning:"time"},{char:"早",pinyin:"zǎo",meaning:"early"}]},
  {char:"月",variant:null,meaning:"moon / month",pinyin:"yuè",cat:"Nature",hint:"A crescent moon shape",examples:[{char:"明",pinyin:"míng",meaning:"bright"},{char:"朋",pinyin:"péng",meaning:"friend"},{char:"期",pinyin:"qī",meaning:"period"}]},
  {char:"石",variant:null,meaning:"stone / rock",pinyin:"shí",cat:"Nature",hint:"A cliff with a pebble beneath it",examples:[{char:"破",pinyin:"pò",meaning:"broken"},{char:"研",pinyin:"yán",meaning:"to research"},{char:"砖",pinyin:"zhuān",meaning:"brick"}]},
  {char:"雨",variant:null,meaning:"rain",pinyin:"yǔ",cat:"Nature",hint:"Drops falling from a cloud under the sky",examples:[{char:"雪",pinyin:"xuě",meaning:"snow"},{char:"雷",pinyin:"léi",meaning:"thunder"},{char:"雾",pinyin:"wù",meaning:"fog"}]},
  {char:"艹",variant:null,meaning:"grass / plant",pinyin:"cǎo",cat:"Nature",hint:"Two sprouts — sits on top of characters",examples:[{char:"花",pinyin:"huā",meaning:"flower"},{char:"草",pinyin:"cǎo",meaning:"grass"},{char:"药",pinyin:"yào",meaning:"medicine"}]},

  // People
  {char:"人",variant:"亻",meaning:"person",pinyin:"rén",cat:"People",hint:"A walking figure — becomes 亻 on the left",examples:[{char:"你",pinyin:"nǐ",meaning:"you"},{char:"他",pinyin:"tā",meaning:"he"},{char:"休",pinyin:"xiū",meaning:"to rest"}]},
  {char:"女",variant:null,meaning:"woman",pinyin:"nǚ",cat:"People",hint:"A kneeling figure — an ancient pictograph",examples:[{char:"妈",pinyin:"mā",meaning:"mother"},{char:"好",pinyin:"hǎo",meaning:"good"},{char:"姐",pinyin:"jiě",meaning:"sister"}]},
  {char:"子",variant:null,meaning:"child / son",pinyin:"zǐ",cat:"People",hint:"A swaddled baby",examples:[{char:"好",pinyin:"hǎo",meaning:"good"},{char:"学",pinyin:"xué",meaning:"to study"},{char:"字",pinyin:"zì",meaning:"character"}]},
  {char:"口",variant:null,meaning:"mouth",pinyin:"kǒu",cat:"People",hint:"An open mouth — a simple square",examples:[{char:"吃",pinyin:"chī",meaning:"to eat"},{char:"喝",pinyin:"hē",meaning:"to drink"},{char:"叫",pinyin:"jiào",meaning:"to shout"}]},
  {char:"手",variant:"扌",meaning:"hand",pinyin:"shǒu",cat:"People",hint:"Becomes 扌 on the left — fingers reaching",examples:[{char:"打",pinyin:"dǎ",meaning:"to hit"},{char:"拿",pinyin:"ná",meaning:"to take"},{char:"把",pinyin:"bǎ",meaning:"to hold"}]},
  {char:"心",variant:"忄",meaning:"heart / mind",pinyin:"xīn",cat:"People",hint:"Becomes 忄 on the left — feelings live here",examples:[{char:"想",pinyin:"xiǎng",meaning:"to think"},{char:"快",pinyin:"kuài",meaning:"happy / fast"},{char:"情",pinyin:"qíng",meaning:"emotion"}]},
  {char:"目",variant:null,meaning:"eye",pinyin:"mù",cat:"People",hint:"An eye turned sideways",examples:[{char:"看",pinyin:"kàn",meaning:"to look"},{char:"眼",pinyin:"yǎn",meaning:"eye"},{char:"睡",pinyin:"shuì",meaning:"to sleep"}]},
  {char:"耳",variant:null,meaning:"ear",pinyin:"ěr",cat:"People",hint:"The shape of an ear",examples:[{char:"听",pinyin:"tīng",meaning:"to listen"},{char:"闻",pinyin:"wén",meaning:"to hear"},{char:"聪",pinyin:"cōng",meaning:"clever"}]},
  {char:"足",variant:"⻊",meaning:"foot",pinyin:"zú",cat:"People",hint:"A foot — about walking and movement",examples:[{char:"跑",pinyin:"pǎo",meaning:"to run"},{char:"跳",pinyin:"tiào",meaning:"to jump"},{char:"路",pinyin:"lù",meaning:"road"}]},
  {char:"力",variant:null,meaning:"strength",pinyin:"lì",cat:"People",hint:"A flexed arm showing muscle",examples:[{char:"动",pinyin:"dòng",meaning:"to move"},{char:"办",pinyin:"bàn",meaning:"to handle"},{char:"男",pinyin:"nán",meaning:"man"}]},

  // Animals
  {char:"马",variant:null,meaning:"horse",pinyin:"mǎ",cat:"Animals",hint:"Simplified from a galloping horse pictograph",examples:[{char:"妈",pinyin:"mā",meaning:"mother"},{char:"骑",pinyin:"qí",meaning:"to ride"},{char:"驾",pinyin:"jià",meaning:"to drive"}]},
  {char:"鱼",variant:null,meaning:"fish",pinyin:"yú",cat:"Animals",hint:"A fish with head, body, and tail",examples:[{char:"鲜",pinyin:"xiān",meaning:"fresh"},{char:"鲸",pinyin:"jīng",meaning:"whale"},{char:"渔",pinyin:"yú",meaning:"fishing"}]},
  {char:"鸟",variant:null,meaning:"bird",pinyin:"niǎo",cat:"Animals",hint:"A bird with beak and tail feathers",examples:[{char:"鸡",pinyin:"jī",meaning:"chicken"},{char:"鸭",pinyin:"yā",meaning:"duck"},{char:"鸣",pinyin:"míng",meaning:"to chirp"}]},
  {char:"虫",variant:null,meaning:"insect / bug",pinyin:"chóng",cat:"Animals",hint:"A creepy-crawly — covers all small creatures",examples:[{char:"蛇",pinyin:"shé",meaning:"snake"},{char:"蚊",pinyin:"wén",meaning:"mosquito"},{char:"蝴",pinyin:"hú",meaning:"butterfly"}]},
  {char:"犬",variant:"犭",meaning:"dog / animal",pinyin:"quǎn",cat:"Animals",hint:"Becomes 犭 on the left — used for mammals",examples:[{char:"猫",pinyin:"māo",meaning:"cat"},{char:"狗",pinyin:"gǒu",meaning:"dog"},{char:"狼",pinyin:"láng",meaning:"wolf"}]},
  {char:"牛",variant:null,meaning:"cow / ox",pinyin:"niú",cat:"Animals",hint:"Horns on top of a head",examples:[{char:"牧",pinyin:"mù",meaning:"to herd"},{char:"物",pinyin:"wù",meaning:"thing"},{char:"特",pinyin:"tè",meaning:"special"}]},

  // Objects
  {char:"刀",variant:"刂",meaning:"knife / blade",pinyin:"dāo",cat:"Objects",hint:"Becomes 刂 on the right side",examples:[{char:"切",pinyin:"qiē",meaning:"to cut"},{char:"分",pinyin:"fēn",meaning:"to divide"},{char:"刻",pinyin:"kè",meaning:"to carve"}]},
  {char:"门",variant:null,meaning:"door / gate",pinyin:"mén",cat:"Objects",hint:"A doorframe — characters inside it are enclosed",examples:[{char:"问",pinyin:"wèn",meaning:"to ask"},{char:"间",pinyin:"jiān",meaning:"room"},{char:"闻",pinyin:"wén",meaning:"to hear"}]},
  {char:"车",variant:null,meaning:"vehicle",pinyin:"chē",cat:"Objects",hint:"Simplified from a chariot seen from above",examples:[{char:"轮",pinyin:"lún",meaning:"wheel"},{char:"转",pinyin:"zhuǎn",meaning:"to turn"},{char:"辆",pinyin:"liàng",meaning:"(vehicle counter)"}]},
  {char:"衣",variant:"衤",meaning:"clothing",pinyin:"yī",cat:"Objects",hint:"Becomes 衤 on the left — fabrics and garments",examples:[{char:"裤",pinyin:"kù",meaning:"pants"},{char:"被",pinyin:"bèi",meaning:"quilt"},{char:"衬",pinyin:"chèn",meaning:"shirt"}]},
  {char:"食",variant:"饣",meaning:"food / eat",pinyin:"shí",cat:"Objects",hint:"Becomes 饣 on the left — meals and eating",examples:[{char:"饭",pinyin:"fàn",meaning:"rice / meal"},{char:"饿",pinyin:"è",meaning:"hungry"},{char:"饮",pinyin:"yǐn",meaning:"to drink"}]},
  {char:"宀",variant:null,meaning:"roof / house",pinyin:"mián",cat:"Objects",hint:"A roof — tops many indoor characters",examples:[{char:"家",pinyin:"jiā",meaning:"home"},{char:"安",pinyin:"ān",meaning:"peace"},{char:"字",pinyin:"zì",meaning:"character"}]},
  {char:"贝",variant:null,meaning:"shell / money",pinyin:"bèi",cat:"Objects",hint:"Cowrie shells were ancient currency",examples:[{char:"财",pinyin:"cái",meaning:"wealth"},{char:"货",pinyin:"huò",meaning:"goods"},{char:"贵",pinyin:"guì",meaning:"expensive"}]},

  // Land & Work
  {char:"田",variant:null,meaning:"field",pinyin:"tián",cat:"Land",hint:"Farmland divided into sections",examples:[{char:"男",pinyin:"nán",meaning:"man"},{char:"界",pinyin:"jiè",meaning:"boundary"},{char:"思",pinyin:"sī",meaning:"to think"}]},
  {char:"禾",variant:null,meaning:"grain / crop",pinyin:"hé",cat:"Land",hint:"A grain plant bending with a heavy ear",examples:[{char:"种",pinyin:"zhǒng",meaning:"to plant"},{char:"秋",pinyin:"qiū",meaning:"autumn"},{char:"和",pinyin:"hé",meaning:"harmony"}]},
  {char:"竹",variant:"⺮",meaning:"bamboo",pinyin:"zhú",cat:"Land",hint:"Two bamboo leaves on top",examples:[{char:"笔",pinyin:"bǐ",meaning:"pen"},{char:"笑",pinyin:"xiào",meaning:"to laugh"},{char:"筷",pinyin:"kuài",meaning:"chopsticks"}]},
  {char:"纟",variant:null,meaning:"silk / thread",pinyin:"sī",cat:"Land",hint:"Twisted threads — textiles and connections",examples:[{char:"红",pinyin:"hóng",meaning:"red"},{char:"给",pinyin:"gěi",meaning:"to give"},{char:"绿",pinyin:"lǜ",meaning:"green"}]},
  {char:"王",variant:null,meaning:"king / jade",pinyin:"wáng",cat:"Land",hint:"Three levels connected by the king",examples:[{char:"玩",pinyin:"wán",meaning:"to play"},{char:"现",pinyin:"xiàn",meaning:"now"},{char:"球",pinyin:"qiú",meaning:"ball"}]},
  {char:"工",variant:null,meaning:"work / craft",pinyin:"gōng",cat:"Land",hint:"A carpenter's square",examples:[{char:"功",pinyin:"gōng",meaning:"achievement"},{char:"江",pinyin:"jiāng",meaning:"river"},{char:"红",pinyin:"hóng",meaning:"red"}]},

  // Ideas
  {char:"言",variant:"讠",meaning:"speech / words",pinyin:"yán",cat:"Ideas",hint:"Becomes 讠 on the left — about language",examples:[{char:"说",pinyin:"shuō",meaning:"to speak"},{char:"话",pinyin:"huà",meaning:"words"},{char:"读",pinyin:"dú",meaning:"to read"}]},
  {char:"大",variant:null,meaning:"big / great",pinyin:"dà",cat:"Ideas",hint:"A person stretching arms wide",examples:[{char:"天",pinyin:"tiān",meaning:"sky"},{char:"太",pinyin:"tài",meaning:"too much"},{char:"夫",pinyin:"fū",meaning:"husband"}]},
  {char:"小",variant:null,meaning:"small",pinyin:"xiǎo",cat:"Ideas",hint:"Something divided into tiny pieces",examples:[{char:"少",pinyin:"shǎo",meaning:"few"},{char:"尖",pinyin:"jiān",meaning:"sharp"},{char:"尘",pinyin:"chén",meaning:"dust"}]},
  {char:"走",variant:null,meaning:"to walk / go",pinyin:"zǒu",cat:"Ideas",hint:"A running figure",examples:[{char:"起",pinyin:"qǐ",meaning:"to rise"},{char:"超",pinyin:"chāo",meaning:"to exceed"},{char:"越",pinyin:"yuè",meaning:"to cross"}]},
  {char:"又",variant:null,meaning:"again / hand",pinyin:"yòu",cat:"Ideas",hint:"A right hand — one of the simplest radicals",examples:[{char:"双",pinyin:"shuāng",meaning:"pair"},{char:"对",pinyin:"duì",meaning:"correct"},{char:"友",pinyin:"yǒu",meaning:"friend"}]},
];

const CATEGORIES = ["All","Nature","People","Animals","Objects","Land","Ideas"];

const COMBOS = [
  // Logic pairs
  {result:{char:"好",pinyin:"hǎo",meaning:"good"},
   parts:[{char:"女",pinyin:"nǚ",meaning:"woman"},{char:"子",pinyin:"zǐ",meaning:"child"}],
   story:"A woman with her child — the picture of something good.",cat:"Logic"},

  {result:{char:"明",pinyin:"míng",meaning:"bright"},
   parts:[{char:"日",pinyin:"rì",meaning:"sun"},{char:"月",pinyin:"yuè",meaning:"moon"}],
   story:"Sun and moon together — the brightest things in the sky.",cat:"Logic"},

  {result:{char:"休",pinyin:"xiū",meaning:"to rest"},
   parts:[{char:"亻",pinyin:"rén",meaning:"person"},{char:"木",pinyin:"mù",meaning:"tree"}],
   story:"A person leaning against a tree — taking a rest.",cat:"Logic"},

  {result:{char:"男",pinyin:"nán",meaning:"man"},
   parts:[{char:"田",pinyin:"tián",meaning:"field"},{char:"力",pinyin:"lì",meaning:"strength"}],
   story:"Strength applied in the field — the traditional role of a man.",cat:"Logic"},

  {result:{char:"安",pinyin:"ān",meaning:"peace"},
   parts:[{char:"宀",pinyin:"mián",meaning:"roof"},{char:"女",pinyin:"nǚ",meaning:"woman"}],
   story:"A woman safe under a roof — peace and security.",cat:"Logic"},

  {result:{char:"字",pinyin:"zì",meaning:"character / letter"},
   parts:[{char:"宀",pinyin:"mián",meaning:"roof"},{char:"子",pinyin:"zǐ",meaning:"child"}],
   story:"A child learning under a roof — that's where you learn your characters.",cat:"Logic"},

  {result:{char:"尘",pinyin:"chén",meaning:"dust"},
   parts:[{char:"小",pinyin:"xiǎo",meaning:"small"},{char:"土",pinyin:"tǔ",meaning:"earth"}],
   story:"Small particles of earth — dust.",cat:"Logic"},

  {result:{char:"尖",pinyin:"jiān",meaning:"sharp / pointed"},
   parts:[{char:"小",pinyin:"xiǎo",meaning:"small"},{char:"大",pinyin:"dà",meaning:"big"}],
   story:"Small on top of big — narrowing to a sharp point.",cat:"Logic"},

  {result:{char:"看",pinyin:"kàn",meaning:"to look"},
   parts:[{char:"手",pinyin:"shǒu",meaning:"hand"},{char:"目",pinyin:"mù",meaning:"eye"}],
   story:"A hand shading the eyes — peering into the distance.",cat:"Logic"},

  {result:{char:"问",pinyin:"wèn",meaning:"to ask"},
   parts:[{char:"门",pinyin:"mén",meaning:"door"},{char:"口",pinyin:"kǒu",meaning:"mouth"}],
   story:"A mouth at the door — knocking and asking a question.",cat:"Logic"},

  {result:{char:"闻",pinyin:"wén",meaning:"to hear / smell"},
   parts:[{char:"门",pinyin:"mén",meaning:"door"},{char:"耳",pinyin:"ěr",meaning:"ear"}],
   story:"An ear pressed to the door — listening in.",cat:"Logic"},

  {result:{char:"秋",pinyin:"qiū",meaning:"autumn"},
   parts:[{char:"禾",pinyin:"hé",meaning:"grain"},{char:"火",pinyin:"huǒ",meaning:"fire"}],
   story:"Burning the grain stubble after harvest — the season of autumn.",cat:"Logic"},

  // Repetition patterns
  {result:{char:"林",pinyin:"lín",meaning:"forest / grove"},
   parts:[{char:"木",pinyin:"mù",meaning:"tree"},{char:"木",pinyin:"mù",meaning:"tree"}],
   story:"Two trees side by side — a grove or forest.",cat:"Patterns"},

  {result:{char:"森",pinyin:"sēn",meaning:"dense forest"},
   parts:[{char:"木",pinyin:"mù",meaning:"tree"},{char:"木",pinyin:"mù",meaning:"tree"},{char:"木",pinyin:"mù",meaning:"tree"}],
   story:"Three trees — an even denser forest. More is more.",cat:"Patterns"},

  {result:{char:"从",pinyin:"cóng",meaning:"to follow"},
   parts:[{char:"人",pinyin:"rén",meaning:"person"},{char:"人",pinyin:"rén",meaning:"person"}],
   story:"One person behind another — following along.",cat:"Patterns"},

  {result:{char:"众",pinyin:"zhòng",meaning:"crowd / many"},
   parts:[{char:"人",pinyin:"rén",meaning:"person"},{char:"人",pinyin:"rén",meaning:"person"},{char:"人",pinyin:"rén",meaning:"person"}],
   story:"Three people — that's a crowd.",cat:"Patterns"},

  {result:{char:"朋",pinyin:"péng",meaning:"friend"},
   parts:[{char:"月",pinyin:"yuè",meaning:"moon"},{char:"月",pinyin:"yuè",meaning:"moon"}],
   story:"Two moons — companions traveling together, like friends.",cat:"Patterns"},

  {result:{char:"双",pinyin:"shuāng",meaning:"pair / double"},
   parts:[{char:"又",pinyin:"yòu",meaning:"hand"},{char:"又",pinyin:"yòu",meaning:"hand"}],
   story:"Two hands — a pair.",cat:"Patterns"},

  // Sound component
  {result:{char:"妈",pinyin:"mā",meaning:"mother"},
   parts:[{char:"女",pinyin:"nǚ",meaning:"woman"},{char:"马",pinyin:"mǎ",meaning:"horse"}],
   story:"Woman (meaning) + horse (sound: mǎ → mā). The horse tells you the pronunciation!",cat:"Sound"},

  {result:{char:"吗",pinyin:"ma",meaning:"question particle"},
   parts:[{char:"口",pinyin:"kǒu",meaning:"mouth"},{char:"马",pinyin:"mǎ",meaning:"horse"}],
   story:"Mouth (it's spoken) + horse (sound: mǎ → ma). Same sound trick — different meaning component.",cat:"Sound"},
];

const COMBO_CATS = ["All","Logic","Patterns","Sound"];

// Lesson 3: phonetic families. One sound component generates a whole family;
// the meaning component (a radical) changes what each character means.
const FAMILIES = [
  {
    sound:{char:"青",pinyin:"qīng",meaning:"blue-green"},
    note:"The cleanest family in Chinese. Every member sounds like qīng or jīng — only the tone and the meaning component change.",
    members:[
      {char:"清",pinyin:"qīng",meaning:"clear",radical:{char:"氵",meaning:"water"}},
      {char:"请",pinyin:"qǐng",meaning:"please / to invite",radical:{char:"讠",meaning:"speech"}},
      {char:"情",pinyin:"qíng",meaning:"feeling",radical:{char:"忄",meaning:"heart"}},
      {char:"晴",pinyin:"qíng",meaning:"sunny",radical:{char:"日",meaning:"sun"}},
      {char:"睛",pinyin:"jīng",meaning:"eyeball",radical:{char:"目",meaning:"eye"}},
    ]
  },
  {
    sound:{char:"包",pinyin:"bāo",meaning:"to wrap"},
    note:"Every member sounds like bāo or pāo. Spot 包 inside a character and you can guess the sound before you know the meaning.",
    members:[
      {char:"抱",pinyin:"bào",meaning:"to hug",radical:{char:"扌",meaning:"hand"}},
      {char:"泡",pinyin:"pào",meaning:"bubble",radical:{char:"氵",meaning:"water"}},
      {char:"跑",pinyin:"pǎo",meaning:"to run",radical:{char:"足",meaning:"foot"}},
      {char:"饱",pinyin:"bǎo",meaning:"full (from food)",radical:{char:"饣",meaning:"food"}},
      {char:"炮",pinyin:"pào",meaning:"cannon",radical:{char:"火",meaning:"fire"}},
    ]
  },
  {
    sound:{char:"方",pinyin:"fāng",meaning:"square / direction"},
    note:"All read fāng or fáng. The meaning component tells you which fang you're dealing with.",
    members:[
      {char:"房",pinyin:"fáng",meaning:"room / house",radical:{char:"户",meaning:"door"}},
      {char:"放",pinyin:"fàng",meaning:"to release",radical:{char:"攵",meaning:"action"}},
      {char:"访",pinyin:"fǎng",meaning:"to visit",radical:{char:"讠",meaning:"speech"}},
      {char:"防",pinyin:"fáng",meaning:"to defend",radical:{char:"阝",meaning:"mound / place"}},
      {char:"芳",pinyin:"fāng",meaning:"fragrant",radical:{char:"艹",meaning:"grass"}},
    ]
  },
  {
    sound:{char:"马",pinyin:"mǎ",meaning:"horse"},
    note:"You met this one already with 妈. The horse is a pure sound tag here — it means nothing about mothers or codes.",
    members:[
      {char:"妈",pinyin:"mā",meaning:"mother",radical:{char:"女",meaning:"woman"}},
      {char:"吗",pinyin:"ma",meaning:"question particle",radical:{char:"口",meaning:"mouth"}},
      {char:"码",pinyin:"mǎ",meaning:"code / number",radical:{char:"石",meaning:"stone"}},
      {char:"骂",pinyin:"mà",meaning:"to scold",radical:{char:"口口",meaning:"mouths"}},
    ]
  },
  {
    sound:{char:"主",pinyin:"zhǔ",meaning:"master / main"},
    note:"Every member reads zhù. A rock-solid family where the sound barely drifted at all.",
    members:[
      {char:"住",pinyin:"zhù",meaning:"to live / reside",radical:{char:"亻",meaning:"person"}},
      {char:"注",pinyin:"zhù",meaning:"to pour / focus",radical:{char:"氵",meaning:"water"}},
      {char:"柱",pinyin:"zhù",meaning:"pillar",radical:{char:"木",meaning:"wood"}},
      {char:"驻",pinyin:"zhù",meaning:"to be stationed",radical:{char:"马",meaning:"horse"}},
    ]
  },
];

// Lesson 4: characters combine into words (词) the way radicals combine into
// characters. Each hub character spawns a cluster of transparent compounds.
const WORDS = [
  {
    hub:{char:"电",pinyin:"diàn",meaning:"electric"},
    note:"Chinese builds most modern vocabulary by gluing characters together. 电 (electric) is a factory for tech words.",
    words:[
      {word:"电话",pinyin:"diànhuà",meaning:"telephone",parts:[{c:"电",m:"electric"},{c:"话",m:"speech"}]},
      {word:"电脑",pinyin:"diànnǎo",meaning:"computer",parts:[{c:"电",m:"electric"},{c:"脑",m:"brain"}]},
      {word:"电影",pinyin:"diànyǐng",meaning:"movie",parts:[{c:"电",m:"electric"},{c:"影",m:"shadow"}]},
      {word:"电视",pinyin:"diànshì",meaning:"television",parts:[{c:"电",m:"electric"},{c:"视",m:"vision"}]},
    ]
  },
  {
    hub:{char:"火",pinyin:"huǒ",meaning:"fire"},
    note:"The fire radical you met in Lesson 1 is also a full word — and it builds vivid compounds.",
    words:[
      {word:"火车",pinyin:"huǒchē",meaning:"train",parts:[{c:"火",m:"fire"},{c:"车",m:"vehicle"}]},
      {word:"火山",pinyin:"huǒshān",meaning:"volcano",parts:[{c:"火",m:"fire"},{c:"山",m:"mountain"}]},
      {word:"火锅",pinyin:"huǒguō",meaning:"hotpot",parts:[{c:"火",m:"fire"},{c:"锅",m:"pot"}]},
    ]
  },
  {
    hub:{char:"学",pinyin:"xué",meaning:"to study"},
    note:"Notice the hub can sit in front (学生) or behind (大学). Position doesn't matter — the meaning still stacks.",
    words:[
      {word:"学生",pinyin:"xuéshēng",meaning:"student",parts:[{c:"学",m:"study"},{c:"生",m:"born / person"}]},
      {word:"学校",pinyin:"xuéxiào",meaning:"school",parts:[{c:"学",m:"study"},{c:"校",m:"school grounds"}]},
      {word:"大学",pinyin:"dàxué",meaning:"university",parts:[{c:"大",m:"big"},{c:"学",m:"study"}]},
      {word:"同学",pinyin:"tóngxué",meaning:"classmate",parts:[{c:"同",m:"same"},{c:"学",m:"study"}]},
    ]
  },
  {
    hub:{char:"水",pinyin:"shuǐ",meaning:"water"},
    note:"Another Lesson 1 radical doing double duty as a word-builder.",
    words:[
      {word:"水果",pinyin:"shuǐguǒ",meaning:"fruit",parts:[{c:"水",m:"water"},{c:"果",m:"fruit"}]},
      {word:"开水",pinyin:"kāishuǐ",meaning:"boiled water",parts:[{c:"开",m:"to boil / open"},{c:"水",m:"water"}]},
      {word:"口水",pinyin:"kǒushuǐ",meaning:"saliva",parts:[{c:"口",m:"mouth"},{c:"水",m:"water"}]},
    ]
  },
  {
    hub:{char:"天",pinyin:"tiān",meaning:"sky / day"},
    note:"Time and weather words cluster around 天. Doubling it (天天) means 'every day' — a common trick.",
    words:[
      {word:"今天",pinyin:"jīntiān",meaning:"today",parts:[{c:"今",m:"now"},{c:"天",m:"day"}]},
      {word:"明天",pinyin:"míngtiān",meaning:"tomorrow",parts:[{c:"明",m:"next / bright"},{c:"天",m:"day"}]},
      {word:"天气",pinyin:"tiānqì",meaning:"weather",parts:[{c:"天",m:"sky"},{c:"气",m:"air"}]},
      {word:"天天",pinyin:"tiāntiān",meaning:"every day",parts:[{c:"天",m:"day"},{c:"天",m:"day"}]},
    ]
  },
  {
    hub:{char:"车",pinyin:"chē",meaning:"vehicle"},
    note:"Whatever powers it goes in front: steam, fire, electricity.",
    words:[
      {word:"汽车",pinyin:"qìchē",meaning:"car",parts:[{c:"汽",m:"steam / gas"},{c:"车",m:"vehicle"}]},
      {word:"火车",pinyin:"huǒchē",meaning:"train",parts:[{c:"火",m:"fire"},{c:"车",m:"vehicle"}]},
      {word:"车站",pinyin:"chēzhàn",meaning:"station",parts:[{c:"车",m:"vehicle"},{c:"站",m:"to stand / stop"}]},
    ]
  },
];

// Lesson 5: simple sentences. Each teaches one syntax point and reuses
// characters from earlier lessons. quiz distractors differ by exactly one
// grammatical element, so the learner has to parse rather than guess.
const SENTENCES = [
  {
    zh:"我是学生。", pinyin:"wǒ shì xuéshēng", en:"I am a student.",
    words:[{c:"我",p:"wǒ",m:"I"},{c:"是",p:"shì",m:"am"},{c:"学生",p:"xuéshēng",m:"student"}],
    point:"Word order is Subject–Verb–Object, exactly like English. And 是 (to be) never changes form: 我是, 你是, 他是 all use the same 是 — Chinese verbs don't conjugate.",
    correct:"I am a student.", distractors:["You are a student.","I am a teacher.","Am I a student?"]
  },
  {
    zh:"我不是老师。", pinyin:"wǒ bú shì lǎoshī", en:"I am not a teacher.",
    words:[{c:"我",p:"wǒ",m:"I"},{c:"不",p:"bù",m:"not"},{c:"是",p:"shì",m:"am"},{c:"老师",p:"lǎoshī",m:"teacher"}],
    point:"Put 不 (not) before the verb to negate it. Small tone note: 不 is normally bù, but shifts to bú before a fourth-tone syllable like shì.",
    correct:"I am not a teacher.", distractors:["I am a teacher.","You are not a teacher.","I am not a student."]
  },
  {
    zh:"你好吗？", pinyin:"nǐ hǎo ma", en:"How are you?",
    words:[{c:"你",p:"nǐ",m:"you"},{c:"好",p:"hǎo",m:"good"},{c:"吗",p:"ma",m:"(question)"}],
    point:"Add 吗 to the end of a plain statement to make it a yes/no question. 你好 ('you good') becomes 你好吗？('are you good?'). You met 吗 in Lesson 3 — mouth + horse-sound.",
    correct:"How are you?", distractors:["You are good.","How is he?","Am I good?"]
  },
  {
    zh:"我爱你。", pinyin:"wǒ ài nǐ", en:"I love you.",
    words:[{c:"我",p:"wǒ",m:"I"},{c:"爱",p:"ài",m:"love"},{c:"你",p:"nǐ",m:"you"}],
    point:"No 'a', no 'the', no conjugation — three characters and you're done. The subject and object are just swapped around the verb, same as English.",
    correct:"I love you.", distractors:["You love me.","I love him.","Do you love me?"]
  },
  {
    zh:"他喝茶，我喝水。", pinyin:"tā hē chá, wǒ hē shuǐ", en:"He drinks tea, I drink water.",
    words:[{c:"他",p:"tā",m:"he"},{c:"喝",p:"hē",m:"drinks"},{c:"茶",p:"chá",m:"tea"},{c:"我",p:"wǒ",m:"I"},{c:"喝",p:"hē",m:"drink"},{c:"水",p:"shuǐ",m:"water"}],
    point:"Two Subject–Verb–Object clauses side by side. 喝 (drink) and 水 (water) come straight from the mouth and water radicals in Lesson 1.",
    correct:"He drinks tea, I drink water.", distractors:["I drink tea, he drinks water.","He drinks water, I drink tea.","He and I drink tea."]
  },
  {
    zh:"这是我的书。", pinyin:"zhè shì wǒ de shū", en:"This is my book.",
    words:[{c:"这",p:"zhè",m:"this"},{c:"是",p:"shì",m:"is"},{c:"我",p:"wǒ",m:"I"},{c:"的",p:"de",m:"'s"},{c:"书",p:"shū",m:"book"}],
    point:"的 is the possessive glue: it turns 我 (I) into 我的 (my). Same for 你的 (your), 他的 (his). Think of it as the apostrophe-s of Chinese.",
    correct:"This is my book.", distractors:["This is your book.","This is my pen.","Is this my book?"]
  },
  {
    zh:"我们都是朋友。", pinyin:"wǒmen dōu shì péngyou", en:"We are all friends.",
    words:[{c:"我们",p:"wǒmen",m:"we"},{c:"都",p:"dōu",m:"all"},{c:"是",p:"shì",m:"are"},{c:"朋友",p:"péngyou",m:"friends"}],
    point:"们 makes people plural: 我 (I) → 我们 (we), 你 → 你们, 他 → 他们. 都 means 'all/both'. And 朋友 is the two-moons friend character from Lesson 2.",
    correct:"We are all friends.", distractors:["We are friends.","They are all friends.","You are all friends."]
  },
];

// ══════════════════════════════════════
//  STATE
// ══════════════════════════════════════

const items = new Map();
function addItem(type, zh, pinyin, en, tag = '', variant = '', prerequisites = []) {
  const id = type + ':' + zh;
  if (!items.has(id)) items.set(id, {id, type, zh, pinyin, en, tag, variant, prerequisites:[]});
  const item = items.get(id);
  item.prerequisites = [...new Set([...item.prerequisites, ...prerequisites])];
  return item;
}
RADICALS.forEach(r => addItem('radical', r.char, r.pinyin, r.meaning, r.cat, r.variant || ''));
const radicalId = char => {
  const radical = RADICALS.find(r => r.char === char || r.variant === char);
  return radical ? 'radical:' + radical.char : null;
};
COMBOS.forEach(c => addItem(
  'character', c.result.char, c.result.pinyin, c.result.meaning, '', '',
  c.parts.map(p => radicalId(p.char)).filter(Boolean)
));
FAMILIES.forEach(f => {
  addItem('character', f.sound.char, f.sound.pinyin, f.sound.meaning);
  f.members.forEach(m => addItem(
    'character', m.char, m.pinyin, m.meaning, '', '',
    [radicalId(m.radical.char)].filter(Boolean)
  ));
});
RADICALS.forEach(r => r.examples.forEach(e => addItem(
  'character', e.char, e.pinyin, e.meaning, '', '', ['radical:' + r.char]
)));
WORDS.forEach(g => {
  addItem('character', g.hub.char, g.hub.pinyin, g.hub.meaning);
  g.words.forEach(w => addItem(
    'word', w.word, w.pinyin, w.meaning, '', '',
    [...w.word].map(char => 'character:' + char).filter(id => items.has(id))
  ));
});
SENTENCES.forEach(s => addItem(
  'sentence', s.zh, s.pinyin, s.en, '', '',
  [...new Set(s.words.flatMap(word => {
    const wordId = 'word:' + word.c;
    if (items.has(wordId)) return [wordId];
    return [...word.c].map(char => 'character:' + char).filter(id => items.has(id));
  }))]
));
window.CONTENT = [...items.values()];

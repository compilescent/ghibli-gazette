import { type Category } from "./types"

/**
 * Curated Official Anime & Manga Key Visual Database
 * Real, high-resolution studio key visuals / posters from MyAnimeList CDN,
 * AniList banners, and Wikimedia Commons.
 *
 * Matching is score-based: keywords appearing in the article TITLE weigh more
 * than excerpt matches, and longer (more specific) keywords break ties.
 */
export interface FranchiseImageRule {
  keywords: string[]
  imageUrl: string
  franchise: string
  /** Extra weight bonus when this franchise is detected (used for disambiguation) */
  weight?: number
}

export const OFFICIAL_ANIME_DATABASE: FranchiseImageRule[] = [
  // ═══════════ STUDIO GHIBLI ═══════════
  {
    keywords: ["boy and the heron", "heron", "kimitachi", "mahito", "grief"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/10/121260.jpg",
    franchise: "The Boy and the Heron"
  },
  {
    keywords: ["my neighbor totoro", "totoro", "satsuki", "mei", "catbus"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/4/75913.jpg",
    franchise: "My Neighbor Totoro"
  },
  {
    keywords: ["spirited away", "sen to chihiro", "chihiro", "haku", "no-face", "yubaba", "bathhouse"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/6/79597.jpg",
    franchise: "Spirited Away"
  },
  {
    keywords: ["princess mononoke", "mononoke", "ashitaka", "iron town", "forest spirit"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/2/14914.jpg",
    franchise: "Princess Mononoke"
  },
  {
    keywords: ["howl", "howl's moving castle", "moving castle", "sophie", "calcifer"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/6/3009.jpg",
    franchise: "Howl's Moving Castle"
  },
  {
    keywords: ["kiki", "kiki's delivery service", "jiji", "delivery service"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/1/27929.jpg",
    franchise: "Kiki's Delivery Service"
  },
  {
    keywords: ["ponyo", "sosuke", "fujimoto"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/5/26151.jpg",
    franchise: "Ponyo"
  },
  {
    keywords: ["castle in the sky", "laputa", "pazu", "sheeta"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/10/37767.jpg",
    franchise: "Castle in the Sky"
  },
  {
    keywords: ["nausicaa", "nausicaä", "valley of the wind"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/3/12898.jpg",
    franchise: "Nausicaä of the Valley of the Wind"
  },
  {
    keywords: ["porco rosso", "porco"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/9/86984.jpg",
    franchise: "Porco Rosso"
  },
  {
    keywords: ["grave of the fireflies", "hotaru no haka", "setsuko", "seita"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/4/47735.jpg",
    franchise: "Grave of the Fireflies"
  },
  {
    keywords: ["the wind rises", "jirou", "wind rises"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/3/54561.jpg",
    franchise: "The Wind Rises"
  },
  {
    keywords: ["arrietty", "borrowers"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/4/38547.jpg",
    franchise: "Arrietty"
  },
  {
    keywords: ["when marnie was there", "marnie"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/10/73651.jpg",
    franchise: "When Marnie Was There"
  },
  {
    keywords: ["whisper of the heart", "seiji", "shizuku"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/7/49189.jpg",
    franchise: "Whisper of the Heart"
  },
  {
    keywords: ["only yesterday", "taeko"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/7/40121.jpg",
    franchise: "Only Yesterday"
  },
  {
    keywords: ["from up on poppy hill", "poppy hill", "kokuriko"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/3/31723.jpg",
    franchise: "From Up on Poppy Hill"
  },
  {
    keywords: ["earwig and the witch"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/1377/111157.jpg",
    franchise: "Earwig and the Witch"
  },
  {
    keywords: ["ghibli park", "ghibli museum", "aichi", "mitaka", "toshio suzuki", "goro miyazaki", "hayao miyazaki", "miyazaki"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/3/12898.jpg",
    franchise: "Studio Ghibli",
    weight: 1
  },

  // ═══════════ BIG SHONEN / SHONEN JUMP ═══════════
  {
    keywords: ["demon slayer", "kimetsu", "infinity castle", "tanjiro", "nezuko", "mugen train", "hashira", "ufotable"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg",
    franchise: "Demon Slayer"
  },
  {
    keywords: ["one piece", "luffy", "zoro", "egghead", "the one piece", "eiichiro oda", "gear 5", "straw hat", "wano"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/6/73245.jpg",
    franchise: "One Piece"
  },
  {
    keywords: ["jujutsu kaisen", "jjk", "gojo", "sukuna", "itadori", "megumi", "shibuya incident", "culling game", "gege akutami", "mahoraga", "special grade"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg",
    franchise: "Jujutsu Kaisen"
  },
  {
    keywords: ["naruto", "boruto", "uzumaki", "sasuke", "kakashi", "shippuden"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/13/17405.jpg",
    franchise: "Naruto"
  },
  {
    keywords: ["dragon ball", "dragonball", "goku", "vegeta", "daima", "akira toriyama", "super saiyan", "toei"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/1254/135863.jpg",
    franchise: "Dragon Ball"
  },
  {
    keywords: ["bleach", "thousand-year blood war", "ichigo", "tybw", "aizen", "tite kubo", "soul society"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/1908/135431.jpg",
    franchise: "Bleach"
  },
  {
    keywords: ["hunter x hunter", "hunterxhunter", "gon", "killua", "netero", "chimera ant", "togashi"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/1337/99013.jpg",
    franchise: "Hunter x Hunter"
  },
  {
    keywords: ["fullmetal alchemist", "brotherhood", "edward elric", "alchemy", "homunculus"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/1223/96541.jpg",
    franchise: "Fullmetal Alchemist: Brotherhood"
  },
  {
    keywords: ["attack on titan", "shingeki", "eren", "levi", "mikasa", "armored titan", "colossal"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/10/47347.jpg",
    franchise: "Attack on Titan"
  },
  {
    keywords: ["my hero academia", "hero academia", "mha", "deku", "all might", "uravity", "katsuki", "izuku", "quirks"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/10/78745.jpg",
    franchise: "My Hero Academia"
  },
  {
    keywords: ["black clover", "asta", "yuno", "clover kingdom"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/9/90035.jpg",
    franchise: "Black Clover"
  },
  {
    keywords: ["one punch man", "onepunch", "saitama", "genos", "garou"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/12/76049.jpg",
    franchise: "One Punch Man"
  },
  {
    keywords: ["jojo", "jojo's bizarre adventure", "joestar", "dio", "stand"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/3/40409.jpg",
    franchise: "JoJo's Bizarre Adventure"
  },
  {
    keywords: ["fairy tail", "natsu", "lucy", "erza", "gray"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/4/64735.jpg",
    franchise: "Fairy Tail"
  },

  // ═══════════ MAJOR 2023-2026 HITS ═══════════
  {
    keywords: ["frieren", "beyond journey's end", "fern", "stark", "himmel", "madhouse", "aussicht"],
    imageUrl: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/154587-ivXNJ23SM1xB.jpg",
    franchise: "Frieren: Beyond Journey's End"
  },
  {
    keywords: ["chainsaw man", "denji", "reze", "makima", "power", "fujimoto", "reze arc", "csm", "chainsaw"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/1806/126216.jpg",
    franchise: "Chainsaw Man"
  },
  {
    keywords: ["solo leveling", "sung jinwoo", "arise", "shadow monarch", "chugong", "hunter", "gate"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/1598/128450.jpg",
    franchise: "Solo Leveling"
  },
  {
    keywords: ["dandadan", "dan da dan", "momo", "okarun", "turbo granny", "science saru", "yukinobu tatsu"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/1727/137229.jpg",
    franchise: "DanDaDan"
  },
  {
    keywords: ["oshi no ko", "aqua", "ruby", "idol", "kana", "ako", "ai hoshino"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/1670/133402.jpg",
    franchise: "Oshi no Ko"
  },
  {
    keywords: ["spy x family", "spy family", "anya", "loid", "yor", "forger", "franky"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/1441/122795.jpg",
    franchise: "SPY x FAMILY"
  },
  {
    keywords: ["apothecary diaries", "apothecary", "kusuriya", "maomao", "jinshi"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/1708/138033.jpg",
    franchise: "The Apothecary Diaries"
  },
  {
    keywords: ["delicious in dungeon", "dungeon meshi", "laios", "marcille", "senshi", "chilchuck", "monster chef"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/1404/134331.jpg",
    franchise: "Delicious in Dungeon"
  },
  {
    keywords: ["kaiju no 8", "kaiju", "hoshina", "kafka", "defense force"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/1310/134193.jpg",
    franchise: "Kaiju No. 8"
  },
  {
    keywords: ["wind breaker", "wind breaker"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/1092/137087.jpg",
    franchise: "Wind Breaker"
  },
  {
    keywords: ["jellyfish can't swim", "jellyfish"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/1054/138478.jpg",
    franchise: "Jellyfish Can't Swim in the Night"
  },
  {
    keywords: ["blue lock", "bluelock", "yoichi", "isagi", "egoist"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/1675/133770.jpg",
    franchise: "Blue Lock"
  },
  {
    keywords: ["cyberpunk", "edgerunners", "david martinez", "lucy"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/1818/126435.jpg",
    franchise: "Cyberpunk: Edgerunners"
  },
  {
    keywords: ["mob psycho", "mob psycho 100", "reigen", "mogami", "esper"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/8/80356.jpg",
    franchise: "Mob Psycho 100"
  },
  {
    keywords: ["ranking of kings", "bosaje", "bojji", "kage", "prince", "oujou no osama"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/1346/119505.jpg",
    franchise: "Ranking of Kings"
  },
  {
    keywords: ["bocchi the rock", "bocchi", "kessoku band", "guitar heroine"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/1448/127956.jpg",
    franchise: "Bocchi the Rock!"
  },
  {
    keywords: ["lycoris recoil", "chisato", "takina", "lycoris"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/1439/123274.jpg",
    franchise: "Lycoris Recoil"
  },
  {
    keywords: ["komi can't communicate", "komi", "tadano", "hitohito"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/1464/111943.jpg",
    franchise: "Komi Can't Communicate"
  },
  {
    keywords: ["horimiya", "hori", "miyamura", "izumi"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/1517/125628.jpg",
    franchise: "Horimiya"
  },
  {
    keywords: ["kaguya", "kaguya-sama", "love is war", "shinomiya", "shirogane", "chika", "hayasaka"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/1295/106551.jpg",
    franchise: "Kaguya-sama: Love Is War"
  },
  {
    keywords: ["your lie in april", "kousei", "kaori", "shigatsu"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/3/67177.jpg",
    franchise: "Your Lie in April"
  },
  {
    keywords: ["violet evergarden", "violet", "gilbert", "automatic memory"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/1795/95088.jpg",
    franchise: "Violet Evergarden"
  },
  {
    keywords: ["frieren", "sousou no frieren"],
    imageUrl: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/154587-ivXNJ23SM1xB.jpg",
    franchise: "Frieren: Beyond Journey's End"
  },

  // ═══════════ CLASSIC & CULT FAVORITES ═══════════
  {
    keywords: ["death note", "light yagami", "l lawliet", "kira", "ryuk", "note"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/9/9453.jpg",
    franchise: "Death Note"
  },
  {
    keywords: ["cowboy bebop", "spike spiegel", "jet black", "faye", "bebop", "swordfish"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/4/19644.jpg",
    franchise: "Cowboy Bebop"
  },
  {
    keywords: ["evangelion", "eva", "shinji", "rei", "asuka", "nerv", "hideaki anno"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/1314/108941.jpg",
    franchise: "Neon Genesis Evangelion"
  },
  {
    keywords: ["steins gate", "steins;gate", "okabe", "kurisu", "mad scientist", "worldline"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/5/73199.jpg",
    franchise: "Steins;Gate"
  },
  {
    keywords: ["code geass", "lelouch", "c.c", "geass", "suzaku", "zero"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/5/50331.jpg",
    franchise: "Code Geass"
  },
  {
    keywords: ["ghost in the shell", "motoko", "kusanagi", "section 9", "masamune"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/10/26902.jpg",
    franchise: "Ghost in the Shell"
  },
  {
    keywords: ["akira", "kaneda", "tetsuo", "neo tokyo", "otomo"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/6/46855.jpg",
    franchise: "Akira"
  },
  {
    keywords: ["gintama", "gintoki", "shinpachi", "kagura", "odyssey"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/3/72078.jpg",
    franchise: "Gintama"
  },
  {
    keywords: ["berserk", "guts", "griffith", "casca", "kentaro miura", "brand of sacrifice"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/1/36617.jpg",
    franchise: "Berserk"
  },
  {
    keywords: ["no game no life", "sora", "shiro", "blank", "disboard"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/5/65157.jpg",
    franchise: "No Game No Life"
  },
  {
    keywords: ["re zero", "rezero", "re:zero", "subaru", "emilia", "rem", "ram", "witch"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/11/79410.jpg",
    franchise: "Re:Zero"
  },
  {
    keywords: ["konosuba", "kazuma", "aqua", "megumin", "darkness", "explosion"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/8/18866.jpg",
    franchise: "KonoSuba"
  },
  {
    keywords: ["mushoku tensei", "rudeus", "eris", "roxy", "sylphiette", "jobless reincarnation"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/1530/135042.jpg",
    franchise: "Mushoku Tensei"
  },
  {
    keywords: ["made in abyss", "riko", "reg", "nanachi", "abyss", "netherworld"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/1111/107132.jpg",
    franchise: "Made in Abyss"
  },
  {
    keywords: ["sword art online", "sao", "kirito", "asuna", "kirigaya"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/11/39717.jpg",
    franchise: "Sword Art Online"
  },
  {
    keywords: ["tokyo ghoul", "kaneki", "ghoul", "cage", "flesh"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/1/17183.jpg",
    franchise: "Tokyo Ghoul"
  },
  {
    keywords: ["vinland saga", "thorfinn", "thorkell", "askeladd", "vinland"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/1500/103005.jpg",
    franchise: "Vinland Saga"
  },
  {
    keywords: ["fire force", "shinra", "tamaki", "company 8", "enner"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/11/89430.jpg",
    franchise: "Fire Force"
  },
  {
    keywords: ["dr stone", "senku", "science", "stone", "petrification"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/1613/102576.jpg",
    franchise: "Dr. Stone"
  },
  {
    keywords: ["that time i got reincarnated as a slime", "slime", "rimuru", "tempest", "tensei"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/5/87325.jpg",
    franchise: "That Time I Got Reincarnated as a Slime"
  },
  {
    keywords: ["shield hero", "naofumi", "raphtalia", "rising of the shield"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/1490/101365.jpg",
    franchise: "The Rising of the Shield Hero"
  },
  {
    keywords: ["haikyuu", "haikyu", "hinata", "kageyama", "karasuno", "volleyball"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/7/76014.jpg",
    franchise: "Haikyu!!"
  },
  {
    keywords: ["kuroko", "kuroko's basketball", "kagami", "generation of miracles"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/2/78257.jpg",
    franchise: "Kuroko's Basketball"
  },
  {
    keywords: ["ace of diamond", "daiya no ace", "sawamura", "eijun"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/11/75274.jpg",
    franchise: "Ace of Diamond"
  },
  {
    keywords: ["super cub", "reiko", "motorcycle"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/1950/110753.jpg",
    franchise: "Super Cub"
  },

  // ═══════════ MAKOTO SHINKAI & FILM PHENOMENA ═══════════
  {
    keywords: ["your name", "kimi no na wa", "taki", "mitsuha", "mitsuha miyamizu", "red string"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/5/87048.jpg",
    franchise: "Your Name"
  },
  {
    keywords: ["weathering with you", "hodaka", "hina", "tenki no ko"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/1414/108315.jpg",
    franchise: "Weathering with You"
  },
  {
    keywords: ["suzume", "suzume no tojimari", "souta", "daijin", "makoto shinkai"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/1414/121273.jpg",
    franchise: "Suzume"
  },
  {
    keywords: ["5 centimeters per second", "five centimeters", "takaki", "akari"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/6/35952.jpg",
    franchise: "5 Centimeters per Second"
  },
  {
    keywords: ["garden of words", "takao", "yukino", "rain"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/5/58625.jpg",
    franchise: "The Garden of Words"
  },
  {
    keywords: ["makoto shinkai", "shinkai"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/1414/121273.jpg",
    franchise: "Makoto Shinkai",
    weight: 1
  },
  {
    keywords: ["a silent voice", "koe no katachi", "shoya", "shoko", "nishimiya", "deaf"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/1122/96435.jpg",
    franchise: "A Silent Voice"
  },
  {
    keywords: ["wolf children", "hana", "ookami kodomo"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/13/29466.jpg",
    franchise: "Wolf Children"
  },
  {
    keywords: ["summer wars", "kenji", "oz", "natsuki"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/11/27547.jpg",
    franchise: "Summer Wars"
  },
  {
    keywords: ["the girl who leapt through time", "girl who leapt", "makoto konno", "toki wo kakeru"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/1/20517.jpg",
    franchise: "The Girl Who Leapt Through Time"
  },
  {
    keywords: ["paprika", "satoshi kon", "dream machine", "paprika"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/7/18679.jpg",
    franchise: "Paprika"
  },
  {
    keywords: ["perfect blue", "mima", "mima kirigoe", "satoshi kon"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/4/18471.jpg",
    franchise: "Perfect Blue"
  },
  {
    keywords: ["belle", "ryu", "suzu", "inside out", "world"],
    imageUrl: "https://cdn.myanimelist.net/images/anime/1011/118143.jpg",
    franchise: "Belle"
  },

  // ═══════════ MANGA / PRINT FOCUS ═══════════
  {
    keywords: ["jujutsu kaisen manga", "jjk manga"],
    imageUrl: "https://cdn.myanimelist.net/images/manga/3/219190.jpg",
    franchise: "Jujutsu Kaisen (manga)"
  },
  {
    keywords: ["one piece manga", "one piece chapter"],
    imageUrl: "https://cdn.myanimelist.net/images/manga/2/253146.jpg",
    franchise: "One Piece (manga)"
  },
  {
    keywords: ["chainsaw man manga", "chainsaw man chapter", "csm manga"],
    imageUrl: "https://cdn.myanimelist.net/images/manga/3/216953.jpg",
    franchise: "Chainsaw Man (manga)"
  },
  {
    keywords: ["attack on titan manga", "shingeki manga"],
    imageUrl: "https://cdn.myanimelist.net/images/manga/2/153239.jpg",
    franchise: "Attack on Titan (manga)"
  },
  {
    keywords: ["demon slayer manga", "kimetsu manga"],
    imageUrl: "https://cdn.myanimelist.net/images/manga/1/179023.jpg",
    franchise: "Demon Slayer (manga)"
  },
  {
    keywords: ["berserk manga", "miura manga"],
    imageUrl: "https://cdn.myanimelist.net/images/manga/2/209189.jpg",
    franchise: "Berserk (manga)"
  },
  {
    keywords: ["frieren manga"],
    imageUrl: "https://cdn.myanimelist.net/images/manga/3/237486.jpg",
    franchise: "Frieren (manga)"
  }
]

/**
 * Distinct, High-Quality Thematic Visual Pool for Anti-Duplication Rotation
 * Only used when no franchise can be identified from the article content.
 */
export const THEMATIC_IMAGE_POOL: string[] = [
  "https://cdn.myanimelist.net/images/anime/1286/99889.jpg",
  "https://cdn.myanimelist.net/images/anime/1171/109222.jpg",
  "https://cdn.myanimelist.net/images/anime/1806/126216.jpg",
  "https://s4.anilist.co/file/anilistcdn/media/anime/banner/154587-ivXNJ23SM1xB.jpg",
  "https://cdn.myanimelist.net/images/anime/1598/128450.jpg",
  "https://cdn.myanimelist.net/images/anime/10/47347.jpg",
  "https://cdn.myanimelist.net/images/anime/1337/99013.jpg",
  "https://cdn.myanimelist.net/images/anime/1441/122795.jpg",
  "https://cdn.myanimelist.net/images/anime/1414/121273.jpg",
  "https://cdn.myanimelist.net/images/anime/5/87048.jpg",
  "https://cdn.myanimelist.net/images/anime/6/79597.jpg",
  "https://cdn.myanimelist.net/images/anime/4/75913.jpg",
  "https://cdn.myanimelist.net/images/anime/1223/96541.jpg",
  "https://cdn.myanimelist.net/images/anime/4/19644.jpg"
]

/**
 * Validates whether an image URL is a real image (not an ad, tracking pixel, or broken logo)
 */
export function isValidArticleImageUrl(url?: string | null): boolean {
  if (!url || typeof url !== "string") return false
  const trimmed = url.trim().toLowerCase()

  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) return false

  // Reject ad servers, 1x1 tracking pixels, icons, and avatars
  if (
    trimmed.includes("feedburner") ||
    trimmed.includes("doubleclick") ||
    trimmed.includes("pixel") ||
    trimmed.includes("gravatar") ||
    trimmed.includes("1x1") ||
    trimmed.includes("share_button") ||
    trimmed.includes("icon_") ||
    trimmed.includes("logo_mini") ||
    trimmed.includes("badge_")
  ) {
    return false
  }

  // Verified anime media CDNs + Wikimedia Commons
  const isImageDomain =
    trimmed.includes("animenewsnetwork.com") ||
    trimmed.includes("myanimelist.net") ||
    trimmed.includes("anilist.co") ||
    trimmed.includes("cbrimages.com") ||
    trimmed.includes("kinja-img.com") ||
    trimmed.includes("sportskeeda.com") ||
    trimmed.includes("crunchyroll.com") ||
    trimmed.includes("upload.wikimedia.org") ||
    trimmed.includes("static.wikia.nocookie.net") ||
    trimmed.includes("unsplash.com")

  const hasImageExtension = /\.(jpg|jpeg|png|webp|avif|gif)(\?.*)?$/i.test(trimmed)

  return isImageDomain || hasImageExtension
}

/**
 * Normalizes low-res thumbnails to high-res assets when available from CDNs
 */
export function upgradeSourceImageUrl(url: string): string {
  if (!url) return url
  // Upgrade ANN thumbnails (e.g. fit200x200 -> fit600x600)
  if (url.includes("animenewsnetwork.com/thumbnails/fit200x200/")) {
    return url.replace("/thumbnails/fit200x200/", "/thumbnails/fit600x600/")
  }
  // Upgrade MAL thumbnails
  if (url.includes("cdn.myanimelist.net/r/100x140/")) {
    return url.replace("/r/100x140/", "/r/600x600/")
  }
  return url
}

/**
 * Score-based franchise matching.
 * Keywords found in the title weigh more than excerpt matches, and longer
 * (more specific) keywords win ties so broad terms like "anime" never hijack.
 */
function matchFranchise(query: string, title: string): FranchiseImageRule | null {
  const titleLower = title.toLowerCase()
  let best: FranchiseImageRule | null = null
  let bestScore = 0

  for (const rule of OFFICIAL_ANIME_DATABASE) {
    let score = 0
    for (const keyword of rule.keywords) {
      if (query.includes(keyword)) {
        // Title matches are worth 3x excerpt matches
        score += titleLower.includes(keyword) ? 3 : 1
      }
    }
    if (score === 0) continue
    // Bonus for specificity: longer keywords indicate more confident matches
    const specificity = Math.max(...rule.keywords.map((k) => k.length))
    score += specificity * 0.05
    if (rule.weight) score += rule.weight

    if (score > bestScore) {
      bestScore = score
      best = rule
    }
  }

  return best
}

/**
 * Resolves the most accurate cover image for an article.
 * 1. Checks if explicit coverImage is valid.
 * 2. Checks official anime franchise database via title and excerpt keyword scoring.
 * 3. Uses anti-duplication title hash rotation across the visual pool.
 */
export function resolveAccurateCoverImage(params: {
  title?: string
  excerpt?: string
  category?: Category | string
  coverImage?: string
}): { url: string; matchType: "source" | "franchise" | "thematic"; franchise?: string } {
  // 1. If valid explicit coverImage exists, use it
  if (params.coverImage && isValidArticleImageUrl(params.coverImage)) {
    return { url: upgradeSourceImageUrl(params.coverImage), matchType: "source" }
  }

  const query = `${params.title || ""} ${params.excerpt || ""}`.toLowerCase()
  const title = params.title || ""

  // 2. Score-match against the official franchise database
  const matched = matchFranchise(query, title)
  if (matched) {
    return { url: matched.imageUrl, matchType: "franchise", franchise: matched.franchise }
  }

  // 3. Anti-Duplication Thematic Hash Rotation
  const titleStr = params.title || "anime-story"
  let hash = 0
  for (let i = 0; i < titleStr.length; i++) {
    hash = (hash << 5) - hash + titleStr.charCodeAt(i)
    hash |= 0
  }
  const poolIndex = Math.abs(hash) % THEMATIC_IMAGE_POOL.length
  return { url: THEMATIC_IMAGE_POOL[poolIndex], matchType: "thematic" }
}
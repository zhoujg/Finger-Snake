export interface VocabularyItem {
  emoji: string;
  cantonese: string; // Traditional Chinese
  jyutping: string;  // Romanization
  english: string;
}

export interface Theme {
  name: string;
  snakeHeadColor: string;
  snakeBodyColor: string;
  backgroundColor: string;
  particleColor: string;
  vocabulary: VocabularyItem[]; // Replaces simple foodEmojis
}

export const DEFAULT_THEME: Theme = {
  name: "Cantonese Essentials",
  snakeHeadColor: "#f59e0b", // amber-500
  snakeBodyColor: "#fbbf24", // amber-400
  backgroundColor: "#1c1917", // stone-900
  particleColor: "#fbbf24",
  vocabulary: [
    // --- Greetings & Basics (問候) ---
    { emoji: "👋", cantonese: "你好", jyutping: "nei5 hou2", english: "Hello" },
    { emoji: "🙏", cantonese: "多謝", jyutping: "do1 ze6", english: "Thank you (for gift)" },
    { emoji: "🤝", cantonese: "唔該", jyutping: "m4 goi1", english: "Thank you (service)" },
    { emoji: "🙇", cantonese: "對唔住", jyutping: "deoi3 m4 zyu6", english: "Sorry" },
    { emoji: "👋", cantonese: "拜拜", jyutping: "baai1 baai3", english: "Bye bye" },
    { emoji: "☀️", cantonese: "早晨", jyutping: "zou2 san4", english: "Good Morning" },
    { emoji: "🌙", cantonese: "早抖", jyutping: "zou2 tau2", english: "Good Night" },
    { emoji: "✅", cantonese: "係", jyutping: "hai6", english: "Yes / It is" },
    { emoji: "❌", cantonese: "唔係", jyutping: "m4 hai6", english: "No / Is not" },
    { emoji: "🆗", cantonese: "好", jyutping: "hou2", english: "Good / OK" },

    // --- Numbers (數字) ---
    { emoji: "1️⃣", cantonese: "一", jyutping: "jat1", english: "One" },
    { emoji: "2️⃣", cantonese: "二", jyutping: "ji6", english: "Two" },
    { emoji: "3️⃣", cantonese: "三", jyutping: "saam1", english: "Three" },
    { emoji: "4️⃣", cantonese: "四", jyutping: "sei3", english: "Four" },
    { emoji: "5️⃣", cantonese: "五", jyutping: "ng5", english: "Five" },
    { emoji: "6️⃣", cantonese: "六", jyutping: "luk6", english: "Six" },
    { emoji: "7️⃣", cantonese: "七", jyutping: "cat1", english: "Seven" },
    { emoji: "8️⃣", cantonese: "八", jyutping: "baat3", english: "Eight" },
    { emoji: "9️⃣", cantonese: "九", jyutping: "gau2", english: "Nine" },
    { emoji: "🔟", cantonese: "十", jyutping: "sap6", english: "Ten" },
    { emoji: "💯", cantonese: "百", jyutping: "baak3", english: "Hundred" },
    { emoji: "💰", cantonese: "千", jyutping: "cin1", english: "Thousand" },

    // --- Family (家庭) ---
    { emoji: "👨", cantonese: "爸爸", jyutping: "baa4 baa1", english: "Father" },
    { emoji: "👩", cantonese: "媽媽", jyutping: "maa4 maa1", english: "Mother" },
    { emoji: "👴", cantonese: "爺爺", jyutping: "je4 je2", english: "Grandpa (Paternal)" },
    { emoji: "👵", cantonese: "嫲嫲", jyutping: "maa4 maa4", english: "Grandma (Paternal)" },
    { emoji: "👦", cantonese: "哥哥", jyutping: "go4 go1", english: "Elder Brother" },
    { emoji: "👧", cantonese: "家姐", jyutping: "gaa1 ze2", english: "Elder Sister" },
    { emoji: "👶", cantonese: "細路", jyutping: "sai3 lou6", english: "Kid / Child" },
    { emoji: "🧔", cantonese: "男人", jyutping: "naam4 jan2", english: "Man" },
    { emoji: "👩", cantonese: "女人", jyutping: "neoi5 jan2", english: "Woman" },

    // --- Food: Dim Sum & Local (點心) ---
    { emoji: "🥟", cantonese: "蝦餃", jyutping: "haa1 gaau2", english: "Shrimp Dumpling" },
    { emoji: "🥡", cantonese: "燒賣", jyutping: "siu1 maai2", english: "Siu Mai" },
    { emoji: "🥯", cantonese: "叉燒包", jyutping: "caa1 siu1 baau1", english: "BBQ Pork Bun" },
    { emoji: "🍮", cantonese: "蛋撻", jyutping: "daan6 taat1", english: "Egg Tart" },
    { emoji: "🥣", cantonese: "粥", jyutping: "zuk1", english: "Congee" },
    { emoji: "🍜", cantonese: "雲吞麵", jyutping: "wan4 tan1 min6", english: "Wonton Noodles" },
    { emoji: "🍡", cantonese: "魚蛋", jyutping: "jyu4 daan2", english: "Fishball" },
    { emoji: "🍞", cantonese: "菠蘿包", jyutping: "bo1 lo4 baau1", english: "Pineapple Bun" },
    { emoji: "🧇", cantonese: "雞蛋仔", jyutping: "gai1 daan6 zai2", english: "Egg Waffle" },
    { emoji: "🍚", cantonese: "白飯", jyutping: "baak6 faan6", english: "Rice" },
    { emoji: "🥢", cantonese: "筷子", jyutping: "faai3 zi2", english: "Chopsticks" },

    // --- Drinks (飲品) ---
    { emoji: "🫖", cantonese: "茶", jyutping: "caa4", english: "Tea" },
    { emoji: "💧", cantonese: "水", jyutping: "seoi2", english: "Water" },
    { emoji: "☕", cantonese: "咖啡", jyutping: "gaa3 fe1", english: "Coffee" },
    { emoji: "🧋", cantonese: "奶茶", jyutping: "naai5 caa4", english: "Milk Tea" },
    { emoji: "🥤", cantonese: "可樂", jyutping: "ho2 lok6", english: "Cola" },
    { emoji: "🍺", cantonese: "啤酒", jyutping: "be1 zau2", english: "Beer" },

    // --- Fruits (生果) ---
    { emoji: "🍎", cantonese: "蘋果", jyutping: "ping4 gwo2", english: "Apple" },
    { emoji: "🍌", cantonese: "香蕉", jyutping: "hoeng1 ziu1", english: "Banana" },
    { emoji: "🍊", cantonese: "橙", jyutping: "caang2", english: "Orange" },
    { emoji: "🍇", cantonese: "提子", jyutping: "tai4 zi2", english: "Grape" },
    { emoji: "🍓", cantonese: "士多啤梨", jyutping: "si6 do1 be1 lei2", english: "Strawberry" },
    { emoji: "🍉", cantonese: "西瓜", jyutping: "sai1 gwaa1", english: "Watermelon" },
    { emoji: "🥭", cantonese: "芒果", jyutping: "mong1 gwo2", english: "Mango" },

    // --- Animals (動物) ---
    { emoji: "🐱", cantonese: "貓", jyutping: "maau1", english: "Cat" },
    { emoji: "🐶", cantonese: "狗", jyutping: "gau2", english: "Dog" },
    { emoji: "🐦", cantonese: "雀仔", jyutping: "zoek3 zai2", english: "Bird" },
    { emoji: "🐷", cantonese: "豬", jyutping: "zyu1", english: "Pig" },
    { emoji: "🐮", cantonese: "牛", jyutping: "ngau4", english: "Cow" },
    { emoji: "🐔", cantonese: "雞", jyutping: "gai1", english: "Chicken" },
    { emoji: "🐟", cantonese: "魚", jyutping: "jyu2", english: "Fish" },
    { emoji: "🐯", cantonese: "老虎", jyutping: "lou5 fu2", english: "Tiger" },
    { emoji: "🐭", cantonese: "老鼠", jyutping: "lou5 syu2", english: "Mouse" },
    { emoji: "🐘", cantonese: "大象", jyutping: "daai6 zoeng6", english: "Elephant" },

    // --- Colors (顏色) ---
    { emoji: "🔴", cantonese: "紅色", jyutping: "hung4 sik1", english: "Red" },
    { emoji: "🔵", cantonese: "藍色", jyutping: "laam4 sik1", english: "Blue" },
    { emoji: "🟢", cantonese: "綠色", jyutping: "luk6 sik1", english: "Green" },
    { emoji: "🟡", cantonese: "黃色", jyutping: "wong4 sik1", english: "Yellow" },
    { emoji: "⚫", cantonese: "黑色", jyutping: "hak1 sik1", english: "Black" },
    { emoji: "⚪", cantonese: "白色", jyutping: "baak6 sik1", english: "White" },
    { emoji: "🟣", cantonese: "紫色", jyutping: "zi2 sik1", english: "Purple" },
    { emoji: "🟠", cantonese: "橙色", jyutping: "caang2 sik1", english: "Orange" },

    // --- Verbs (動作) ---
    { emoji: "🍽️", cantonese: "食", jyutping: "sik6", english: "Eat" },
    { emoji: "🥤", cantonese: "飲", jyutping: "jam2", english: "Drink" },
    { emoji: "😴", cantonese: "瞓覺", jyutping: "fan3 gaau3", english: "Sleep" },
    { emoji: "🚶", cantonese: "行", jyutping: "haang4", english: "Walk" },
    { emoji: "🏃", cantonese: "跑", jyutping: "paau2", english: "Run" },
    { emoji: "👀", cantonese: "睇", jyutping: "tai2", english: "Look / Watch" },
    { emoji: "👂", cantonese: "聽", jyutping: "teng1", english: "Listen" },
    { emoji: "🗣️", cantonese: "講", jyutping: "gong2", english: "Speak" },
    { emoji: "🛒", cantonese: "買", jyutping: "maai5", english: "Buy" },
    { emoji: "🚶", cantonese: "去", jyutping: "heoi3", english: "Go" },
    { emoji: "👋", cantonese: "嚟", jyutping: "lai4", english: "Come" },
    { emoji: "🧘", cantonese: "坐", jyutping: "co5", english: "Sit" },
    { emoji: "🧍", cantonese: "企", jyutping: "kei5", english: "Stand" },

    // --- Adjectives (形容詞) ---
    { emoji: "👍", cantonese: "好", jyutping: "hou2", english: "Good" },
    { emoji: "👎", cantonese: "衰", jyutping: "seoi1", english: "Bad" },
    { emoji: "🐘", cantonese: "大", jyutping: "daai6", english: "Big" },
    { emoji: "🐜", cantonese: "細", jyutping: "sai3", english: "Small" },
    { emoji: "🥵", cantonese: "熱", jyutping: "jit6", english: "Hot" },
    { emoji: "🥶", cantonese: "凍", jyutping: "dung3", english: "Cold" },
    { emoji: "🏎️", cantonese: "快", jyutping: "faai3", english: "Fast" },
    { emoji: "🐢", cantonese: "慢", jyutping: "maan6", english: "Slow" },
    { emoji: "😄", cantonese: "開心", jyutping: "hoi1 sam1", english: "Happy" },
    { emoji: "💸", cantonese: "貴", jyutping: "gwai3", english: "Expensive" },
    { emoji: "🏷️", cantonese: "平", jyutping: "peng4", english: "Cheap" },
    { emoji: "😋", cantonese: "好食", jyutping: "hou2 sik6", english: "Delicious" },

    // --- Places (地方) ---
    { emoji: "🏠", cantonese: "屋企", jyutping: "uk1 kei2", english: "Home" },
    { emoji: "🏫", cantonese: "學校", jyutping: "hok6 haau6", english: "School" },
    { emoji: "🏢", cantonese: "公司", jyutping: "gung1 si1", english: "Office" },
    { emoji: "🏥", cantonese: "醫院", jyutping: "ji1 jyun2", english: "Hospital" },
    { emoji: "🏪", cantonese: "便利店", jyutping: "bin6 lei6 dim3", english: "Convenience Store" },
    { emoji: "🍽️", cantonese: "餐廳", jyutping: "caan1 teng1", english: "Restaurant" },
    { emoji: "🚉", cantonese: "地鐵", jyutping: "dei6 tit3", english: "MTR / Subway" },
    { emoji: "🚌", cantonese: "巴士", jyutping: "baa1 si2", english: "Bus" },
    { emoji: "🚽", cantonese: "廁所", jyutping: "ci3 so2", english: "Toilet" },

    // --- Nature & Time (自然 & 時間) ---
    { emoji: "☀️", cantonese: "太陽", jyutping: "taai3 joeng4", english: "Sun" },
    { emoji: "🌕", cantonese: "月光", jyutping: "jyut6 gwong1", english: "Moon" },
    { emoji: "🌧️", cantonese: "雨", jyutping: "jyu5", english: "Rain" },
    { emoji: "⛰️", cantonese: "山", jyutping: "saan1", english: "Mountain" },
    { emoji: "🌊", cantonese: "海", jyutping: "hoi2", english: "Sea" },
    { emoji: "📅", cantonese: "今日", jyutping: "gam1 jat6", english: "Today" },
    { emoji: "🗓️", cantonese: "聽日", jyutping: "ting1 jat6", english: "Tomorrow" },
    { emoji: "🕰️", cantonese: "依家", jyutping: "ji1 gaa1", english: "Now" }
  ]
};

export interface Point {
  x: number;
  y: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  subText?: string; // Added for English translation
  life: number; // 1.0 to 0.0
  color: string;
  size: number;
}
export type GameState = 'PLAYING' | 'GAME_OVER' | 'VICTORY';
import { CandyType, Station, Train, BOARD_SIZE, Sponsor } from '@/types';

export const CANDY_CONFIG: Record<CandyType, { name: string; color: string; points: number; emoji: string }> = {
  strawberry: { name: '草莓糖', color: '#FF6B9D', points: 10, emoji: '🍓' },
  lemon: { name: '柠檬糖', color: '#FFD93D', points: 10, emoji: '🍋' },
  mint: { name: '薄荷糖', color: '#6BCB77', points: 10, emoji: '🍀' },
  blueberry: { name: '蓝莓糖', color: '#4D96FF', points: 10, emoji: '🫐' },
  grape: { name: '葡萄糖', color: '#9B59B6', points: 10, emoji: '🍇' },
  rainbow: { name: '彩虹糖', color: 'linear-gradient(135deg, #FF6B9D, #FFD93D, #6BCB77, #4D96FF, #9B59B6)', points: 50, emoji: '🌈' },
  bomb: { name: '炸弹糖', color: '#FF4757', points: 30, emoji: '💣' },
};

export const STATIONS: Station[] = [
  {
    id: 'candy-town',
    name: '糖果小镇',
    reputationRequired: 0,
    themeColor: '#FF6B9D',
    description: '甜蜜的起点，适合新手列车长',
  },
  {
    id: 'lemon-estate',
    name: '柠檬庄园',
    reputationRequired: 100,
    themeColor: '#FFD93D',
    description: '酸爽的柠檬订单，需要更多技巧',
  },
  {
    id: 'mint-forest',
    name: '薄荷森林',
    reputationRequired: 300,
    themeColor: '#6BCB77',
    description: '急单频发的森林车站',
  },
  {
    id: 'blueberry-port',
    name: '蓝莓港口',
    reputationRequired: 600,
    themeColor: '#4D96FF',
    description: '大额订单的港口贸易站',
  },
  {
    id: 'grape-castle',
    name: '葡萄城堡',
    reputationRequired: 1000,
    themeColor: '#9B59B6',
    description: '皇家级别的复杂订单',
  },
];

export const SPONSORS: Sponsor[] = [
  {
    id: 'strawberry-soda',
    name: '草莓汽水',
    description: '甜美清新的国民汽水品牌，热爱一切草莓相关的事物',
    advancePayment: 80,
    reputationPenalty: 15,
    primaryColor: '#FF6B9D',
    secondaryColor: '#FFC8DD',
    accentColor: '#FF4081',
    logo: '🍓🥤',
    conditions: [
      {
        type: 'min-load-per-type',
        candyType: 'strawberry',
        value: 12,
        description: '草莓糖装载量不少于 12 个',
      },
      {
        type: 'forbidden-candy',
        candyType: 'mint',
        value: 0,
        description: '禁止装载薄荷糖（与草莓口味冲突）',
      },
    ],
  },
  {
    id: 'lemon-theater',
    name: '柠檬剧院',
    description: '艺术气息满满的演艺公司，追求完美的舞台效果',
    advancePayment: 100,
    reputationPenalty: 20,
    primaryColor: '#FFD93D',
    secondaryColor: '#FFF4B8',
    accentColor: '#FFA726',
    logo: '🍋🎭',
    conditions: [
      {
        type: 'min-load-per-type',
        candyType: 'lemon',
        value: 10,
        description: '柠檬糖装载量不少于 10 个',
      },
      {
        type: 'min-match-rate',
        value: 0.9,
        description: '订单匹配度需达到 90% 以上',
      },
    ],
  },
  {
    id: 'grape-royalty',
    name: '葡萄王室',
    description: '历史悠久的贵族品牌，对品质和数量都有极高要求',
    advancePayment: 150,
    reputationPenalty: 30,
    primaryColor: '#9B59B6',
    secondaryColor: '#D7BDE2',
    accentColor: '#7D3C98',
    logo: '🍇👑',
    conditions: [
      {
        type: 'min-load-per-type',
        candyType: 'grape',
        value: 15,
        description: '葡萄糖装载量不少于 15 个',
      },
      {
        type: 'min-total-load',
        value: 50,
        description: '总装载量不少于 50 个糖果',
      },
      {
        type: 'max-mismatch-types',
        value: 1,
        description: '错装种类不超过 1 种',
      },
    ],
  },
];

export const INITIAL_TRAIN: Train = {
  id: 'candy-express',
  name: '糖果快车',
  carriages: [
    { id: 'car-1', candyType: 'strawberry', capacity: 20, currentLoad: 0 },
    { id: 'car-2', candyType: 'lemon', capacity: 20, currentLoad: 0 },
    { id: 'car-3', candyType: 'mint', capacity: 20, currentLoad: 0 },
    { id: 'car-4', candyType: 'blueberry', capacity: 20, currentLoad: 0 },
    { id: 'car-5', candyType: 'grape', capacity: 20, currentLoad: 0 },
  ],
};

export const GAME_CONFIG = {
  BOARD_SIZE,
  INITIAL_MOVES: 30,
  COMBO_BONUS_MULTIPLIER: 0.5,
  MATCH_MIN: 3,
  FOUR_MATCH_SPECIAL: 'bomb' as const,
  FIVE_MATCH_SPECIAL: 'rainbow' as const,
  DISPATCH_BASE_REWARD: 50,
  MISMATCH_PENALTY_RATE: 0.3,
  URGENT_BONUS_RATE: 0.5,
  REPUTATION_PER_SUCCESS: 10,
  REPUTATION_PER_FAIL: -5,
  LOAD_PER_MATCH: 1,
};

import { ExhibitMeta, ConfessionItem, HonestThoughtItem } from '../types';

export const EXHIBITS: ExhibitMeta[] = [
  {
    id: 'breathe',
    order: 1,
    title: 'Exhibit I: Respiration Chamber',
    subtitle: 'Rhythmic breath regulation to decouple neural cortisol loops',
    label: 'Breathe',
    reductionPercentage: 20,
    targetRotAfter: 80,
  },
  {
    id: 'grass',
    order: 2,
    title: 'Exhibit II: Tactile Chlorophyll Meadow',
    subtitle: 'Direct sensory grounding against simulated outdoor foliage',
    label: 'Touch Grass',
    reductionPercentage: 20,
    targetRotAfter: 60,
  },
  {
    id: 'confess',
    order: 3,
    title: 'Exhibit III: The Scroll Sin Incinerator',
    subtitle: 'Name your algorithmic sins and watch them dissolve into ash',
    label: 'Confess Sins',
    reductionPercentage: 20,
    targetRotAfter: 40,
  },
  {
    id: 'silence',
    order: 4,
    title: 'Exhibit IV: Zero-Input Quarantine',
    subtitle: '15 seconds of absolute digital stillness. No scroll, no twitch.',
    label: 'Sit in Silence',
    reductionPercentage: 20,
    targetRotAfter: 20,
  },
  {
    id: 'thought',
    order: 5,
    title: 'Exhibit V: The Uncurated Monolith',
    subtitle: 'Engrave one single honest thought unoptimized for the algorithm',
    label: 'Honest Thought',
    reductionPercentage: 20,
    targetRotAfter: 0,
  },
];

export const PRESET_SCROLL_SINS: Omit<ConfessionItem, 'id'>[] = [
  {
    text: "Watched 35 consecutive reels of an anonymous person organizing their fridge",
    category: 'shortform',
  },
  {
    text: "Opened TikTok 'just to check one thing' and resurfaced 2.5 hours later in dark mode",
    category: 'doomscroll',
  },
  {
    text: "Read 140 replies deep into an argument between two automated rage-bait accounts",
    category: 'social',
  },
  {
    text: "Looked at my phone screen while already watching a movie on television",
    category: 'attention-span',
  },
  {
    text: "Watched Minecraft parkour footage while a synthetic AI voice read family Reddit gossip",
    category: 'shortform',
  },
  {
    text: "Closed Instagram out of boredom, then immediately opened Instagram again by muscle memory",
    category: 'doomscroll',
  },
  {
    text: "Spent 40 minutes researching the drama of influencers whose names I won't remember tomorrow",
    category: 'social',
  },
  {
    text: "Refreshed work inbox at 1:17 AM hoping for validation or dread",
    category: 'late-night',
  },
];

export const INITIAL_HONEST_THOUGHTS: HonestThoughtItem[] = [
  {
    id: 't-1',
    text: "I miss when the internet was quiet places you visited, not a noisy room following you into bed.",
    author: "Terminal Unit #402",
    timestamp: Date.now() - 1000 * 60 * 42,
  },
  {
    id: 't-2',
    text: "The smell of cold rain hitting hot asphalt in September is better than anything on my feed.",
    author: "Sanctuary Guest",
    timestamp: Date.now() - 1000 * 60 * 128,
  },
  {
    id: 't-3',
    text: "I don't actually care about 99% of the opinions I read today. I just wanted my hands to be busy.",
    author: "Decontaminated Soul #118",
    timestamp: Date.now() - 1000 * 60 * 210,
  },
  {
    id: 't-4',
    text: "I called my grandma today without checking notifications during the call. She sounded so happy.",
    author: "Recovered Human",
    timestamp: Date.now() - 1000 * 60 * 340,
  },
];

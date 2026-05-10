// Source of truth for the /projects page. Reverse-chronological — newest at
// the top. To add a new project, paste an entry at the top of `projects`.
//
// The page renders only `name` + a link (preferring `link2` for a live demo
// over `link` for the github repo). Other fields are kept for future
// expansion (badges, hackathon callouts, longer descriptions).

export type Project = {
  name: string;
  description?: string;
  link?: string;
  hackathon?: { name: string; link?: string };
  hidden?: boolean;     // set true to drop from /projects without deleting
};

export const projects: Project[] = [
  {
    name: 'image-storage-api',
    description:
      'Small-scale file hosting server (not quite an FTP server) for hosting site assets.',
    link: 'https://github.com/anish-sahoo/image-storage-api',
  },
  {
    name: 'GuardConnect',
    description:
      'Communication & mentor-matching system for the Massachusetts National Guard, built in partnership with Northeastern University.',
    link: 'https://github.com/KhourySpecialProjects/GuardConnect',
  },
  {
    name: 'Anime Discovery Engine',
    description:
      'The most overkill anime recommendation/personalization system that exists — work in progress, targeting Q1 2026.',
    link: 'https://github.com/anish-sahoo/AnimeDiscovery',
  },
  {
    name: 'ResumeTex',
    description: 'API that takes a resume in JSON and returns LaTeX/PDF in Jake\'s Resume format.',
    link: 'https://resumetex.asahoo.dev',
  },
  {
    name: 'Knights Archers Zombies PPO',
    description: 'Multi-agent PPO on the KnightsArchersZombies environment from PettingZoo.',
    link: 'https://github.com/anish-sahoo/KnightsArchersZombiesPPO',
  },
  {
    name: 'OpenLegislation',
    description:
      'Congress legislation explorer with vector search and bill analysis. Won a track prize at HackHarvard \'24.',
    link: 'https://github.com/ryankamiri/OpenLegislation',
    hackathon: {
      name: 'HackHarvard 2024 — Track Winner',
      link: 'https://devpost.com/software/openlegislation',
    },
  },
  {
    name: 'Sit Down and Study',
    description:
      'Coding-practice web app with AI-generated LeetCode-style questions and online judging.',
    link: 'https://github.com/trentwiles/SitDownAndStudy',
    hackathon: {
      name: 'YHack 2024 — Best Domain Name',
      link: 'https://devpost.com/software/sit-down-and-study',
    },
  },
  {
    name: 'AI Hoops',
    description: 'Taught an agent to play Atari\'s DoubleDunk via reinforcement learning (Double DQN).',
    link: 'https://github.com/anish-sahoo/AI-Hoops',
  },
  {
    name: 'AnimeVisualizer',
    description:
      'Map of the top 5000 anime from MyAnimeList using word embeddings, t-SNE, and a WebGL render via PixiJS.',
    link: 'https://github.com/anish-sahoo/AnimeVisualizer',
  },
  {
    name: 'easyclassplanner.com',
    description: 'Generates optimal class schedules using recursive backtracking, in Rust.',
    link: 'https://easyclassplanner.com',
  },
  {
    name: 'X Finance',
    description:
      'Uses the X API and xAI Grok LLM to form conclusions about current financial trends.',
    link: 'https://github.com/anish-sahoo/XDevChallenge',
    hackathon: { name: 'X Developer Challenge 2023' },
  },
  {
    name: 'Nearby Prices',
    description: 'Crowd-sourced price aggregator for small businesses.',
    link: 'https://github.com/anish-sahoo/NearbyPrices',
  },
  {
    name: 'PawHacks Website',
    description: 'Site for the PawHacks 1.0 hackathon at Northeastern Oakland.',
    hackathon: { name: 'PawHacks' },
  },
  {
    name: 'Portfolio Website (Gatsby.js)',
    description: 'My previous portfolio site, before this one.',
    link: 'https://github.com/anish-sahoo/asahoo.dev',
  },
  {
    name: 'KhouryKTRL VSCode Extension',
    description:
      'Speeds up running and linting Kotlin for CS2500 students. Used by 100+ students at NU Oakland in 2023.',
    link: 'https://github.com/anish-sahoo/khouryktrl',
  },
  {
    name: 'Snowjam Showdown',
    description: 'Game-jam project (theme: Christmas + Mills College). Owned art and the website.',
    link: 'https://github.com/anish-sahoo/SnowJam',
  },
  {
    name: 'HuskyLink',
    description: 'Mentor-matching platform for students, built at CalHacks 10.0.',
    
    hackathon: { name: 'CalHacks 10.0' },
  },
  {
    name: 'Library Management System',
    description: 'Web app with a handful of library-management features.',
    
    link: 'https://github.com/anish-sahoo/LibraryManagement',
  },
  {
    name: 'Expiry Date Reminder',
    description: 'Stores product expiry dates and reminds you when they\'re close.',
    
    link:
      'https://play.google.com/store/apps/details?id=com.anish.expirydatereminder',
  },
  {
    name: 'Password Manager',
    description: 'Tiny CLI password manager backed by SQLite.',
  },
  {
    name: 'Wordle Clone',
    description: 'Wordle, in Java.',
  },
];

export function visibleProjects(): Project[] {
  return projects.filter((p) => !p.hidden);
}


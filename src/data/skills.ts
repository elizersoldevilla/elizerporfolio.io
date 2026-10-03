// Skills data - separate file to avoid parsing issues
export const skillCategories = [
  {
    name: 'Programming Languages',
    icon: 'code',
    skills: [
      { name: 'PHP', level: 90, color: 'bg-purple-500' },
      { name: 'JavaScript', level: 85, color: 'bg-yellow-500' },
      { name: 'TypeScript', level: 80, color: 'bg-blue-500' },
      { name: 'Python', level: 75, color: 'bg-green-500' },
      { name: 'C#', level: 70, color: 'bg-purple-600' },
      { name: 'SQL', level: 85, color: 'bg-orange-500' },
    ]
  },
  {
    name: 'Frameworks & Libraries',
    icon: 'layers',
    skills: [
      { name: 'Laravel', level: 90, color: 'bg-red-500' },
      { name: 'Vue.js', level: 80, color: 'bg-green-500' },
      { name: 'React', level: 75, color: 'bg-cyan-500' },
      { name: 'Astro', level: 70, color: 'bg-orange-500' },
      { name: 'Bootstrap', level: 90, color: 'bg-purple-500' },
      { name: 'Tailwind CSS', level: 85, color: 'bg-cyan-500' },
      { name: 'Inertia.js', level: 75, color: 'bg-indigo-500' },
    ]
  },
  {
    name: 'Databases',
    icon: 'database',
    skills: [
      { name: 'MySQL', level: 90, color: 'bg-blue-600' },
      { name: 'PostgreSQL', level: 80, color: 'bg-blue-500' },
      { name: 'SQL Server', level: 75, color: 'bg-red-500' },
      { name: 'Redis', level: 70, color: 'bg-red-600' },
    ]
  },
  {
    name: 'Tools & Platforms',
    icon: 'tool',
    skills: [
      { name: 'Git/GitHub', level: 90, color: 'bg-gray-700' },
      { name: 'Docker', level: 75, color: 'bg-blue-500' },
      { name: 'Linux Admin', level: 80, color: 'bg-yellow-600' },
      { name: 'VS Code', level: 95, color: 'bg-blue-500' },
      { name: 'Postman', level: 85, color: 'bg-orange-500' },
      { name: 'Jira', level: 75, color: 'bg-blue-500' },
    ]
  },
  {
    name: 'Architecture & Practices',
    icon: 'cpu',
    skills: [
      { name: 'System Architecture', level: 80, color: 'bg-indigo-500' },
      { name: 'API Design', level: 85, color: 'bg-purple-500' },
      { name: 'Database Design', level: 85, color: 'bg-green-500' },
      { name: 'Problem Solving', level: 90, color: 'bg-red-500' },
      { name: 'Code Review', level: 80, color: 'bg-blue-500' },
      { name: 'Technical Documentation', level: 85, color: 'bg-amber-500' },
    ]
  },
];

export const softSkills = [
  { name: 'Communication', level: 80, desc: 'Effective verbal & written communication' },
  { name: 'Cooperation', level: 100, desc: 'Team collaboration & knowledge sharing' },
  { name: 'Creativity', level: 85, desc: 'Innovative problem-solving approaches' },
  { name: 'Problem Solving', level: 80, desc: 'Analytical thinking & debugging' },
  { name: 'Responsibility', level: 90, desc: 'Ownership & accountability' },
  { name: 'Productivity', level: 85, desc: 'Quality results & time management' },
  { name: 'Adaptability', level: 85, desc: 'Quick learning & flexibility' },
  { name: 'Leadership', level: 75, desc: 'Mentoring & project coordination' },
];

export function getIconPath(name: string): string {
  const icons: Record<string, string> = {
    code: 'M10 20l4-16m4 16l4-16M6 12a4 4 0 11-8 0 4 4 0 018 0z',
    layers: 'M4 6h16M4 12h16M4 18h16',
    database: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4',
    tool: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    cpu: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z',
  };
  return icons[name] || icons.code;
}
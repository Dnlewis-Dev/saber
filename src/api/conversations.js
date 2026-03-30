const db = [
  {
    id: 'c1',
    title: 'Chat about JavaScript',
    subtitle: 'Basics, DOM, async',
  },
  {
    id: 'c2',
    title: 'Help with CSS',
    subtitle: 'Layout, flex, grid',
  },
];

export function listConversations() {
  return Promise.resolve([...db]);
}
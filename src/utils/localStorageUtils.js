const STORAGE_KEY = 'stories';

export function loadStories() {
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  return all.filter(story => Date.now() - story.createdAt < 24 * 60 * 60 * 1000);
}

export function saveStory(story) {
  const all = loadStories();
  all.push(story);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function cleanExpiredStories() {
  const validStories = loadStories();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(validStories));
}

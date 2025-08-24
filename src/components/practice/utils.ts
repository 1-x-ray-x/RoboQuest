import type { Project } from './types';

export function filterProjects(
  projects: Project[],
  searchQuery: string,
  selectedCategory: string,
  selectedDifficulty: string
): Project[] {
  let filtered = [...projects];

  // Filter by search query
  if (searchQuery) {
    filtered = filtered.filter(project =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Filter by category
  if (selectedCategory !== 'all') {
    filtered = filtered.filter(project => project.category === selectedCategory);
  }

  // Filter by difficulty
  if (selectedDifficulty !== 'all') {
    filtered = filtered.filter(project => project.difficulty === selectedDifficulty);
  }

  return filtered;
}

export function isProjectCompleted(projectId: string, completedProjects: string[] = []): boolean {
  return completedProjects.includes(projectId);
}
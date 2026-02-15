// Quiz statistics storage
export interface QuizSession {
  date: string;
  quizType: string;
  correct: number;
  total: number;
}

export interface QuizStats {
  totalQuestions: number;
  totalCorrect: number;
  sessions: QuizSession[];
  statsByType: Record<string, { correct: number; total: number }>;
}

const STORAGE_KEY = 'poker-trainer-stats';

function getDefaultStats(): QuizStats {
  return {
    totalQuestions: 0,
    totalCorrect: 0,
    sessions: [],
    statsByType: {}
  };
}

export function loadProgress(): QuizStats {
  if (typeof window === 'undefined') return getDefaultStats();

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return getDefaultStats();
    return JSON.parse(stored);
  } catch {
    return getDefaultStats();
  }
}

export function saveProgress(stats: QuizStats): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // Storage full or unavailable
  }
}

export function updateQuizStats(
  quizType: string,
  correct: number,
  total: number
): QuizStats {
  const stats = loadProgress();

  // Update totals
  stats.totalQuestions += total;
  stats.totalCorrect += correct;

  // Update by type
  if (!stats.statsByType[quizType]) {
    stats.statsByType[quizType] = { correct: 0, total: 0 };
  }
  stats.statsByType[quizType].correct += correct;
  stats.statsByType[quizType].total += total;

  // Add session
  stats.sessions.push({
    date: new Date().toISOString(),
    quizType,
    correct,
    total
  });

  // Keep only last 50 sessions
  if (stats.sessions.length > 50) {
    stats.sessions = stats.sessions.slice(-50);
  }

  saveProgress(stats);
  return stats;
}

export function getAccuracyPercentage(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

export function resetProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

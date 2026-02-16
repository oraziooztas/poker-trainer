// === TYPES ===

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

export interface ModuleProgress {
  moduleId: string;
  completed: boolean;
  completedAt?: string;
  quizPassed?: boolean;
}

export interface UserProgress {
  currentPhase: number;
  currentModule: string;
  modules: Record<string, ModuleProgress>;
  startedAt: string;
  lastActivityAt: string;
}

export interface ScenarioResult {
  scenarioId: string;
  category: string;
  chosenOption: string;
  quality: 'best' | 'acceptable' | 'mistake' | 'disaster';
  timestamp: string;
}

export interface ScenarioStats {
  totalAttempted: number;
  results: ScenarioResult[];
  statsByCategory: Record<string, { best: number; acceptable: number; mistake: number; disaster: number; total: number }>;
}

export interface DailyEntry {
  date: string; // YYYY-MM-DD
  quizCorrect: number;
  quizTotal: number;
  scenariosAttempted: number;
  scenariosBest: number;
  modulesCompleted: number;
}

export interface DailyStats {
  entries: DailyEntry[];
}

// === STORAGE KEYS ===

const KEYS = {
  quiz: 'poker-trainer-stats',
  progress: 'poker-trainer-progress',
  scenarios: 'poker-trainer-scenarios',
  daily: 'poker-trainer-daily',
} as const;

// === HELPERS ===

function isSSR(): boolean {
  return typeof window === 'undefined';
}

function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (isSSR()) return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return defaultValue;
    return JSON.parse(stored);
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  if (isSSR()) return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Storage full or unavailable
  }
}

function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

// === QUIZ STATS (existing domain) ===

function getDefaultQuizStats(): QuizStats {
  return {
    totalQuestions: 0,
    totalCorrect: 0,
    sessions: [],
    statsByType: {},
  };
}

export function loadProgress(): QuizStats {
  return loadFromStorage(KEYS.quiz, getDefaultQuizStats());
}

export function saveProgress(stats: QuizStats): void {
  saveToStorage(KEYS.quiz, stats);
}

export function updateQuizStats(
  quizType: string,
  correct: number,
  total: number
): QuizStats {
  const stats = loadProgress();

  stats.totalQuestions += total;
  stats.totalCorrect += correct;

  if (!stats.statsByType[quizType]) {
    stats.statsByType[quizType] = { correct: 0, total: 0 };
  }
  stats.statsByType[quizType].correct += correct;
  stats.statsByType[quizType].total += total;

  stats.sessions.push({
    date: new Date().toISOString(),
    quizType,
    correct,
    total,
  });

  // Keep only last 50 sessions
  if (stats.sessions.length > 50) {
    stats.sessions = stats.sessions.slice(-50);
  }

  saveProgress(stats);

  // Also update daily stats
  updateDailyQuiz(correct, total);

  return stats;
}

export function getAccuracyPercentage(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

export function resetProgress(): void {
  if (isSSR()) return;
  localStorage.removeItem(KEYS.quiz);
}

// === USER PROGRESS (learning path) ===

function getDefaultUserProgress(): UserProgress {
  return {
    currentPhase: 0,
    currentModule: 'hand-rankings',
    modules: {},
    startedAt: new Date().toISOString(),
    lastActivityAt: new Date().toISOString(),
  };
}

export function loadUserProgress(): UserProgress {
  return loadFromStorage(KEYS.progress, getDefaultUserProgress());
}

export function saveUserProgress(progress: UserProgress): void {
  saveToStorage(KEYS.progress, progress);
}

export function completeModule(moduleId: string, quizPassed?: boolean): UserProgress {
  const progress = loadUserProgress();

  progress.modules[moduleId] = {
    moduleId,
    completed: true,
    completedAt: new Date().toISOString(),
    quizPassed,
  };
  progress.lastActivityAt = new Date().toISOString();

  saveUserProgress(progress);

  // Update daily stats
  updateDailyModules(1);

  return progress;
}

export function updateCurrentModule(moduleId: string, phase: number): UserProgress {
  const progress = loadUserProgress();
  progress.currentModule = moduleId;
  progress.currentPhase = phase;
  progress.lastActivityAt = new Date().toISOString();
  saveUserProgress(progress);
  return progress;
}

export function resetUserProgress(): void {
  if (isSSR()) return;
  localStorage.removeItem(KEYS.progress);
}

// === SCENARIO STATS ===

function getDefaultScenarioStats(): ScenarioStats {
  return {
    totalAttempted: 0,
    results: [],
    statsByCategory: {},
  };
}

export function loadScenarioStats(): ScenarioStats {
  return loadFromStorage(KEYS.scenarios, getDefaultScenarioStats());
}

export function saveScenarioStats(stats: ScenarioStats): void {
  saveToStorage(KEYS.scenarios, stats);
}

export function recordScenarioResult(
  scenarioId: string,
  category: string,
  chosenOption: string,
  quality: ScenarioResult['quality']
): ScenarioStats {
  const stats = loadScenarioStats();

  stats.totalAttempted += 1;

  stats.results.push({
    scenarioId,
    category,
    chosenOption,
    quality,
    timestamp: new Date().toISOString(),
  });

  // Keep only last 200 results
  if (stats.results.length > 200) {
    stats.results = stats.results.slice(-200);
  }

  // Update category stats
  if (!stats.statsByCategory[category]) {
    stats.statsByCategory[category] = { best: 0, acceptable: 0, mistake: 0, disaster: 0, total: 0 };
  }
  stats.statsByCategory[category][quality] += 1;
  stats.statsByCategory[category].total += 1;

  saveScenarioStats(stats);

  // Update daily stats
  updateDailyScenarios(quality === 'best' ? 1 : 0);

  return stats;
}

export function resetScenarioStats(): void {
  if (isSSR()) return;
  localStorage.removeItem(KEYS.scenarios);
}

// === DAILY STATS ===

function getDefaultDailyStats(): DailyStats {
  return { entries: [] };
}

export function loadDailyStats(): DailyStats {
  return loadFromStorage(KEYS.daily, getDefaultDailyStats());
}

function saveDailyStats(stats: DailyStats): void {
  saveToStorage(KEYS.daily, stats);
}

function getOrCreateTodayEntry(stats: DailyStats): DailyEntry {
  const today = getTodayKey();
  let entry = stats.entries.find(e => e.date === today);
  if (!entry) {
    entry = {
      date: today,
      quizCorrect: 0,
      quizTotal: 0,
      scenariosAttempted: 0,
      scenariosBest: 0,
      modulesCompleted: 0,
    };
    stats.entries.push(entry);

    // Keep only last 90 days
    if (stats.entries.length > 90) {
      stats.entries = stats.entries.slice(-90);
    }
  }
  return entry;
}

function updateDailyQuiz(correct: number, total: number): void {
  const stats = loadDailyStats();
  const entry = getOrCreateTodayEntry(stats);
  entry.quizCorrect += correct;
  entry.quizTotal += total;
  saveDailyStats(stats);
}

function updateDailyScenarios(bestCount: number): void {
  const stats = loadDailyStats();
  const entry = getOrCreateTodayEntry(stats);
  entry.scenariosAttempted += 1;
  entry.scenariosBest += bestCount;
  saveDailyStats(stats);
}

function updateDailyModules(count: number): void {
  const stats = loadDailyStats();
  const entry = getOrCreateTodayEntry(stats);
  entry.modulesCompleted += count;
  saveDailyStats(stats);
}

// === EXPORT / IMPORT ===

export interface ExportData {
  version: 1;
  exportedAt: string;
  quiz: QuizStats;
  progress: UserProgress;
  scenarios: ScenarioStats;
  daily: DailyStats;
}

export function exportAllData(): ExportData {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    quiz: loadProgress(),
    progress: loadUserProgress(),
    scenarios: loadScenarioStats(),
    daily: loadDailyStats(),
  };
}

export function importAllData(data: ExportData): boolean {
  try {
    if (data.version !== 1) return false;
    saveProgress(data.quiz);
    saveUserProgress(data.progress);
    saveScenarioStats(data.scenarios);
    saveDailyStats(data.daily);
    return true;
  } catch {
    return false;
  }
}

export function resetAllData(): void {
  if (isSSR()) return;
  Object.values(KEYS).forEach(key => localStorage.removeItem(key));
}

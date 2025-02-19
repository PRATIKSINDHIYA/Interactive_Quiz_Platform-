import { openDB } from 'idb';
import type { QuizAttempt } from '../types/quiz';

const DB_NAME = 'quiz-platform';
const STORE_NAME = 'attempts';

async function initDB() {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
  return db;
}

export async function saveAttempt(attempt: QuizAttempt) {
  try {
    const db = await initDB();
    await db.add(STORE_NAME, attempt);
  } catch (error) {
    console.error('Error saving attempt:', error);
  }
}

export async function getAttempts(): Promise<QuizAttempt[]> {
  try {
    const db = await initDB();
    return await db.getAll(STORE_NAME);
  } catch (error) {
    console.error('Error getting attempts:', error);
    return [];
  }
}
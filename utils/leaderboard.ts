export interface LeaderboardEntry {
    email: string;
    points: number;
    lastUpdated: string;
}

interface DailyData {
    [email: string]: number; // Email -> Points
}

interface StorageData {
    [dateKey: string]: DailyData; // YYYY-MM-DD -> { email: points }
}

const STORAGE_KEY = 'app_leaderboard_data';

const getTodayKey = (): string => {
    return new Date().toISOString().split('T')[0];
};

const getStorage = (): StorageData => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
};

const saveStorage = (data: StorageData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const addPoints = (email: string, points: number) => {
    const data = getStorage();
    const today = getTodayKey();

    if (!data[today]) {
        data[today] = {};
    }

    const currentPoints = data[today][email] || 0;
    data[today][email] = currentPoints + points;

    saveStorage(data);
};

export const getUserRank = (email: string): number | null => {
    const data = getStorage();
    const today = getTodayKey();
    const dailyData = data[today];

    if (!dailyData || !dailyData[email]) return null;

    // Convert to array and sort descending
    const sorted = Object.entries(dailyData).sort(([, pointsA], [, pointsB]) => pointsB - pointsA);
    
    // Find index (0-based, so add 1)
    const rank = sorted.findIndex(([e]) => e === email);
    return rank !== -1 ? rank + 1 : null;
};

export const getTopStudents = (limit: number = 5): { email: string; points: number }[] => {
    const data = getStorage();
    const today = getTodayKey();
    const dailyData = data[today];

    if (!dailyData) return [];

    return Object.entries(dailyData)
        .map(([email, points]) => ({ email, points }))
        .sort((a, b) => b.points - a.points)
        .slice(0, limit);
};

export const getTodayPoints = (email: string): number => {
    const data = getStorage();
    const today = getTodayKey();
    return data[today]?.[email] || 0;
};
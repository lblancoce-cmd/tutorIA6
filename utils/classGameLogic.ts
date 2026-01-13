
// Simple persistence for class progress
// In a real app, this would be a database

const BATTLE_STORAGE_KEY = 'class_battle_data';

interface ClassData {
    A: number[]; // Array of 24 numbers (points)
    B: number[]; // Array of 25 numbers (points)
}

const getBattleStorage = (): ClassData => {
    const data = localStorage.getItem(BATTLE_STORAGE_KEY);
    if (data) return JSON.parse(data);
    
    // Init empty
    return {
        A: Array(24).fill(0),
        B: Array(25).fill(0)
    };
};

const saveBattleStorage = (data: ClassData) => {
    localStorage.setItem(BATTLE_STORAGE_KEY, JSON.stringify(data));
};

// Checks if the condition is met: Total Points == N AND Min Point >= 1
// Actually, if Total == N and Min >= 1, it mathematically implies EVERYONE has exactly 1.
export const checkUnlockCondition = (classId: 'A' | 'B'): boolean => {
    const data = getBattleStorage();
    const students = data[classId];
    const count = students.length;

    const totalPoints = students.reduce((a, b) => a + b, 0);
    const minPoints = Math.min(...students);

    // Condition: Sum equals count (e.g. 24) AND everyone has at least 1.
    // This basically means everyone has exactly 1 point.
    return totalPoints === count && minPoints >= 1;
};

// For the Admin to force the game state
export const simulateUnlock = (classId: 'A' | 'B') => {
    const data = getBattleStorage();
    // Give everyone 1 point
    data[classId] = data[classId].map(() => 1);
    saveBattleStorage(data);
};

export const resetClassProgress = (classId: 'A' | 'B') => {
    const data = getBattleStorage();
    data[classId] = data[classId].map(() => 0);
    saveBattleStorage(data);
};

export const getClassSize = (classId: 'A' | 'B') => classId === 'A' ? 24 : 25;

// --- GAME ZONE ACCESS LOGIC ---

export interface GameZoneAccessData {
    requests: string[]; // emails
    approved: string[]; // emails
}

const GAME_ZONE_STORAGE_KEY = 'game_zone_access_data';

export const getAccessData = (): GameZoneAccessData => {
    const data = localStorage.getItem(GAME_ZONE_STORAGE_KEY);
    return data ? JSON.parse(data) : { requests: [], approved: [] };
};

const saveAccessData = (data: GameZoneAccessData) => {
    localStorage.setItem(GAME_ZONE_STORAGE_KEY, JSON.stringify(data));
};

export const requestAccess = (email: string) => {
    const data = getAccessData();
    if (!data.requests.includes(email) && !data.approved.includes(email)) {
        data.requests.push(email);
        saveAccessData(data);
    }
};

export const approveAccess = (email: string) => {
    const data = getAccessData();
    data.requests = data.requests.filter(req => req !== email);
    if (!data.approved.includes(email)) {
        data.approved.push(email);
    }
    saveAccessData(data);
};

export const revokeAccess = (email: string) => {
    const data = getAccessData();
    data.approved = data.approved.filter(app => app !== email);
    saveAccessData(data);
};

export const approveAll = () => {
    const data = getAccessData();
    data.requests.forEach(req => {
        if (!data.approved.includes(req)) {
            data.approved.push(req);
        }
    });
    data.requests = [];
    saveAccessData(data);
};

export const revokeAll = () => {
    const data = getAccessData();
    data.approved = [];
    saveAccessData(data);
};

export const checkUserAccess = (email: string): 'approved' | 'requested' | 'locked' => {
    const data = getAccessData();
    if (data.approved.includes(email)) return 'approved';
    if (data.requests.includes(email)) return 'requested';
    return 'locked';
};

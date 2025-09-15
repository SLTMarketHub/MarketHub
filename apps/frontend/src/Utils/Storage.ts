export type Role = 'Customer' | 'Partner' | 'Admin';

export interface StoredUser {
    id: string;           // simple uid
    name: string;
    email: string;
    password: string;     // WARNING: plaintext for demo only
    role: Role;
    createdAt: string;
}

const KEY = 'mh_users_v1';

function readAll(): StoredUser[] {
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function writeAll(users: StoredUser[]) {
    localStorage.setItem(KEY, JSON.stringify(users));
}

export function getUserByEmail(email: string): StoredUser | undefined {
    return readAll().find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function addUser(user: Omit<StoredUser, 'id' | 'createdAt'>): StoredUser {
    const exists = getUserByEmail(user.email);
    if (exists) throw new Error('USER_EXISTS');
    const newUser: StoredUser = {
        ...user,
        id: 'U' + Math.random().toString(36).slice(2, 10).toUpperCase(),
        createdAt: new Date().toISOString(),
    };
    const all = readAll();
    all.push(newUser);
    writeAll(all);
    return newUser;
}

export function validatePassword(email: string, password: string): StoredUser | null {
    const u = getUserByEmail(email);
    if (!u) return null;
    return u.password === password ? u : null;
}

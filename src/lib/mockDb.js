// Mock Database Initialization and Handlers using LocalStorage
// Provides a Supabase-like abstraction for easy migration later.

const INITIAL_DATA = {
  users: [
    {
      id: 'usr-1',
      email: 'admin@perform.com',
      password: 'password123', // In real app, this is hashed!
      name: 'Super Admin',
      system_role: 'admin',
      job_role: 'System Administrator',
    },
    {
      id: 'usr-2',
      email: 'dev@perform.com',
      password: 'password123',
      name: 'John Developer',
      system_role: 'member',
      job_role: 'Developer',
    },
    {
      id: 'usr-3',
      email: 'hr@perform.com',
      password: 'password123',
      name: 'Sarah HR',
      system_role: 'member',
      job_role: 'HR Specialist',
    },
    {
      id: 'usr-4',
      email: 'lead@perform.com',
      password: 'password123',
      name: 'Mike Lead',
      system_role: 'member',
      job_role: 'Team Lead',
    }
  ],
  projects: [
    {
      id: 'prj-1',
      name: 'Website Redesign',
      client_name: 'Acme Corp',
      status: 'In Progress',
      created_at: new Date().toISOString()
    }
  ],
  tasks: [
    {
      id: 'tsk-1',
      title: 'Setup React Framework',
      description: 'Initialize the Vite project and UI design.',
      assigned_to: 'usr-2',
      project_id: 'prj-1',
      week_id: 'wk-1',
      priority_points: 10,
      status: 'Completed',
      completed_at: new Date(Date.now() - 86400000).toISOString() // completed yesterday
    },
    {
      id: 'tsk-2',
      title: 'Onboard New Employees',
      description: 'Send welcome packages.',
      assigned_to: 'usr-3',
      project_id: null,
      week_id: 'wk-1',
      priority_points: 5,
      status: 'In Progress'
    }
  ],
  weekly_goals: [
    {
      id: 'wk-1',
      week_start: new Date().toISOString(),
      task_points_goal: 50,
      status: 'Pending'
    }
  ],
  meetings: []
};

// Initialize DB
export const initDb = () => {
  if (!localStorage.getItem('perform_db')) {
    localStorage.setItem('perform_db', JSON.stringify(INITIAL_DATA));
  }
};

const getDb = () => {
  initDb();
  return JSON.parse(localStorage.getItem('perform_db'));
};

const saveDb = (data) => {
  localStorage.setItem('perform_db', JSON.stringify(data));
};

export const generateId = (prefix) => `${prefix}-${Math.random().toString(36).substr(2, 9)}`;

// Authentication Handlers
export const login = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const db = getDb();
      const user = db.users.find(u => u.email === email && u.password === password);
      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        localStorage.setItem('perform_session', JSON.stringify(userWithoutPassword));
        resolve({ user: userWithoutPassword, error: null });
      } else {
        resolve({ user: null, error: 'Invalid email or password' });
      }
    }, 500); // simulate network delay
  });
};

export const logout = () => {
  localStorage.removeItem('perform_session');
};

export const getCurrentUser = () => {
  const session = localStorage.getItem('perform_session');
  return session ? JSON.parse(session) : null;
};

// Data Fetchers
export const getProjects = () => getDb().projects;
export const getTasks = () => getDb().tasks;
export const getUsers = () => getDb().users.map(u => {
  const { password, ...rest } = u;
  return rest;
});
export const getWeeklyGoals = () => getDb().weekly_goals;
export const getMeetings = () => getDb().meetings;

// Data Mutations
export const addTask = (taskData) => {
  const db = getDb();
  const newTask = { ...taskData, id: generateId('tsk'), status: 'Not Started' };
  db.tasks.push(newTask);
  saveDb(db);
  return newTask;
};

export const updateTaskStatus = (taskId, status) => {
  const db = getDb();
  const taskIndex = db.tasks.findIndex(t => t.id === taskId);
  if (taskIndex > -1) {
    db.tasks[taskIndex].status = status;
    if (status === 'Completed') {
      db.tasks[taskIndex].completed_at = new Date().toISOString();
    }
    saveDb(db);
    return db.tasks[taskIndex];
  }
  return null;
};

export const updateProjectStatus = (projectId, status) => {
  const db = getDb();
  const projectIndex = db.projects.findIndex(p => p.id === projectId);
  if (projectIndex > -1) {
    db.projects[projectIndex].status = status;
    saveDb(db);
    return db.projects[projectIndex];
  }
  return null;
};


// Generic Add
export const addRecord = (table, recordData) => {
  const db = getDb();
  const newRecord = { ...recordData, id: generateId(table.substring(0, 3)), created_at: new Date().toISOString() };
  db[table].push(newRecord);
  saveDb(db);
  return newRecord;
};

// Weekly Goals Handlers
export const addWeeklyGoal = (goalData) => {
  const db = getDb();
  const newGoal = { ...goalData, id: generateId('wk'), status: 'Pending' };
  db.weekly_goals.push(newGoal);
  saveDb(db);
  return newGoal;
};

export const updateWeeklyGoal = (goalId, updates) => {
  const db = getDb();
  const goalIndex = db.weekly_goals.findIndex(g => g.id === goalId);
  if (goalIndex > -1) {
    db.weekly_goals[goalIndex] = { ...db.weekly_goals[goalIndex], ...updates };
    saveDb(db);
    return db.weekly_goals[goalIndex];
  }
  return null;
};

// User Management Admin Handlers
export const getUsersAdmin = () => getDb().users;

export const addUser = (userData) => {
  const db = getDb();
  const newUser = { ...userData, id: generateId('usr') };
  db.users.push(newUser);
  saveDb(db);
  return newUser;
};

export const deleteUser = (userId) => {
  const db = getDb();
  db.users = db.users.filter(u => u.id !== userId);
  saveDb(db);
};

export const updateUserDetails = (userId, details) => {
  const db = getDb();
  const userIndex = db.users.findIndex(u => u.id === userId);
  if (userIndex > -1) {
    db.users[userIndex] = { ...db.users[userIndex], ...details };
    saveDb(db);
    return db.users[userIndex];
  }
  return null;
};

export const updateUserRole = (userId, role) => {
  const db = getDb();
  const userIndex = db.users.findIndex(u => u.id === userId);
  if (userIndex > -1) {
    db.users[userIndex].system_role = role;
    saveDb(db);
    return db.users[userIndex];
  }
  return null;
};

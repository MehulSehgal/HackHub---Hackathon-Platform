import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { InAppNotification, NotificationCategory } from "../types/notifications";
import { INITIAL_NOTIFICATIONS } from "../data/mockNotifications";

// ------------------- Types -------------------
interface Task {
  id: string;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Done";
  assignee: string;
  dueDate?: Date;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

type AppContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  login: (username: string, password: string) => void;
  logout: () => void;

  isInitialized: boolean;

  teamName: string;
  setTeamName: (name: string) => void;
  teamBio: string;
  setTeamBio: (bio: string) => void;
  teamMembers: TeamMember[];
  setTeamMembers: (members: TeamMember[]) => void;
  addTeamMember: (member: Omit<TeamMember, "id">) => void;

  currentUser: TeamMember | null;
  setCurrentUser: (user: TeamMember | null) => void;

  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;

  deadline: Date | null;
  setDeadline: (date: Date | null) => void;

  hackathonEndTime: Date | null;
  setHackathonEndTime: (date: Date | null) => void;
  resetHackathonTimer: () => void;

  // In-app notifications
  notifications: InAppNotification[];
  unreadNotificationCount: number;
  addNotification: (
    notification: Omit<InAppNotification, "id" | "timestamp" | "read">
  ) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearAllNotifications: () => void;
};

const defaultContextValue: AppContextType = {
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  login: () => {},
  logout: () => {},
  isInitialized: false,
  teamName: "My Team",
  setTeamName: () => {},
  teamBio: "Our team is participating in a hackathon!",
  setTeamBio: () => {},
  teamMembers: [],
  setTeamMembers: () => {},
  addTeamMember: () => {},
  currentUser: null,
  setCurrentUser: () => {},
  tasks: [],
  setTasks: () => {},
  addTask: () => {},
  updateTask: () => {},
  deadline: null,
  setDeadline: () => {},
  hackathonEndTime: null,
  setHackathonEndTime: () => {},
  resetHackathonTimer: () => {},
  notifications: [],
  unreadNotificationCount: 0,
  addNotification: () => {},
  markNotificationAsRead: () => {},
  markAllNotificationsAsRead: () => {},
  clearAllNotifications: () => {},
};

export const AppContext = createContext<AppContextType>(defaultContextValue);
export const useAppContext = () => useContext(AppContext);

type AppProviderProps = {
  children: ReactNode;
};

// ------------------- Provider -------------------
export const AppProvider = ({ children }: AppProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const [teamName, setTeamName] = useState("My Team");
  const [teamBio, setTeamBio] = useState(
    "Our team is participating in a hackathon!"
  );
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [currentUser, setCurrentUser] = useState<TeamMember | null>(null);

  const [notifications, setNotifications] = useState<InAppNotification[]>(INITIAL_NOTIFICATIONS);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Design user interface",
      description: "Create wireframes and design system",
      status: "To Do",
      assignee: "You",
    },
    {
      id: "2",
      title: "Set up database",
      description: "Configure MongoDB and create schemas",
      status: "To Do",
      assignee: "You",
    },
    {
      id: "3",
      title: "Implement authentication",
      description: "Add user login and registration",
      status: "To Do",
      assignee: "You",
    },
    {
      id: "4",
      title: "Create landing page",
      description: "Design and implement the landing page",
      status: "To Do",
      assignee: "You",
    },
  ]);

  const [deadline, setDeadline] = useState<Date | null>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );

  const [hackathonEndTime, setHackathonEndTime] = useState<Date | null>(null);

  // ------------------- Initialize Auth & Notifications from localStorage -------------------
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAuth = localStorage.getItem("isAuthenticated");
      const savedUser = localStorage.getItem("currentUser");
      const savedNotifications = localStorage.getItem("appNotifications");

      if (savedAuth === "true") {
        setIsAuthenticated(true);
      }

      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }

      if (savedNotifications) {
        try {
          setNotifications(JSON.parse(savedNotifications));
        } catch {
          setNotifications(INITIAL_NOTIFICATIONS);
        }
      }

      setIsInitialized(true);
    }
  }, []);

  // ------------------- Sync Auth State -------------------
  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      if (isAuthenticated) {
        localStorage.setItem("isAuthenticated", "true");
      } else {
        localStorage.removeItem("isAuthenticated");
      }
    }
  }, [isAuthenticated, isInitialized]);

  // ------------------- Sync Notifications State -------------------
  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      localStorage.setItem("appNotifications", JSON.stringify(notifications));
    }
  }, [notifications, isInitialized]);

  // ------------------- Notification Helpers -------------------
  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const addNotification = (
    notification: Omit<InAppNotification, "id" | "timestamp" | "read">
  ) => {
    const newNotif: InAppNotification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: "Just now",
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // ------------------- Hackathon Timer Persistence -------------------
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEndTime = localStorage.getItem("hackathonEndTime");
      const storedDeadline = localStorage.getItem("projectDeadline");

      if (storedDeadline) {
        const deadlineDate = new Date(storedDeadline);
        setDeadline(deadlineDate);
        setHackathonEndTime(deadlineDate);
      } else if (storedEndTime) {
        setHackathonEndTime(new Date(storedEndTime));
      } else {
        const defaultEndTime = new Date(Date.now() + 48 * 60 * 60 * 1000);
        setHackathonEndTime(defaultEndTime);
        localStorage.setItem("hackathonEndTime", defaultEndTime.toISOString());
      }
    }
  }, []);

  useEffect(() => {
    if (hackathonEndTime && typeof window !== "undefined") {
      localStorage.setItem("hackathonEndTime", hackathonEndTime.toISOString());
    }
  }, [hackathonEndTime]);

  // ------------------- Auth Functions -------------------
  const login = (username: string, password: string) => {
    console.log(`Logging in as ${username}`);

    const user = {
      id: `user-${Date.now()}`,
      name: username,
      role: "Team Member",
      avatar: `https://placehold.co/200x200/1e293b/38bdf8?text=${username
        .charAt(0)
        .toUpperCase()}`,
    };

    setCurrentUser(user);
    setIsAuthenticated(true);

    if (typeof window !== "undefined") {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("currentUser", JSON.stringify(user));
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);

    if (typeof window !== "undefined") {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("currentUser");
    }
  };

  // ------------------- Tasks & Team -------------------
  const addTask = (task: Task) => {
    setTasks((prev) => [...prev, task]);
    // Automatically trigger task assignment notification
    addNotification({
      category: "task_assigned",
      title: "Task Assigned",
      message: `New task added: "${task.title}".`,
      actionUrl: "/tasks",
    });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const addTeamMember = (member: Omit<TeamMember, "id">) => {
    const newMember = { ...member, id: `member-${Date.now()}` };
    setTeamMembers((prev) => [...prev, newMember]);
    // Automatically trigger team join notification
    addNotification({
      category: "team_membership",
      title: "Team Member Added",
      message: `${member.name} joined as ${member.role}.`,
      actionUrl: "/team",
    });
  };

  // ------------------- Deadlines -------------------
  const updateDeadline = (date: Date | null) => {
    setDeadline(date);
    if (date) {
      setHackathonEndTime(date);
      if (typeof window !== "undefined") {
        localStorage.setItem("projectDeadline", date.toISOString());
        localStorage.setItem("hackathonEndTime", date.toISOString());
      }
      addNotification({
        category: "task_deadline",
        title: "Project Deadline Updated",
        message: `Your hackathon deadline is set to ${date.toLocaleDateString()}.`,
        actionUrl: "/dashboard",
      });
    }
  };

  const resetHackathonTimer = () => {
    const newEndTime = new Date(Date.now() + 48 * 60 * 60 * 1000);
    setHackathonEndTime(newEndTime);
    setDeadline(newEndTime);
    if (typeof window !== "undefined") {
      localStorage.setItem("hackathonEndTime", newEndTime.toISOString());
      localStorage.setItem("projectDeadline", newEndTime.toISOString());
    }
  };

  // ------------------- Context Value -------------------
  const value = {
    isAuthenticated,
    setIsAuthenticated,
    login,
    logout,
    isInitialized,
    teamName,
    setTeamName,
    teamBio,
    setTeamBio,
    teamMembers,
    setTeamMembers,
    addTeamMember,
    currentUser,
    setCurrentUser,
    tasks,
    setTasks,
    addTask,
    updateTask,
    deadline,
    setDeadline: updateDeadline,
    hackathonEndTime,
    setHackathonEndTime,
    resetHackathonTimer,
    notifications,
    unreadNotificationCount,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

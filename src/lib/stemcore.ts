import EventEmitter from './eventEmitter';
import { v4 as uuidv4 } from 'uuid';

// Custom API class with fetch wrappers
class API {
  private static apiKey: string;

  public static setApiKey(apiKey: string): void {
    API.apiKey = apiKey;
  }

  public static async get(url: string): Promise<any> {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${url}`);
    }
    return response.json();
  }

  public static async post(url: string, data: any): Promise<any> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error(`Failed to post data to ${url}`);
    }
    return response.json();
  }

  public static async patch(url: string, data: any): Promise<any> {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${API.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error(`Failed to patch data to ${url}`);
    }
    return response.json();
  }
}

// Type definitions
interface User {
  id: string;
  username: string;
  email: string;
  profile: UserProfile;
  learning_paths: LearningPath[];
  achievements: Achievement[];
}

interface UserProfile {
  display_name: string;
  bio: string;
  avatar_url: string;
  connected_platforms: ConnectedPlatform[];
  domain_expertise: DomainExpertise[];
}

interface ConnectedPlatform {
  platform: string;
  username: string;
  profile_url: string;
  connected_at: Date;
}

interface DomainExpertise {
  domain_path: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  progress: number;
  completed_topics: string[];
}

interface LearningPath {
  id: string;
  user_id: string;
  domains: string[];
  progress: number;
  created_at: Date;
  updated_at: Date;
}

interface Achievement {
  id: string;
  type: 'badge' | 'certificate' | 'milestone';
  title: string;
  description: string;
  domain_path?: string;
  awarded_at: Date;
}

interface ForumPost {
  id: string;
  author_id: string;
  domain_path: string;
  title: string;
  content: string;
  tags: string[];
  created_at: Date;
  updated_at: Date;
}

class StemCore extends EventEmitter {
  private static instance: StemCore;
  private static currentUser: User | null = null;
  private static domainTaxonomy: any = null; // Cache for domain taxonomy

  private constructor() {
    super();
    // Set up event listeners for real-time updates
    StemCore.setupWebSocket();
  }

  public static getInstance(): StemCore {
    if (!StemCore.instance) {
      StemCore.instance = new StemCore();
    }
    return StemCore.instance;
  }

  public static async getUserActivity(): Promise<any[]> {
    if (!this.currentUser) {
      throw new Error('User is not authenticated');
    }
    try {
      return await API.get(`/users/${this.currentUser.id}/activity`);
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  public static async getUserPeerGroups(): Promise<any[]> {
    if (!this.currentUser) {
      throw new Error('User is not authenticated');
    }
    try {
      return await API.get(`/users/${this.currentUser.id}/peer-groups`);
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  public static async getUserNotifications(): Promise<any[]> {
    if (!this.currentUser) {
      throw new Error('User is not authenticated');
    }
    try {
      return await API.get(`/users/${this.currentUser.id}/notifications`);
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  // Add this method to the StemCore class
  public static async getUserProgress(domainPath: string): Promise<any> {
    if (!this.currentUser) {
        throw new Error('User is not authenticated');
    }
    try {
        return await API.get(`/users/${this.currentUser.id}/progress?domainPath=${encodeURIComponent(domainPath)}`);
    } catch (error) {
        this.emit('error', error);
        throw error;
    }
  }
  
  public static async getLearningPathStructure(domainPath: string): Promise<any> {
    if (!this.currentUser) {
        throw new Error('User is not authenticated');
    }
    try {
        return await API.get(`/learning-paths/structure?domainPath=${encodeURIComponent(domainPath)}`);
    } catch (error) {
        this.emit('error', error);
        throw error;
    }
}
  // Authentication and User Management
  public static async login(email: string, password: string): Promise<User> {
    try {
      const data = await API.post('/auth/login', { email, password });
      this.currentUser = data.user;
      this.emit('user:login', this.currentUser);
      return this.currentUser;
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  // Profile Management
  public static async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    if (!this.currentUser) {
      throw new Error('User is not authenticated');
    }
    try {
      const data = await API.patch('/user/profile', profileData);
      this.currentUser.profile = data;
      this.emit('profile:update', data);
      return data;
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  // Platform Integrations
  public static async connectPlatform(platform: string, authToken: string): Promise<ConnectedPlatform> {
    if (!this.currentUser) {
      throw new Error('User is not authenticated');
    }
    try {
      const data = await API.post('/integrations/connect', { platform, auth_token: authToken });
      this.emit('platform:connect', data);
      return data;
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  // Learning Paths
  public static async createLearningPath(domains: string[]): Promise<LearningPath> {
    if (!this.currentUser) {
      throw new Error('User is not authenticated');
    }
    try {
      const data = await API.post('/learning-paths', {
        user_id: this.currentUser.id,
        domains,
        created_at: new Date()
      });
      this.emit('learning-path:create', data);
      return data;
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  // Fetch related posts based on the active context
  public static async getRelatedPosts(context: any): Promise<any[]> {
    if (!this.currentUser) {
      throw new Error('User is not authenticated');
    }
    try {
      return await API.get(`/posts/related?context=${context.id}`);
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  // Search for related posts based on user message
  public static async searchRelatedPosts(userMessage: string): Promise<any[]> {
    if (!this.currentUser) {
      throw new Error('User is not authenticated');
    }
    try {
      return await API.get(`/posts/search?query=${userMessage}`);
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  // Get AI response based on user message and context
  public static async getAIResponse(data: { context: any; message: string; chatHistory: any[] }): Promise<any> {
    if (!this.currentUser) {
      throw new Error('User is not authenticated');
    }
    try {
      return await API.post('/ai/respond', data);
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }
  
  // Community and Forums
  public static async createForumPost(post: Omit<ForumPost, 'id' | 'author_id' | 'created_at'>): Promise<ForumPost> {
    if (!this.currentUser) {
      throw new Error('User is not authenticated');
    }
    try {
      const data = await API.post('/forum/posts', {
        ...post,
        author_id: this.currentUser.id,
        created_at: new Date()
      });
      this.emit('forum:post:create', data);
      return data;
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  // Achievements and Gamification
  public static async awardAchievement(achievement: Omit<Achievement, 'id' | 'awarded_at'>): Promise<Achievement> {
    if (!this.currentUser) {
      throw new Error('User is not authenticated');
    }
    try {
      const data = await API.post('/achievements/award', {
        ...achievement,
        id: uuidv4(),
        awarded_at: new Date()
      });
      this.emit('achievement:award', data);
      return data;
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  // Domain Taxonomy
  public static async getDomainTaxonomy(): Promise<any> {
    if (!this.currentUser) {
      throw new Error('User is not authenticated');
    }
    if (this.domainTaxonomy) {
      return this.domainTaxonomy;
    }

    try {
      this.domainTaxonomy = await API.get('/domains/taxonomy');
      return this.domainTaxonomy;
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  // WebSocket Setup for Real-time Updates
  private static setupWebSocket(): void {
    // Implementation would depend on your WebSocket library choice
    // This is a placeholder for the real-time functionality
    this.on('websocket:message', (message: any) => {
      switch (message.type) {
        case 'achievement':
          this.emit('achievement:new', message.data);
          break;
        case 'forum_reply':
          this.emit('forum:reply', message.data);
          break;
        case 'learning_update':
          this.emit('learning:update', message.data);
          break;
        // Add more real-time event handlers as needed
      }
    });
  }

  // Utility Methods
  public static getCurrentUser(): User | null {
    return StemCore.currentUser;
  }

  public static isAuthenticated(): boolean {
    return StemCore.currentUser !== null;
  }

  public static async refreshToken(): Promise<void> {
    if (!this.currentUser) {
      throw new Error('User is not authenticated');
    }
    try {
      const data = await API.post('/auth/refresh', {});
      API.setApiKey(data.token);
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  // Mark a notification as read
  public static async markNotificationRead(notificationId: string): Promise<void> {
    if (!this.currentUser) {
      throw new Error('User is not authenticated');
    }
    try {
      await API.post(`/notifications/${notificationId}/read`, {});
      this.emit('notification:read', notificationId);
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }
}

export default StemCore;
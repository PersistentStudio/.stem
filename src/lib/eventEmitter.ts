// Simple EventEmitter for browser
export default class EventEmitter {
    private static listeners: Record<string, Function[]> = {};
  
    static on(event: string, listener: Function): void {
      if (!EventEmitter.listeners[event]) {
        EventEmitter.listeners[event] = [];
      }
      EventEmitter.listeners[event].push(listener);
    }
  
    static off(event: string, listener: Function): void {
      if (!EventEmitter.listeners[event]) return;
      const index = EventEmitter.listeners[event].indexOf(listener);
      if (index > -1) {
        EventEmitter.listeners[event].splice(index, 1);
      }
    }
  
    static emit(event: string, ...args: any[]): void {
      if (!EventEmitter.listeners[event]) return;
      EventEmitter.listeners[event].forEach(listener => listener(...args));
    }
  }
  
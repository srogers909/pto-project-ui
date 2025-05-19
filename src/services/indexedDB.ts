import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface MapAppDB extends DBSchema {
  mapState: {
    key: string;
    value: {
      zoom: number;
      position: { x: number, y: number };
      lastUpdated: number;
    };
  };
  userSettings: {
    key: string;
    value: {
      theme: string;
      showControls: boolean;
      lastUpdated: number;
    };
  };
}

const DB_NAME = 'map-app-db';
const DB_VERSION = 1;

export class IndexedDBService {
  private dbPromise: Promise<IDBPDatabase<MapAppDB>>;

  constructor() {
    this.dbPromise = openDB<MapAppDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Create stores
        if (!db.objectStoreNames.contains('mapState')) {
          db.createObjectStore('mapState');
        }
        if (!db.objectStoreNames.contains('userSettings')) {
          db.createObjectStore('userSettings');
        }
      },
    });
  }

  async getMapState(key: string) {
    return (await this.dbPromise).get('mapState', key);
  }

  async setMapState(key: string, value: any) {
    return (await this.dbPromise).put('mapState', value, key);
  }

  async getUserSetting(key: string) {
    return (await this.dbPromise).get('userSettings', key);
  }

  async setUserSetting(key: string, value: any) {
    return (await this.dbPromise).put('userSettings', value, key);
  }

  async deleteMapState(key: string) {
    return (await this.dbPromise).delete('mapState', key);
  }

  async deleteUserSetting(key: string) {
    return (await this.dbPromise).delete('userSettings', key);
  }

  async clearAllData() {
    const db = await this.dbPromise;
    await db.clear('mapState');
    await db.clear('userSettings');
  }
}

export const indexedDBService = new IndexedDBService();

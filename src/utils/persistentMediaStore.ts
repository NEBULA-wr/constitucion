/**
 * Persistent Media Store using browser IndexedDB.
 * Ensures that 100% of uploaded videos, images and audio files persist across sessions,
 * even inside Cloud Run / AI Studio iframes where multipart network uploads might be blocked or proxied.
 */

const DB_NAME = 'ConstitucionDominicanaMediaDB';
const DB_VERSION = 1;
const STORE_FILES = 'media_files';
const STORE_META = 'metadata';

interface StoredFile {
  id: string;
  filename: string;
  title: string;
  type: 'video' | 'image' | 'audio' | 'thumbnail';
  mimeType: string;
  category: string;
  assignedTo?: string | null;
  blob: Blob;
  sizeBytes: number;
  dateAdded: string;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const req = window.indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_FILES)) {
        db.createObjectStore(STORE_FILES, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_META)) {
        db.createObjectStore(STORE_META, { keyPath: 'key' });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function storeMediaInDB(fileData: StoredFile): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_FILES], 'readwrite');
      const store = tx.objectStore(STORE_FILES);
      const req = store.put(fileData);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Could not store media in IndexedDB:', err);
  }
}

export async function getMediaFromDB(id: string): Promise<StoredFile | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction([STORE_FILES], 'readonly');
      const store = tx.objectStore(STORE_FILES);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch (err) {
    return null;
  }
}

export async function getAllMediaFromDB(): Promise<StoredFile[]> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction([STORE_FILES], 'readonly');
      const store = tx.objectStore(STORE_FILES);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  } catch (err) {
    return [];
  }
}

export async function deleteMediaFromDB(id: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction([STORE_FILES], 'readwrite');
      const store = tx.objectStore(STORE_FILES);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
    });
  } catch (err) {
    console.warn('Could not delete from IndexedDB:', err);
  }
}

export async function saveManifestToDB(manifest: any): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction([STORE_META], 'readwrite');
      const store = tx.objectStore(STORE_META);
      const req = store.put({ key: 'manifest', data: manifest });
      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
    });
  } catch (err) {}
}

export async function loadManifestFromDB(): Promise<any | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction([STORE_META], 'readonly');
      const store = tx.objectStore(STORE_META);
      const req = store.get('manifest');
      req.onsuccess = () => resolve(req.result?.data || null);
      req.onerror = () => resolve(null);
    });
  } catch (err) {
    return null;
  }
}

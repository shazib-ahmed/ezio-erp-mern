import CryptoJS from 'crypto-js';
import { get, set, del } from 'idb-keyval';

const SECRET_KEY = process.env.REACT_APP_STORAGE_KEY || 'ezio-erp-secure-storage-key-123';

/**
 * Encrypts and saves data to IndexedDB
 */
export const saveSecureData = async (key: string, data: any) => {
  try {
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
    await set(key, encrypted);
  } catch (error) {
    console.error('Secure storage error:', error);
  }
};

/**
 * Retrieves and decrypts data from IndexedDB
 */
export const getSecureData = async (key: string) => {
  try {
    const encrypted = await get(key);
    if (!encrypted) return null;

    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('Secure retrieval error:', error);
    return null;
  }
};

/**
 * Removes data from IndexedDB
 */
export const removeSecureData = async (key: string) => {
  try {
    await del(key);
  } catch (error) {
    console.error('Secure removal error:', error);
  }
};

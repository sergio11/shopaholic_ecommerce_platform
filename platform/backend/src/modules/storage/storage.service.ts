export const STORAGE_SERVICE = 'STORAGE_SERVICE';

export interface IStorageService {
    saveFile(file: Buffer, contentType: string): Promise<{ id: string; url: string }>;
    updateFile(id: string, newFile: Buffer, contentType: string): Promise<{ id: string; url: string }>;
    deleteFile(id: string): Promise<void>;
}
  
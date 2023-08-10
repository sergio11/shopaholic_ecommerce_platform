export const STORAGE_SERVICE = 'STORAGE_SERVICE';

export interface IStorageService {
    saveFile(file: Buffer, contentType: String): Promise<string>;
}
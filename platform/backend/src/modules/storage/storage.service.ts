export const STORAGE_SERVICE = 'STORAGE_SERVICE';

export interface IStorageService {
    saveFile(file: Buffer, fileName: string, contentType: String): Promise<string>;
}
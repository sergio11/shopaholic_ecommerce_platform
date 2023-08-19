/**
 * Constant representing the identifier for the storage service.
 */
export const STORAGE_SERVICE = 'STORAGE_SERVICE';

/**
 * Interface for defining storage service methods.
 */
export interface IStorageService {
  /**
   * Saves a file to the storage service.
   * @param {Buffer} file - The content of the file.
   * @param {string} contentType - The content type of the file.
   * @param {number} length - The length of the file.
   * @returns {Promise<{ id: string; url: string }>} - The information about the saved file.
   */
  saveFile(file: Buffer, contentType: string, length: number): Promise<{ id: string; url: string }>;

  /**
   * Updates an existing file in the storage service.
   * @param {string} id - The ID of the file to update.
   * @param {Buffer} newFile - The new content of the file.
   * @param {string} contentType - The content type of the file.
   * @param {number} length - The length of the file.
   * @returns {Promise<{ id: string; url: string }>} - The information about the updated file.
   */
  updateFile(id: string, newFile: Buffer, contentType: string, length: number): Promise<{ id: string; url: string }>;

  /**
   * Deletes a file from the storage service.
   * @param {string} id - The ID of the file to delete.
   * @returns {Promise<void>}
   */
  deleteFile(id: string): Promise<void>;
}

  
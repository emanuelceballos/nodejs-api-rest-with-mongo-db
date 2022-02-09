import { IFileService } from '../core/serviceInterfaces/IFileService';
import { provideSingleton } from '../util/provideSingleton';

// Replaces @injectable()
@provideSingleton(FileService)
export class FileService implements IFileService {

    upload(): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
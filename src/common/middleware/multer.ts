import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

export const multerConfig = (folderName: string) => ({
  storage: diskStorage({
    destination: (req: any, file: any, callback: any) => {
      const uploadPath = `./uploads/${folderName}`;
      // Create directory if it doesn't exist
      fs.mkdirSync(uploadPath, { recursive: true });
      callback(null, uploadPath);
    },
    filename: (req: any, file: any, callback: any) => {
      const fileExtName = extname(file.originalname);
      const randomName = Date.now();
      callback(null, `${randomName}${fileExtName}`);
    },
  }),
});

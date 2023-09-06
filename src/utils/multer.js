import multer from 'multer';
import { resolve } from 'path';

const storage = multer.diskStorage({
   destination(req, file, cb)
   {
      let route = '';

      switch (file.fieldname)
      {
         case 'profile':
            route = '/src/presentation/public/profiles';
         break;

         case 'product':
            route = '/src/presentation/public/products';
         break;

         case 'document':
            route = '/src/presentation/public/documents';
         break;

         default:
            break;
      }

      cb(null, resolve() + route);
   },
   filename(req, file, cb)
   {
      const uniqueSuffix = Math.round(Math.random() * 1E9);
      cb(null, `${uniqueSuffix}-${file.originalname}`);
   }
});

export const upload = multer({ storage });

// Extend Request type to access Multer file
declare namespace Express {
  export interface Request {
    file?: Express.Multer.File;
  }
}

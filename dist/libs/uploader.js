"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploader = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = require("path");
const uploader = (filePrefix, folderName, filelimit) => {
    const defaultDir = (0, path_1.join)(__dirname, '../../public');
    const storage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            const destination = folderName ? defaultDir + folderName : defaultDir;
            cb(null, destination);
        },
        filename: (req, file, callback) => {
            const originalNameParts = file.originalname.split('.');
            const fileExtension = originalNameParts[originalNameParts.length - 1];
            const newFileName = filePrefix + Date.now() + '.' + fileExtension;
            callback(null, newFileName);
        },
    });
    const fileFilter = (req, file, cb) => {
        const extAllowed = /\.(jpg|jpeg|png|webp|avif)$/;
        const isExtMatch = file.originalname.toLowerCase().match(extAllowed);
        if (isExtMatch) {
            cb(null, true);
        }
        else {
            const error = new Error('Your file extenstion is denied');
            cb(null, false);
            cb(error);
        }
    };
    const limits = { fileSize: filelimit || 5 * 1024 * 1024 };
    return (0, multer_1.default)({ storage, fileFilter, limits });
};
exports.uploader = uploader;

import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Directory for payment slips
const PAYMENT_SLIPS_DIR = './uploads/payment-slips';
// Directory for profile images
const PROFILE_IMAGES_DIR = './uploads/profile-images';

// Auto-create directories if they don't exist
if (!fs.existsSync(PAYMENT_SLIPS_DIR)) {
  fs.mkdirSync(PAYMENT_SLIPS_DIR, { recursive: true });
}
if (!fs.existsSync(PROFILE_IMAGES_DIR)) {
  fs.mkdirSync(PROFILE_IMAGES_DIR, { recursive: true });
}

// Storage for payment slips
const paymentSlipStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(PAYMENT_SLIPS_DIR)) {
      fs.mkdirSync(PAYMENT_SLIPS_DIR, { recursive: true });
    }
    cb(null, PAYMENT_SLIPS_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'slip-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Storage for profile images
const profileImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(PROFILE_IMAGES_DIR)) {
      fs.mkdirSync(PROFILE_IMAGES_DIR, { recursive: true });
    }
    cb(null, PROFILE_IMAGES_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for payment slips
const paymentSlipFileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, PNG, and PDF are allowed.'), false);
  }
};

// File filter for profile images
const profileImageFileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, and PNG are allowed.'), false);
  }
};

const uploadSlip = multer({
  storage: paymentSlipStorage,
  fileFilter: paymentSlipFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  }
});

const uploadProfileImage = multer({
  storage: profileImageStorage,
  fileFilter: profileImageFileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB max
  }
});

export { uploadSlip, uploadProfileImage };

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const port = 3000;

// Set storage engine for file uploads
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single('image');

// Check file type
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|gif/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for file upload form
app.get('/', (req, res) => {
  fs.readdir('./public/uploads/', (err, files) => {
    let images = '';
    files.forEach(file => {
      images += `<img src="/uploads/${file}" style="max-width: 300px; padding: 20px;">`;
    });
    res.send(`
      <form action="/upload-image" method="post" enctype="multipart/form-data">
        <input type="file" name="image">
        <input type="submit" value="Upload Image">
      </form>
      ${images}
    `);
  });
});

// Route for handling file uploads
app.post('/upload-image', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.send(err);
    } else {
      if (req.file == undefined) {
        res.send('Error: No File Selected!');
      } else {
        // Resize image using "convert" utility
        exec(`convert ./public/uploads/${req.file.filename} -resize 100x100 ./public/uploads/resized-${req.file.filename}`);
        res.redirect('/');
      }
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

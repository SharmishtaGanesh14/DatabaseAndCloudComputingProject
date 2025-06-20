// const express = require('express');
// const mysql = require('mysql2');
// const cors = require('cors');
// const path = require('path'); // ✅ Make sure this is declared BEFORE using it

// const app = express();
// const PORT = 3000;

// app.use(express.static(path.join(__dirname, 'public'))); // ✅ Correct usage
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // MySQL connection
// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'password',
//   database: 'SciVault'
// });

// connection.connect(err => {
//   if (err) {
//     console.error('Database connection failed:', err.stack);
//     process.exit(1);
//   }
//   console.log('Connected to database.');
// });

// // Middleware
// app.use(cors());
// app.use(express.json());

// // ====================
// // Routes
// // ====================

// // Read all users
// app.get('/read', (req, res) => {
//   connection.query('SELECT * FROM Users', (err, results) => {
//     if (err) return res.status(500).send('Database error');
//     res.json(results);
//   });
// });

// app.post('/create', (req, res) => {
//     const { username, email, password, institution = null, usertype } = req.body;
  
//     // Validate required fields
//     if (!username || !email || !password || !usertype) {
//       return res.status(400).send('Missing required fields');
//     }
  
//     // Validate enum
//     const validUserTypes = ['researcher', 'submitter'];
//     if (!validUserTypes.includes(usertype)) {
//       return res.status(400).send('Invalid user type. Must be Researcher or Submitter.');
//     }
  
//     const sql = `
//       INSERT INTO Users (UserName, Email, Password, Institution, UserType, CreationDate)
//       VALUES (?, ?, ?, ?, ?, CURDATE())
//     `;
  
//     connection.query(sql, [username, email, password, institution, usertype], (err) => {
//       if (err) {
//         console.error('Insert error:', err);
//         return res.status(500).send(err.sqlMessage || 'Database error');
//       }
//       res.status(201).send('User registered successfully');
//     });
//   });
  
// const multer = require('multer');
// const fs = require('fs');

// const uploadDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// const storage = multer.diskStorage({
// destination: (req, file, cb) => cb(null, uploadDir),
// filename: (req, file, cb) => {
//     const uniqueName = `${Date.now()}-${file.originalname}`;
//     req.generatedFileName = uniqueName; // Save for later
//     cb(null, uniqueName);
//   }  
// });

// const upload = multer({ storage });

// app.post('/upload', upload.single('file'), (req, res) => {
//     const { title, description, category, user } = req.body;
//     if (!req.file) return res.status(400).send('No file uploaded.');
  
//     // Get user ID
//     connection.query('SELECT UserID FROM Users WHERE Email = ?', [user], (err, result) => {
//       if (err || result.length === 0) {
//         console.error('Submitter not found:', err);
//         return res.status(400).send('Invalid submitter');
//       }
  
//       const submitterID = result[0].UserID;
  
//       // Get category ID
//       connection.query('SELECT CategoryID FROM Categories WHERE CategoryName = ?', [category], (err2, result2) => {
//         if (err2 || result2.length === 0) {
//           console.error('Category not found:', err2);
//           return res.status(400).send('Invalid category');
//         }
  
//         const categoryID = result2[0].CategoryID;
  
//         const sql = `
//           INSERT INTO DataFiles 
//             (SubmitterID, FileName, FileType, FileSize, SubmitDate, CategoryID, FilePath, Description, LastModifiedDate)
//           VALUES (?, ?, ?, ?, CURDATE(), ?, ?, ?, CURDATE())
//         `;
  
//         const fileData = [
//             submitterID,
//             req.file.originalname, // ✅ original file name for download
//             path.extname(req.file.originalname).substring(1),
//             req.file.size,
//             categoryID,
//             req.generatedFileName, // ✅ saved filename with timestamp
//             description
//           ];
          
  
//         connection.query(sql, fileData, (err3) => {
//           if (err3) {
//             console.error('Error inserting file:', err3);
//             return res.status(500).send('Failed to store file metadata.');
//           }
  
//           res.send(`
//             <h2>Upload Successful</h2>
//             <p>File: ${req.file.originalname}</p>
//             <a href="index.html">Back to Home</a>
//           `);
//         });
//       });
//     });
//   });
  
//   app.get('/download-by-category/:categoryID', (req, res) => {
//     const categoryID = req.params.categoryID;
//     const researcherEmail = req.query.email;
  
//     if (!researcherEmail) return res.status(400).send('Missing researcher email');
  
//     connection.query(
//       "SELECT UserID FROM Users WHERE Email = ? AND UserType = 'Researcher'",
//       [researcherEmail],
//       (err, result) => {
//         if (err || result.length === 0) {
//           return res.status(403).send('Access denied: not a researcher');
//         }
  
//         const researcherID = result[0].UserID;
  
//         // Get the most recent file in that category
//         connection.query(
//           `SELECT * FROM DataFiles 
//            WHERE CategoryID = ?
//            ORDER BY SubmitDate DESC
//            LIMIT 1`,
//           [categoryID],
//           (err2, result2) => {
//             if (err2 || result2.length === 0) {
//               return res.status(404).send('No files found in this category');
//             }
  
//             const file = result2[0];
  
//             // Log access
//             const accessSql = `
//               INSERT INTO AccessBy (ResearcherID, FileID, AccessGrantedDate)
//               VALUES (?, ?, CURDATE())
//               ON DUPLICATE KEY UPDATE AccessGrantedDate = CURDATE()
//             `;
//             connection.query(accessSql, [researcherID, file.FileID]);
  
//             const fullPath = file.FilePath; // ✅ Use directly if FilePath is full
//             res.download(fullPath, file.FileName);
//           }
//         );
//       }
//     );
//   });
  
//   app.get('/download/:fileID', (req, res) => {
//     const fileID = req.params.fileID;
//     const researcherEmail = req.query.email; // sent from frontend
  
//     if (!researcherEmail) return res.status(400).send('Missing researcher email');
  
//     // Get researcher ID
//     connection.query(
//       "SELECT UserID FROM Users WHERE Email = ? AND UserType = 'Researcher'",
//       [researcherEmail],
//       (err, result) => {
//         const researcherID = result[0].UserID;
//         // Get file path
//         connection.query('SELECT FilePath, FileName FROM DataFiles WHERE FileID = ?', [fileID], (err2, result2) => {
//             if (err2 || result2.length === 0) {
//               return res.status(404).send('File not found');
//             }
          
//             const filePath = result2[0].FilePath; // full absolute path
//             const fileName = result2[0].FileName;
          
//             // Insert into AccessBy (if not already logged)
//             const accessSql = `
//               INSERT INTO AccessBy (ResearcherID, FileID, AccessGrantedDate)
//               VALUES (?, ?, CURDATE())
//               ON DUPLICATE KEY UPDATE AccessGrantedDate = CURDATE()
//             `;
          
//             connection.query(accessSql, [researcherID, fileID], (logErr) => {
//               if (logErr) {
//                 console.warn('Failed to log access:', logErr);
//               }
          
//               // Send the file
//               res.download(filePath, fileName, (downloadErr) => {
//                 if (downloadErr) {
//                   console.error('Download error:', downloadErr);
//                   res.status(500).send('Error downloading file.');
//                 }
//               });
//             });
//           });
          
//       }
//     );
//   });
  

// app.post('/login', (req, res) => {
// const { email, password } = req.body;

// if (!email || !password) {
//     return res.status(400).json({ message: 'Missing email or password' });
// }

// connection.query(
//     'SELECT * FROM Users WHERE Email = ? AND Password = ?',
//     [email, password],
//     (err, results) => {
//     if (err) {
//         console.error('Login error:', err);
//         return res.status(500).json({ message: 'Database error' });
//     }

//     if (results.length === 0) {
//         return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     const user = results[0];

//     // Update last login date
//     connection.query(
//         'UPDATE Users SET LastLoginDate = CURDATE() WHERE Email = ?',
//         [email],
//         (updateErr) => {
//         if (updateErr) {
//             console.warn('Failed to update LastLoginDate:', updateErr);
//         }
//         }
//     );

//     // Respond with user details
//     res.status(200).json({
//         message: 'Login successful',
//         user: {
//         id: user.UserID,
//         name: user.UserName,
//         email: user.Email,
//         usertype: user.UserType
//         }
//     });
//     }
// );
// });
  
  
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'SciVault'
});

connection.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    process.exit(1);
  }
  console.log('Connected to database.');
});

app.use(cors());
app.use(express.json());


// Routes


app.get('/read', (req, res) => {
  connection.query('SELECT * FROM Users', (err, results) => {
    if (err) return res.status(500).send('Database error');
    res.json(results);
  });
});

app.post('/create', (req, res) => {
  const { username, email, password, institution = null, usertype } = req.body;
  if (!username || !email || !password || !usertype) {
    return res.status(400).send('Missing required fields');
  }
  const validUserTypes = ['researcher', 'submitter'];
  if (!validUserTypes.includes(usertype)) {
    return res.status(400).send('Invalid user type. Must be Researcher or Submitter.');
  }
  const sql = `
    INSERT INTO Users (UserName, Email, Password, Institution, UserType, CreationDate)
    VALUES (?, ?, ?, ?, ?, CURDATE())
  `;
  connection.query(sql, [username, email, password, institution, usertype], (err) => {
    if (err) {
      console.error('Insert error:', err);
      return res.status(500).send(err.sqlMessage || 'Database error');
    }
    res.status(201).send('User registered successfully');
  });
});

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    req.tempFileName = file.originalname;
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
  const { title, description, category, user } = req.body;
  if (!req.file) return res.status(400).send('No file uploaded.');

  connection.query('SELECT UserID FROM Users WHERE Email = ?', [user], (err, result) => {
    if (err || result.length === 0) return res.status(400).send('Invalid submitter');
    const submitterID = result[0].UserID;

    connection.query('SELECT CategoryID FROM Categories WHERE CategoryName = ?', [category], (err2, result2) => {
      if (err2 || result2.length === 0) return res.status(400).send('Invalid category');
      const categoryID = result2[0].CategoryID;

      const sql = `
        INSERT INTO DataFiles 
          (SubmitterID, FileName, FileType, FileSize, SubmitDate, CategoryID, FilePath, Description, LastModifiedDate)
        VALUES (?, ?, ?, ?, CURDATE(), ?, '', ?, CURDATE())
      `;

      const fileData = [
        submitterID,
        req.tempFileName,
        path.extname(req.tempFileName).substring(1),
        req.file.size,
        categoryID,
        description
      ];

      connection.query(sql, fileData, (err3, results) => {
        if (err3) return res.status(500).send('Failed to store metadata');

        const fileID = results.insertId;
        const oldPath = path.join(uploadDir, req.tempFileName);
        const newFileName = `${fileID}-${req.tempFileName}`;
        const newPath = path.join(uploadDir, newFileName);

        fs.rename(oldPath, newPath, (renameErr) => {
          if (renameErr) return res.status(500).send('File rename error');

          connection.query('UPDATE DataFiles SET FilePath = ? WHERE FileID = ?', [newPath, fileID], (updateErr) => {
            if (updateErr) return res.status(500).send('Failed to update file path');

            res.send(`
              <h2>Upload Successful</h2>
              <p>File: ${req.tempFileName}</p>
              <a href="index.html">Back to Home</a>
            `);
          });
        });
      });
    });
  });
});

app.get('/download-by-category/:categoryID', (req, res) => {
    const categoryID = req.params.categoryID;
    const researcherEmail = req.query.email;
  
    if (!researcherEmail) {
      return res.status(400).send('Missing researcher email');
    }
  
    // Check if user is a Researcher
    connection.query(
      'SELECT UserID FROM Users WHERE Email = ? AND UserType = "Researcher"',
      [researcherEmail],
      (err, result) => {
        if (err || result.length === 0) {
          return res.status(403).send('Access denied');
        }
  
        const researcherID = result[0].UserID;
  
        // Get most recent file in the given category
        connection.query(
          'SELECT * FROM DataFiles WHERE CategoryID = ? ORDER BY SubmitDate DESC LIMIT 1',
          [categoryID],
          (err2, result2) => {
            if (err2 || result2.length === 0) {
              return res.status(404).send('No files found');
            }
  
            const file = result2[0];
  
            // Log researcher access
            connection.query(
              `INSERT INTO AccessBy (ResearcherID, FileID, AccessGrantedDate)
               VALUES (?, ?, CURDATE())
               ON DUPLICATE KEY UPDATE AccessGrantedDate = CURDATE()`,
              [researcherID, file.FileID]
            );
  
            // Download the file from the stored full path
            res.download(file.FilePath, file.FileName, (downloadErr) => {
              if (downloadErr) {
                console.error('Download error:', downloadErr);
                res.status(500).send('Error downloading file.');
              }
            });
          }
        );
      }
    );
  });
  
  app.get('/download/:fileID', (req, res) => {
    const fileID = req.params.fileID;
    const researcherEmail = req.query.email;
  
    if (!researcherEmail) {
      return res.status(400).send('Missing researcher email');
    }
  
    // Check if user is a Researcher
    connection.query(
      'SELECT UserID FROM Users WHERE Email = ? AND UserType = "Researcher"',
      [researcherEmail],
      (err, result) => {
        if (err || result.length === 0) {
          return res.status(403).send('Access denied');
        }
  
        const researcherID = result[0].UserID;
  
        // Get file path from DB
        connection.query(
          'SELECT FilePath, FileName FROM DataFiles WHERE FileID = ?',
          [fileID],
          (err2, result2) => {
            if (err2 || result2.length === 0) {
              return res.status(404).send('File not found');
            }
  
            const filePath = result2[0].FilePath;
            const fileName = result2[0].FileName;
  
            // Log researcher access
            connection.query(
              `INSERT INTO AccessBy (ResearcherID, FileID, AccessGrantedDate)
               VALUES (?, ?, CURDATE())
               ON DUPLICATE KEY UPDATE AccessGrantedDate = CURDATE()`,
              [researcherID, fileID],
              (logErr) => {
                if (logErr) {
                  console.warn('Access log error:', logErr);
                }
  
                // Download the file
                res.download(filePath, fileName, (downloadErr) => {
                  if (downloadErr) {
                    console.error('Download error:', downloadErr);
                    res.status(500).send('Error downloading file.');
                  }
                });
              }
            );
          }
        );
      }
    );
  });
  

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing email or password' });

  connection.query('SELECT * FROM Users WHERE Email = ? AND Password = ?', [email, password], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(401).json({ message: 'Invalid email or password' });

    const user = results[0];
    connection.query('UPDATE Users SET LastLoginDate = CURDATE() WHERE Email = ?', [email]);
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.UserID,
        name: user.UserName,
        email: user.Email,
        usertype: user.UserType
      }
    });
  });
});

app.use((req, res) => {
  res.status(404).send('Route not found');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
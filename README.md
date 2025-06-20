# DatabaseAndCloudComputingProject

SciVault

SciVault is a simple web application I built for managing and organizing scientific research data. It allows users to upload different types of datasets, like CSV files from experiments or clinical records, and makes it easier for researchers to access and browse these uploads. 

This project supports two kinds of users: Data Submitters and Researchers. Data Submitters can upload files, and Researchers (after being validated by an admin) can view or download the data for their studies.

Project Structure:

- public/ : This folder has all the frontend code, including HTML, CSS, and JavaScript files for the pages like login, upload, categories, and homepage.
- uploads/ : This is where uploaded CSV files are stored.
- server.js : The backend Express server handling uploads and routing.
- package.json : Lists backend dependencies.

Tech Stack:

- HTML, CSS, and JavaScript for the frontend
- Node.js and Express for the backend
- Multer for handling file uploads to the server
- Files are stored locally under the uploads folder

How to run it:

1. Make sure Node.js is installed.
2. Clone the repository and open the project folder.
3. Run 'npm install' to install the backend dependencies.
4. Start the server using 'node server.js'.
5. Open the HTML files in the browser (you can use Live Server for convenience).

Features:

- Upload support for files
- Basic role-based interface for Researchers and Data Submitters
- Clean and simple multi-page layout
- Example datasets are included in the uploads folder

Future Plans:

- Add proper user authentication and database support
- Search and filter datasets
- Enable data previews in the browser
- Add researcher approval workflow by admin

About Me:

I’m Sharmishta Ganesh, a Master's student in Big Data Biology. I built SciVault as part of my learning journey to bridge my biotech background with tech and data science. This project helped me understand both frontend and backend workflows in a real-world use case.


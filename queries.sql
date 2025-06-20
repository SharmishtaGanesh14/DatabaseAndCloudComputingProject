select * from SciVault.AccessBy;
select * from SciVault.Categories;
select * from SciVault.DataFiles;
select * from SciVault.Users;

-- ================================================
-- DATABASE: ResearchDataPlatform - Query Library
-- Purpose: Useful SQL queries for admin, users, analytics, and access control
-- ================================================
-- 1. How many times has each file been viewed?
SELECT 
    DataFiles.FileID,
    DataFiles.FileName,
    COUNT(AccessBy.ResearcherID) AS ViewCount
FROM 
    DataFiles
LEFT JOIN 
    AccessBy ON DataFiles.FileID = AccessBy.FileID
GROUP BY 
    DataFiles.FileID, DataFiles.FileName
ORDER BY 
    ViewCount DESC;

-- 2. Last access date for each file 
SELECT 
    DataFiles.FileID,
    DataFiles.FileName,
    MAX(AccessBy.AccessGrantedDate) AS LastAccessDate
FROM 
    DataFiles
LEFT JOIN 
    AccessBy ON DataFiles.FileID = AccessBy.FileID
GROUP BY 
    DataFiles.FileID, DataFiles.FileName
ORDER BY 
    LastAccessDate DESC;

-- 3. Which institution viewed the most files?
SELECT 
    Users.Institution,
    COUNT(*) AS TotalViews
FROM 
    AccessBy
JOIN 
    Users ON AccessBy.ResearcherID = Users.UserID
GROUP BY 
    Users.Institution
ORDER BY 
    TotalViews DESC
LIMIT 1;

-- 4. Number of files per category
SELECT 
    Categories.CategoryName,
    COUNT(DataFiles.FileID) AS NumFiles
FROM 
    Categories
LEFT JOIN 
    DataFiles ON Categories.CategoryID = DataFiles.CategoryID
GROUP BY 
    Categories.CategoryName
ORDER BY 
    NumFiles DESC;

-- 5. Number of files submitted by each submitter
SELECT 
    Users.UserName,
    COUNT(DataFiles.FileID) AS FilesSubmitted
FROM 
    Users
JOIN 
    DataFiles ON Users.UserID = DataFiles.SubmitterID
GROUP BY 
    Users.UserName
ORDER BY 
    FilesSubmitted DESC;
    
-- 6. Number of unique researchers who accessed files
SELECT 
    COUNT(DISTINCT ResearcherID) AS UniqueResearchers
FROM 
    AccessBy;

-- 7. Most popular file (by number of views/accesses)
SELECT 
    DataFiles.FileID, 
    DataFiles.FileName, 
    COUNT(AccessBy.ResearcherID) AS ViewCount
FROM 
    DataFiles
JOIN 
    AccessBy ON DataFiles.FileID = AccessBy.FileID
GROUP BY 
    DataFiles.FileID, DataFiles.FileName
ORDER BY 
    ViewCount DESC
LIMIT 1;


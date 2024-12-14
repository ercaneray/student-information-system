const sql = require('mssql');
const config = require('../config/sqlconfig.js');

// GET all Course
const getAllCourses = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query(`SELECT [CourseID]
      ,[CourseName]
      ,[Akts]
      ,[Semester]
      ,[Class]
      ,[RequiredCourseID]
	  ,D.DepartmentName
FROM Courses C LEFT JOIN Departments D ON C.DepartmentID = D.DepartmentID`);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
}
// Get Course by ID
const getCourseByID = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('CourseID', sql.Int, req.params.id)
            .query(`SELECT * FROM Courses 
            WHERE CourseID = @CourseID`
            );
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(404).send('An error occurred');
    }
}
// Get Course by DepartmentID
const getCourseByDepartmentID = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('DepartmentID', sql.Int, req.params.id)
            .query(`SELECT * FROM Courses 
            WHERE DepartmentID = @DepartmentID`
            );
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(404).send('An error occurred');
    }
}
// Get a student's courses by studentID
const getStudentCourses = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('StudentID', sql.Int, req.params.id)
            .query(`SELECT * FROM Courses 
            WHERE CourseID IN (
                SELECT CourseID FROM StudentCourse
                WHERE StudentID = @StudentID
            )`
            );
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(404).send('An error occurred');
    }

}
// Get pending approval courses by DepartmentID
const getPendingRequests = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('DepartmentID', sql.Int, req.params.id)
            .query(`SELECT CR.RequestID, CR.StudentID, S.FirstName, S.LastName, C.CourseName, CR.CourseID, C.Akts, CR.DepartmentID FROM CourseRequests CR
            JOIN Students S ON CR.StudentID = S.StudentID
            JOIN Courses C ON CR.CourseID = C.CourseID
            WHERE CR.DepartmentID = @DepartmentID`
            );
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(404).send('An error occurred');
    }

}
// Create Course
const createCourse = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('CourseID', sql.Int, req.body.CourseID)
            .input('CourseName', sql.VarChar, req.body.CourseName)
            .input('Akts', sql.Int, req.body.Akts)
            .query(`INSERT INTO Courses (CourseID, CourseName, Akts)
                VALUES (@CourseID, @CourseName, @Akts)`);
        res.status(201).json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
}
// Update Course
const updateCourse = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('CourseID', sql.Int, req.body.CourseID)
            .input('CourseName', sql.VarChar, req.body.CourseName)
            .input('Akts', sql.Int, req.body.Akts)
            .query(`UPDATE Courses
                SET CourseName = @CourseName, 
                    Akts = @Akts
                WHERE CourseID = @CourseID`
            );
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }

}
// Delete Course
const deleteCourse = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('CourseID', sql.Int, req.params.id)
            .query('DELETE FROM Courses WHERE CourseID = @CourseID');
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
}
// Request Approval
const requestApproval = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('StudentID', sql.Int, req.body.StudentID)
            .input('CourseID', sql.Int, req.body.CourseID)
            .input('DepartmentID', sql.Int, req.body.DepartmentID)
            .query(`INSERT INTO CourseRequests (StudentID, CourseID, DepartmentID)
                VALUES (@StudentID, @CourseID, @DepartmentID)`);
        if (result.rowsAffected[0] > 0) {
            res.status(201).json('Request sent successfully');
        } else {
            res.status(404).send('Request failed');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
}
// Approve Course Request
const approveRequest = async (req, res) => {
    try {
        let pool = await sql.connect(config);

        // Transaction başlat
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        // StudentCourse tablosuna ekleme yap
        await transaction.request()
            .input('StudentID', sql.Int, req.body.StudentID)
            .input('CourseID', sql.Int, req.body.CourseID)
            .query(`INSERT INTO StudentCourse (StudentID, CourseID) 
                VALUES (@StudentID, @CourseID)`);

        // CourseRequests tablosundan silme işlemi yap
        await transaction.request()
            .input('RequestID', sql.Int, req.body.RequestID)
            .query(`DELETE FROM CourseRequests
                WHERE RequestID = @RequestID`);

        // Eğer her şey başarılıysa transaction'ı commit et
        await transaction.commit();

        res.status(200).json('Course approved successfully');

    } catch (error) {
        // Bir hata oluşursa rollback yap
        if (transaction) await transaction.rollback();

        console.error(error);
        res.status(500).send('An error occurred');
    }
};
// Deny Course Request
const denyRequest = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('RequestID', sql.Int, req.params.id)
            .query(`DELETE FROM CourseRequests
                WHERE RequestID = @RequestID `);
        if (result.rowsAffected[0] > 0) {
            res.status(200).json('Course denied successfully');
        } else {
            res.status(404).send('Denial failed');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
}
// Check Request
const checkRequest = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('StudentID', sql.Int, req.params.id)
            .query(`SELECT * FROM CourseRequests
                WHERE StudentID = @StudentID`);
        if (result.recordset.length > 0) {
            res.status(201).json('Request found');
        } else {
            res.status(200).send('Request not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
}
module.exports = {
    getAllCourses,
    getCourseByID,
    getStudentCourses,
    getCourseByDepartmentID,
    getPendingRequests,
    createCourse,
    updateCourse,
    deleteCourse,
    requestApproval,
    approveRequest,
    denyRequest,
    checkRequest
}
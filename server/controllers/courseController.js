const sql = require('mssql');
const config = require('../config/sqlconfig.js');

// GET Bütün derleri getirme
const getAllCourses = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().execute('sp_GetAllCoursesWithDetails');
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
}
// Get ID'ye göre ders getirme
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
// GET Bölüm ID'ye göre ders getirme
const getCourseByDepartmentID = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('DepartmentID', sql.Int, req.params.id)
            .query(`SELECT * FROM GetCourseByDepartmentID (@DepartmentID)`
            );
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(404).send('An error occurred');
    }
}
// GET Öğrencinin aldığı dersleri getirme
const getStudentCourses = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('StudentID', sql.Int, req.params.id)
            .query(`SELECT
                        SC.StudentID,
                        SC.CourseID,
                        C.CourseName,
                        SC.Exam1Grade,
                        SC.Exam2Grade,
                        SC.LastLetterGrade,
                        C.Akts,
                        C.Semester,
                        C.Class
                    FROM
                        StudentCourse SC
                        JOIN Courses C ON SC.CourseID = C.CourseID
                        WHERE SC.StudentID = @StudentID
                    `);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(404).send('An error occurred');
    }

}
// GET Bölüm ID'ye göre onay bekleyen dersleri getirme
const getPendingRequests = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('DepartmentID', sql.Int, req.params.id)
            .execute('sp_GetCourseRequestsByDepartment')
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(404).send('An error occurred');
    }

}
// POST Ders oluşturma
const createCourse = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('CourseID', sql.Int, req.body.CourseID)
            .input('CourseName', sql.VarChar, req.body.CourseName)
            .input('Akts', sql.Int, req.body.Akts)
            .input('Semester', sql.Int, req.body.Semester)
            .input('Class', sql.Int, req.body.Class)
            .input('DepartmentID', sql.Int, req.body.DepartmentID)
            .query(`INSERT INTO Courses (CourseID, CourseName, Akts, Semester, Class, DepartmentID)
                VALUES (@CourseID, @CourseName, @Akts, @Semester, @Class, @DepartmentID)`);
        res.status(201).json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
}
// UPDATE Ders güncelleme
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
// UPDATE Öğrencinin aldığı dersin notlarını güncelleme
const updateCourseConnection = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()

            .input('CourseID', sql.Int, req.params.id)
            .input('StudentID', sql.Int, req.body.StudentID)
            .input('Exam1Grade', sql.Int, req.body.Exam1Grade)
            .input('Exam2Grade', sql.Int, req.body.Exam2Grade)
            .input('LastLetterGrade', sql.VarChar, req.body.LastLetterGrade)
            .query(`UPDATE StudentCourse
                SET Exam1Grade = @Exam1Grade,
                    Exam2Grade = @Exam2Grade,
                    LastLetterGrade = @LastLetterGrade
                WHERE CourseID = @CourseID AND StudentID = @StudentID`
            );
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }

}
// DELETE Ders silme
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
// POST Dersi onaya gönderme
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
// Ders onaylama
const approveRequest = async (req, res) => {
    const { requests } = req.body;

    let pool;
    const transaction = new sql.Transaction();

    try {
        pool = await sql.connect(config);
        await transaction.begin();

        for (const request of requests) {
            // StudentCourse tablosuna ekle
            await transaction.request()
                .input('StudentID', sql.Int, request.StudentID)
                .input('CourseID', sql.Int, request.CourseID)
                .query(`
                    INSERT INTO StudentCourse (StudentID, CourseID) 
                    VALUES (@StudentID, @CourseID)
                `);

            // CourseRequests tablosundan sil
            await transaction.request()
                .input('RequestID', sql.Int, request.RequestID)
                .query(`
                    DELETE FROM CourseRequests
                    WHERE RequestID = @RequestID
                `);
        }

        await transaction.commit();

        res.status(200).json({ message: 'Tüm istekler başarıyla onaylandı.' });
    } catch (error) {
        if (transaction._begun) await transaction.rollback();
        console.error('Transaction sırasında hata oluştu:', error);
        res.status(500).json({ message: 'Bir hata oluştu.', error: error.message });
    } finally {
        pool?.close();
    }
};



// Ders reddetme
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
// GET Öğrencinin ders talebini kontrol etme
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
    updateCourseConnection,
    deleteCourse,
    requestApproval,
    approveRequest,
    denyRequest,
    checkRequest
}
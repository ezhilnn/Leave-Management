const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ezhila47',
  database: 'LeaveManagementDB'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL Connected...');
});

// Fetch employee details by ID
app.get('/getEmployee/:id', (req, res) => {
  let sql = `SELECT * FROM Employees WHERE EmployeeID = ${req.params.id}`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// Submit a leave request
app.post('/submitLeave', (req, res) => {
  let leave = {
    EmployeeID: req.body.EmployeeID,
    LeaveType: req.body.LeaveType,
    Reason: req.body.Reason,
    StartDate: req.body.StartDate,
    EndDate: req.body.EndDate
  };

  let sql = 'INSERT INTO LeaveRequests SET ?';
  db.query(sql, leave, (err, result) => {
    if (err) throw err;
    res.send({ message: 'Leave request submitted' });
  });
});
// Update leave request status
// Update leave status
app.post('/updateLeaveStatus', (req, res) => {
  const requestID = req.body.requestID; // Use requestID from the request body
  const status = req.body.status;

  if (!requestID || !status) {
      return res.status(400).send({ success: false, message: 'Missing requestID or status' });
  }

  const sql = 'UPDATE LeaveRequests SET Status = ? WHERE RequestID = ?';
  db.query(sql, [status, requestID], (err, result) => {
      if (err) {
          console.error("Error updating leave status:", err);
          return res.status(500).send({ success: false, message: 'Error updating leave status' });
      }

      res.send({ success: true, message: 'Leave status updated' });
  });
});


app.get('/getAllLeaves1', (req, res) => {
  const sql = `SELECT LeaveRequests.RequestID, Employees.EmployeeName, LeaveRequests.LeaveType, LeaveRequests.Reason, LeaveRequests.StartDate, LeaveRequests.EndDate, LeaveRequests.Status 
               FROM LeaveRequests 
               INNER JOIN Employees ON LeaveRequests.EmployeeID = Employees.EmployeeID`;
  
  db.query(sql, (err, results) => {
      if (err) {
          console.error("Error fetching leave requests:", err);
          return res.status(500).send({ success: false, message: 'Error fetching leave requests' });
      }
      res.send(results); // Return results if no error
  });
});




// Get all leave requests for admin
app.get('/getAllLeaves', (req, res) => {
  let sql = 'SELECT Employees.EmployeeName, LeaveRequests.* FROM LeaveRequests INNER JOIN Employees ON LeaveRequests.EmployeeID = Employees.EmployeeID';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

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

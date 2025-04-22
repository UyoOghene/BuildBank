// const express = require('express');
// const bodyParser = require('body-parser');
// const ExcelJS = require('exceljs');
// const path = require('path');
// const { data } = require('./data');

// const app = express();
// app.set('view engine', 'ejs');
// app.use(express.static('public'));
// app.use(bodyParser.urlencoded({ extended: true }));

// // Home Page
// app.get('/', (req, res) => {
//   let income = 0;
//   let expenses = 0;

//   data.forEach(item => {
//     const total = item.amount;
//     if (item.type === 'income') income += total;
//     else expenses += total;
//   });
//   // data.forEach(item => {
//   //   const total = item.amount * item.quantity;
//   //   if (item.type === 'income') income += total;
//   //   else expenses += total;
//   // });

//   res.render('index', { data, income, expenses });
// });

// // Add Entry
// app.post('/add', (req, res) => {
//   const { description, amount, quantity, type } = req.body;
//   data.push({
//     description,
//     amount: parseFloat(amount),
//     quantity: parseInt(quantity),
//     type
//   });
//   res.redirect('/');
// });

// // Export to Excel
// app.get('/export', async (req, res) => {
//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet('Expenses');

//   worksheet.columns = [
//     { header: 'Description', key: 'description' },
//     { header: 'Amount', key: 'amount' },
//     { header: 'Quantity', key: 'quantity' },
//     { header: 'Type', key: 'type' }
//   ];

//   data.forEach(entry => worksheet.addRow(entry));

//   res.setHeader(
//     'Content-Type',
//     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//   );
//   res.setHeader('Content-Disposition', 'attachment; filename=expenses.xlsx');

//   await workbook.xlsx.write(res);
//   res.end();
// });

// app.listen(3000, () => {
//   console.log('App running on http://localhost:3000');
// });

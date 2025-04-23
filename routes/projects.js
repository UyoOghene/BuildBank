const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const ExcelJS = require('exceljs');

// Show all projects
router.get('/', async (req, res) => {
  const projects = await Project.find();
  res.render('projects/index', { projects });
});

// Create new project
router.get('/new', (req, res) => {
  res.render('projects/new');
});

router.post('/', async (req, res) => {
  const { name } = req.body;
  const project = new Project({ name });
  await project.save();
  res.redirect(`/projects/${project._id}`);
});

// View a project
router.get('/:id', async (req, res) => {
  const project = await Project.findById(req.params.id);
  const totalIncome = project.entries
    .filter(e => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);
  const totalExpenses = project.entries
    .filter(e => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);
  const balance = totalIncome - totalExpenses;
  res.render('projects/show', { project, totalIncome, totalExpenses, balance });
});

// Add entry
router.post('/:id/entries', async (req, res) => {
  const project = await Project.findById(req.params.id);
  project.entries.push(req.body);
  await project.save();
  res.redirect(`/projects/${project._id}`);
});

// Export to Excel
router.get('/:id/export', async (req, res) => {
  const project = await Project.findById(req.params.id);

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Entries');

  // Define columns
  sheet.columns = [
    { header: 'Description', key: 'description', width: 20 },
    { header: 'Floor', key: 'floor', width: 10 },
    { header: 'Amount', key: 'amount', width: 10 },
    { header: 'Type', key: 'type', width: 10 },
    { header: 'Comment', key: 'comment', width: 20 },
    { header: 'Bank', key: 'bank', width: 15 },
    { header: 'Date', key: 'createdAt', width: 20 },
  ];

  // Add all entry rows
  project.entries.forEach(entry => {
    sheet.addRow({
      description: entry.description,
      floor: entry.floor,
      amount: entry.amount,
      type: entry.type,
      comment: entry.comment,
      bank: entry.bank,
      createdAt: entry.createdAt.toLocaleString(),
    });
  });

  // Calculate totals
  const totalIncome = project.entries
    .filter(e => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpenses = project.entries
    .filter(e => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Add empty row then totals
  sheet.addRow([]);
  sheet.addRow(['', '', 'Total Income:', totalIncome]);
  sheet.addRow(['', '', 'Total Expenses:', totalExpenses]);
  sheet.addRow(['', '', 'Balance:', balance]);

  // Set headers and download
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=${project.name}-entries.xlsx`
  );
  await workbook.xlsx.write(res);
  res.end();
});

router.delete('/:id/entries/:entryId', async (req, res) => {
    const { id, entryId } = req.params;
    const project = await Project.findById(id);
  
    project.entries = project.entries.filter(entry => entry._id.toString() !== entryId);
    await project.save();
  
    res.redirect(`/projects/${id}`);
  });
  
    router.delete('/:id', async (req, res) => {
    await Project.findByIdAndDelete(req.params.id);
    res.redirect('/projects');
  });
    
module.exports = router;

const express = require('express');
const router = express.Router();
const controller = require('../controller/Cmain');


// add user 
router.post('/user', controller.post_user);

// add company 
router.post('/company', controller.post_company);

// add job posting
router.post('/job', controller.post_job);

// get Job posting list
router.get('/job', controller.get_job);

// delete job posting
router.delete('/job/:job_Id', controller.delete_job);

// patch Job posting
router.patch('/job/:job_Id', controller.patch_job);

// get Search job postings by keyword
router.get('/search/:keyword', controller.get_search);

// get detail page of job posting
router.get('/job/:job_id', controller.get_detail);

// apply Jop posting
router.post('/apply', controller.post_apply);

module.exports = router;

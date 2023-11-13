const { Job, Apply } = require('../models/');
const { User } = require('../models/');
const { Company } = require('../models/');
const { Op } = require('sequelize');

// show all job offer list
const get_job = async (req, res) => {
  try {

    const getAllJob = await Job.findAll({
      include: {
        model: Company,
        attributes: ["company_name", "company_country", "company_area"],
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "content", "company_id", "done"],
      },
      raw: true,
    });

    res.json({ data: getAllJob });
  } catch (error) {
    res.status(500).json({ error: "서버 에러" });
  }
};

// get 
const get_detail = async (req, res) => {
  try {
    const { job_id } = req.params;

    // Find the job by job_id
    const job = await Job.findByPk(job_id, {
      include: {
        model: Company,
        attributes: ["company_id", "company_name", "company_country", "company_area"]
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "done", "company_id"]
      }
    });

    if (job) {
      // Find other jobs with the same company_id
      const otherJobs = await Job.findAll({
        where: { company_id: job.Company.company_id }, // Use the company_id from the associated Company
        attributes: ["Job_id"],
        raw: true
      });

      const jobIds = otherJobs.map((otherJob) => otherJob.Job_id);
      
      // Remove the job_id that matches the parameter
      const filteredJobIds = jobIds.filter((id) => id !== parseInt(job_id));

      if (filteredJobIds.length > 0) {
        res.json({
          data: {
            ...job.toJSON(),
            otherJobs: filteredJobIds
          }
        });
      } else {
        res.json({
          data: {
            ...job.toJSON(),
            otherJobs: "같은 회사에서의 다른 작업 없음"
          }
        });
      }
    } else {
      res.status(404).json({ error: "해당 작업을 찾을 수 없음" });
    }
  } catch (error) {
    res.status(500).json({ error: "서버 에러" });
  }
};



// search to keyword in job posting 
const get_search = async (req, res) => {
  try {
    const { keyword } = req.params; // 파라미터로 전달된 검색어

    const jobsWithCompany = await Job.findAll({
      include: {
        model: Company,
        attributes: ["company_name", "company_country", "company_area"],
      },
      where: {
        [Op.or]: [
          { position: { [Op.like]: `%${keyword}%` } }, // 검색어가 position에 포함된 경우
          { content: { [Op.like]: `%${keyword}%` } }, // 검색어가 content에 포함된 경우
          { skill: { [Op.like]: `%${keyword}%` } }, // 검색어가 content에 포함된 경우
          { "$Company.company_name$": { [Op.like]: `%${keyword}%` } }, // 검색어가 content에 포함된 경우
          { "$Company.company_country$": { [Op.like]: `%${keyword}%` } }, // 검색어가 content에 포함된 경우
          { "$Company.company_area$": { [Op.like]: `%${keyword}%` } }, // 검색어가 content에 포함된 경우
          { compensation: { [Op.like]: `%${keyword}%` } }, // 검색어가 content에 포함된 경우
        ],
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "company_id", "done"],
      },
      raw: true,
    });

    res.json({ data: jobsWithCompany });
  } catch (error) {
    res.status(500).json({ error: "서버 에러" });
  }
};


// create a new job posting 
const post_job = async (req, res) => {
  const { company_id } = req.body;
  const { position } = req.body;
  const { compensation } = req.body;
  const { content } = req.body;
  const { skill } = req.body;
  
  const result = await Job.create({ 
    position : position,
    compensation : compensation,
    content : content,
    skill : skill,
    company_id : company_id
   });

  res.json({ data: result });
};

// create a new user
const post_user = async (req, res) => {
  const { name } = req.body;

  const result = await User.create({ user_name: name }); 

  res.json({ data: result });
};

// create a new company
const post_company = async (req, res) => {

  const { name } = req.body;
  const { country } = req.body;
  const { area } = req.body;

  const result = await Company.create({
    company_name: name,
    company_country: country,
    company_area: area
  });

  res.json({ data: result });
};

const post_apply = async (req, res) => {
  const { id } = req.body;
  const { Job_id } = req.body;

  const already = await Apply.findOne({
    where: {
      id: id,
      Job_id : Job_id
    }
  });

  if(already){
    res.json({
      result: false, message: "이미 지원한 공고입니다."
    });
    return;
  }

  const userapply = await Apply.create({
    id : id,
    Job_id : Job_id
  });

  res.json({data : userapply});

};


// edit a specific offer
const patch_job = (req, res) => {
  const { job_Id } = req.params;
  const { position } = req.body;
  const { compensation } = req.body;
  const { content } = req.body;
  const { skill } = req.body;

  Job.update({     
    position : position,
    compensation : compensation,
    content : content,
    skill : skill,
  }, { where: { Job_id: job_Id } }).then(() => {
    res.json({ result: true });
  });
};

// remove a specific offer
const delete_job = (req, res) => {
  const { job_Id } = req.params;

  Job.destroy({ where: { Job_id: job_Id } }).then(() => {
    res.json({ result: true });
  });
};





module.exports = { get_job, post_job, patch_job, delete_job, post_user, post_company, get_search, get_detail, post_apply };

const express = require('express');
const authMiddleware = require('../middlewares/auth');
const router = express.Router();

const Project = require('../models/Projects');
const Task = require('../models/Tasks');
const User = require('../models/User');

router.use(authMiddleware);

// router.get('/', (req, res) => {
//     console.log('user: ', req.userid);
//     return res.status(200).send({
//         ok: true,
//         userid: req.userid
//     });
// });

//List projects
router.get('/', async (req, res, next) => {
    try {
        const projects = await Project.find().populate(['user', 'tasks']);
        return res.status(200).send({ projects });
    } catch (err) {
        return res.status(400).send({ err: "Error loading projects" })
    }
});

//list Projects Details
router.get('/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        const project = await Project.findById(id).populate(['user', 'tasks']);
        return res.status(200).send({ project });
    } catch (err) {
        return res.status(400).send({ err: "Error loading projects" })
    }
});

//create project
router.post('/', async (req, res, next) => {
    //Com inclu~sao 1 para n
    try {
        const { title, description, tasks } = req.body;

        const project = await Project.create({ title, description, user: req.userid });

        await Promise.all(tasks.map(async task => {
            const projectTask = new Task({ ...task, project: project._id });
            await projectTask.save();
            project.tasks.push(projectTask);
        }));

        await project.save();

        return res.status(200).send({ project });
    } catch (err) {
        return res.status(400).send({ err });
    }

});

router.put('/update/:id', async(req, res, next) => {
    try {
        const id = req.params.id;
        const {title, description, tasks} = req.body;
        console.log('id');
        const project = await Project.findByIdAndUpdate(id,{
            title,
            description
        }, {new: true});

        project.tasks = [];
        await Task.remove({project: project._id});

        await Promise.all(tasks.map(async task => {
            const projectTask = new Task({ ...task, project: project._id});
            await projectTask.save();
            project.tasks.push(projectTask);
        }));

        await project.save();

        return res.status(200).send({project})

    } catch (err) {
        console.log(err);
        return res.status(400).send({ err: err });
    }
});

//delete project
router.delete('/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        await Project.findByIdAndRemove(id);
        return res.status(200).send({ msg: "Project delected" });
    } catch (err) {
        return res.status(400).send({ err: "Error on delete project" })
    }
});

module.exports = app => app.use('/projects', router);
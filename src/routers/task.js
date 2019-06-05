const express = require('express')
const router = new express.Router()
const tasks = require('../models/task')
const auth = require('../middkeware/auth')

router.post('/tasks', auth, async (req, res)=>{
    // const task = new tasks(req.body)
    const task = new tasks({
        ...req.body,
        owner: req.user._id
    })

    try{
        await task.save()
        res.status(201).send(task)
    }catch (e){
        res.status(400).send(e)
    }
})

router.get('/tasks', auth,async (req, res)=>{
    const match = {}
    const sort = {}

    if(req.query.sortBy){
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1   
    }

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    

    try{
        // const task = await tasks.find({ owner: req.user._id})
        await req.user.populate({
            path: 'myTask',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            },
        }).execPopulate()
        res.send(req.user.myTask)
    }catch(e){
        res.status(500).send()
    }
})

router.get('/tasks/:id',auth,async (req, res)=>{
    const _id = req.params.id

    try{
        // const task = await tasks.findById(_id)
        const task = await tasks.findOne({_id, owner: req.user._id})

        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(400).send()
    }
})

router.patch('/tasks/:id', auth, async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValid = updates.every((update)=>allowedUpdates.includes(update))

    if(!isValid){
        return res.status(400).send({error: 'Invalid update!'})
    }
    try{
        // const task = await tasks.findById(req.params.id)
        const task = await tasks.findOne({_id: req.params.id, owner: req.user._id })
        
        //const task = await tasks.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true})
        if(!task){
            return res.status(404).send()
        }
        updates.forEach((update)=>task[update]=req.body[update])
        await task.save()
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

router.delete('/tasks/:id', auth, async(req,res)=>{
    try{
        // const task = await tasks.findByIdAndDelete(req.params.id)
        const task = await tasks.findOneAndDelete({_id: req.params.id, owner: req.user._id})

        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})



module.exports = router
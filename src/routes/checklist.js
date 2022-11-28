const express = require('express')

const router = express.Router();

const Checklist = require('../models/checklist')

router.get('/', async (req,res) =>{
    try{
        let checklist = await Checklist.find({})
        res.status(200).render('checklists/index', {checklists: checklist})
    }catch(err){
        res.status(500).render('pages/error', {error: 'Erro ao exibir as listas'})
    }
})

router.get('/new', async(req,res)=>{
    try{
        let checklist = new Checklist();
        res.status(200).render('checklists/new', {checklist: checklist})
    }catch(err){
        console.log(err)
        res.status(500).render('checklists/new', {checklists: {...checklist,error}})
    }
})

router.get('/:id/edit', async(req,res)=>{
    try {
        let checklist = await Checklist.findById(req.params.id)
        res.status(200).render('checklists/edit', {checklist:checklist})
    } catch (error) {
        res.status(500).render('pages/error', {error: "erro ao editar"})
    }
})

router.get('/:id', async (req,res) =>{
    try{
        let checklist = await Checklist.findById(req.params.id).populate('tasks')
        res.status(200).render('checklists/show', {checklists: checklist})
    }catch(err){
        res.status(500).render('pages/error')
    }
})

router.put('/:id', async (req,res) =>{
    let {name} = req.body.checklist
    let checklist = await Checklist.findById(req.params.id)
    try{
        let checklist = await Checklist.updateOne({name});
        res.redirect('/checklists')
    }catch(err){
        let erros = err.erros
        res.status(422).render('checklists/edit', {checklist:{...checklist, erros}})
    }
})

router.delete('/:id', async (req,res) =>{
    try{
        let checklist = await Checklist.findByIdAndRemove(req.params.id);
        res.redirect('/checklists')
    }catch(err){
        res.status(500).render('pages/error', {error: 'Erro ao deletar'})
    }
})

router.post('/', async (req,res) =>{
    let {name} =req.body.checklist
    let checklist = new Checklist({name})

    try{
        await checklist.save()
        res.redirect('/checklists')
    }catch(error){
        res.status(422).json(error)
    }

})

module.exports = router;
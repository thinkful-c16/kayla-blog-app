'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

var data = require('../db/dummy-data');

const { DATABASE, PORT } = require('../config');
//knex needs to know which db to talk to
const knex = require('knex')(DATABASE);

/* ========== GET/READ ALL ITEMS ========== */
router.get('/stories', (req, res) => {
  knex.select()
    .from('stories')
    .then(results => {
      res.json(results).status(200);
    });
});

/* ========== GET/READ SINGLE ITEMS ========== */
router.get('/stories/:id', (req, res) => {
  knex.select()
    .from('stories')
    .where('stories.id', req.params.id)
    .then(results => res.json(results).status(200));
});

/* ========== POST/CREATE ITEM ========== */
router.post('/stories', bodyParser, (req, res) => {
  // const {title, content} = req.body;
  
  // /***** Never Trust Users! *****/
  
  // const newItem = {
  //   id: data.nextVal++,
  //   title: title,
  //   content: content
  // };
  // data.push(newItem);
  // res.location(`${req.originalUrl}/${newItem.id}`).status(201).json(newItem);
  // const {title, content} = req.body;

  // const newItem = {
  // };
  knex
    .returning(['title', 'content'])
    .insert([{title: req.body.title, content: req.body.content}])
    .into('stories')
    .debug(true)
    .then(results => res.status(201).json(results));



});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/stories/:id', (req, res) => {
  const {title, content} = req.body;
  
  /***** Never Trust Users! *****/
  
  const id = Number(req.params.id);
  const item = data.find((obj) => obj.id === id);
  Object.assign(item, {title, content});
  res.json(item);
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/stories/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = data.findIndex((obj) => obj.id === id);
  data.splice(index, 1);
  res.status(204).end();
});

module.exports = router;
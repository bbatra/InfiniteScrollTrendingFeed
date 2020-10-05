/**
 * @author: Bharat Batra
 */

import { v1 } from 'node-uuid';
const SALT = '510';
const NOT_FOUND = 'NOT_FOUND';//Use this to indicate the object was actually not found as opposed to an error

const db = {
  NOT_FOUND,
  upsertMany,
  updateMany,
  deleteOne,
  deleteMany,
  insertMany,
  findById,
  findOneAndUpdate,
  findMostRecentN,
  findByIdArray,
  findAll,
  findOne,
  create,
  save,
  remove,
  find,
  findWithSort,
  findWithSelect,
  aggregate
};

function findById(id, model) {
  return new Promise((resolve, reject) => {
    findOne({ id : id }, model)
      .then((model) => { resolve(model) })
      .catch((error) => { reject(error) })
  });
}

function findByIdArray(idArray, model) {
  return new Promise((resolve, reject) => {
    model.find({ id: { $in: idArray } }, (err, found) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(found);
    })
  })
}

/*
Attributes represents the query part of a mongoose query
eg. {name: 'john'}
 */
function find(attributes, model){
  return new Promise( (resolve, reject) => {
    model.find(attributes, (err, found) => {
      if (err) {
        reject(err);
        return
      }
      resolve(found);
    })
  })
}

/*
Attributes represents the query part of a mongoose query
eg. {name: 'john'}
 */
function findWithSelect(attributes, select, model){
  return new Promise( (resolve, reject) => {
    model.find(attributes).select(select).exec( (err, found) => {
      if (err) {
        reject(err);
        return
      }
      resolve(found);
    })
  })
}

function findWithSort(attributes, sort, model){
  return new Promise( (resolve, reject) => {
    model.find(attributes).sort(sort).exec( (err, found) => {
      if (err) {
        reject(err);
        return
      }
      resolve(found);
    })
  })
}

function findOne(attributes, model) {
  return new Promise( (resolve, reject) => {
    model.findOne(attributes, (err, found) => {
      if (err) {
        reject(err);
        return
      }
      resolve(found);
    })
  })
}

/*
Uses the 'created' field (see Entity.js schema)
To find the N most recent records eith the given fitler
 */
function findMostRecentN(attributes, n, model) {
    return new Promise( (resolve, reject) => {
        model.find(attributes).sort({"created" : -1}).limit(n).exec( (err, found) => {
            if (err) {
                reject(err);
                return
            }
            resolve(found);
        })
    })
}

function create(attributes, model) {
  return new Promise( (resolve, reject) => {
    const focus = new model({
      ...attributes,
      id: attributes.id ? attributes.id: v1() + SALT,
      created: new Date()
    });
    focus.save(error => {
      if (error) {
        reject(error);
        return
      }
      resolve(focus);
    })
  })
}

function save(instance) {
  return new Promise((resolve, reject) => {
    instance.save(error => {
      if (error) {
        reject(error);
        return
      }

      resolve(instance)
    })
  })
}

function remove(id, model) {
  return new Promise( (resolve, reject) => {
    model.findByIdAndRemove(id, (err, removed) => {
      if (err) {
        reject(err);
        return
      }

      resolve(removed)
    })
  })
}

function findAll(model) {
  return new Promise( (resolve, reject) => {
    model.find({}, (err, models) => {
      if (err) {
        reject(err);
        return
      }

      resolve(models)
    })
  })
}


function aggregate(pipeline, model) {
  return new Promise( (resolve, reject) => {
    model.aggregate(pipeline, (err, models) => {
      if (err) {
        reject(err);
        return
      }

      resolve(models)
    })
  })
}

function deleteOne(attributes, model) {
  return new Promise( (resolve, reject) => {
    model.deleteOne(attributes, (err, models) => {
      if (err) {
        reject(err);
        return
      }

      resolve(models)
    })
  })
}


function deleteMany(attributes, model) {
  return new Promise( (resolve, reject) => {
    model.deleteMany(attributes, (err, models) => {
      if (err) {
        reject(err);
        return
      }

      resolve(models)
    })
  })
}

//IMOPORTANT: IDs must be provided here with each object
function upsertMany(objects, model, batchSize = 100) {

  return new Promise( (resolve, reject ) => {
    let bulkOp = model.collection.initializeOrderedBulkOp();
    let i;
    for(i = 0; i< objects.length; i++){

      //Individual op to run
      bulkOp.find({id: objects[i].id}).upsert().updateOne(objects[i]);

      //Our batch is filled, let's run the bulkOp!
      if(i > 0 && (i + 1) % batchSize === 0){
        bulkOp.execute(function(err,result) {
          if(err){
            reject(err);
            return;
          }
          //let's initialize another batch
          bulkOp = model.collection.initializeOrderedBulkOp();
        });
      }
    }


    //We still have some remaing bulkOps to run
    if((i) % batchSize !== 0){
      bulkOp.execute(function(err,result) {
        if (err) {
          reject(err);
          return;
        }
        resolve(objects);
      });
    }

    resolve(objects);
  })
}

function insertMany(attributes, model) {
  return new Promise( (resolve, reject) => {
    model.insertMany(attributes, (err, models) => {
      if (err) {
        reject(err);
        return
      }

      resolve(models)
    })
  })
}

function updateMany(filter, update, model, options = {}){
  return new Promise( (resolve, reject) => {
    model.updateMany(filter, update, options, (err, models) => {

      if (err) {
        reject(err);
        return
      }

      resolve(models)
    })
  })
}

function findOneAndUpdate(filter, update, model, options = {new: true, upsert: true}){
  return new Promise( (resolve, reject) => {
    model.findOneAndUpdate(filter, update, options, (err, models) => {

      if (err) {
        reject(err);
        return
      }

      resolve(models)
    })
  })
}


export default db;

const supertest = require('supertest');
const mongoose = require('mongoose');
const startServer = require('../utils/createServerNoSession');
const Org = require('../model/Organization');
require('dotenv').config();


let app;

beforeAll(async () => {
  app = startServer();
  await mongoose.connect(process.env.MONGODB_DATABASE_URL);
  const testOrganization = new Org({ })
  
});

afterAll(async () => {
  await mongoose.disconnect();
});


describe("--Organization Model Queries Test--", () => {

  describe("Create New Organization", () => {
    
    beforeEach(async () => {

        
        
        });
      
        afterEach(async () => {

        });


  });

});
const supertest = require('supertest');
const mongoose = require('mongoose');
const startServer = require('../utils/createServerNoSession');
const model = require('../model/User');
const bcrypt = require('bcrypt');
require('dotenv').config();


let app;

beforeAll(async () => {
  app = startServer();
  await mongoose.connect(process.env.MONGODB_DATABASE_URL);
  await model.deleteMany({username: 'Bob McGee'});
  const password = 'PleaseDoNotHackMe123';
  const fakepwd = await bcrypt.hash(password, 10);
  const tester = new model({username: 'Bob McGee', password: fakepwd, firstname: "Bob", lastname: "McGee", email: 'someemail@email.com'});
  await tester.save();
});

afterAll(async () => {
  await model.deleteMany({username: 'Bob McGee'});
  await mongoose.disconnect();
  
});


describe("--Login API Test--", () => {

  describe("Create Test User", () => {

    beforeEach(async () => {
    })

    afterEach(async () => {
    });
    

    describe("Check Test User Can Login", () => {
      
      it("Should Log In Successfully (doesn't work because of sessions. It cannot write to req.session.user upon login)", async () => {

        const response = await supertest(app)
        .post('/login/login')
        .send({username: "Bob McGee", password: "PleaseDoNotHackMe123"});
        expect(response.status).toBe(200);
        

      });

      it("Should Decline Input For Missing Password", async () => {

        const response = await supertest(app)
        .post('/login/login')
        .send({username: 'Bob McGee', password: ''});
        expect(response.status).toBe(401);
        

      });

      it("Should Decline Input For Missing Username", async () => {

        const response = await supertest(app)
        .post('/login/login')
        .send({username: '', password: 'PleaseDoNotHackMe123'});
        expect(response.status).toBe(401);
        

      });

      it("Should Deny Login for Incorrect Username", async () => {

        const response = await supertest(app)
        .post('/login/login')
        .send({username: "Bobathee McGee", password: "PleaseDoNotHackMe123"});
        expect(response.status).toBe(401);
        

      });

      it("Should Deny Login for Incorrect Password", async () => {

        const response = await supertest(app)
        .post('/login/login')
        .send({username: "Bobathee McGee", password: "ImSoGoodAtHacking"});
        expect(response.status).toBe(401);
        

      });


    });
  });

});

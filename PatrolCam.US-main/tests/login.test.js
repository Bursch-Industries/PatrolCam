const supertest = require('supertest');
const mongoose = require('mongoose');
const startServer = require('../utils/createServerNoSession');
const model = require('../model/User');
const bcrypt = require('bcrypt');
require('dotenv').config();


let app;
let agent;

beforeAll(async () => {
  app = startServer();
  agent = supertest.agent(app); // Use an agent to persist session between requests
  await mongoose.connect(process.env.MONGODB_DATABASE_URL);
  await model.deleteMany({username: 'Bob McGee'});
  const password = 'PleaseDoNotHackMe123!';
  const fakepwd = await bcrypt.hash(password, 10);
  const tester = new model({password: fakepwd, firstname: "Bob", lastname: "McGee", email: 'someemail@email.com', roles: 'User', organization: '6744a177f2a8e8ed7b9aef98'});
  await tester.save();
  
});

afterAll(async () => {
  await model.deleteMany({email: 'someemail@email.com'});
  await mongoose.disconnect();
});


describe("--Login API Test--", () => {

    describe("Check Test User Can Login", () => {
      
      it("Should Log In Successfully (doesn't work because of sessions. It cannot write to req.session.user upon login)", async () => {

        const response = await supertest(app)
        .post('/login/login')
        .send({ email: 'someemail@email.com', password: "PleaseDoNotHackMe123!", rememberMeBool: false, rememberMeValue: "" });
        expect(response.status).toBe(200);

      });

      it("Should Decline Input For Missing Password", async () => {

        const response = await supertest(app)
        .post('/login/login')
        .send({ email: 'someemail@email.com', password: '', rememberMeBool: false, rememberMeValue: "" });
        expect(response.status).toBe(401);
        
      });

      it("Should Decline Input For Missing Email", async () => {

        const response = await supertest(app)
        .post('/login/login')
        .send({ email: '', password: 'PleaseDoNotHackMe123!', rememberMeBool: false, rememberMeValue: "" });
        expect(response.status).toBe(401);

      });

      it("Should Deny Login for Incorrect Email", async () => {

        const response = await supertest(app)
        .post('/login/login')
        .send({ email: 'someotheremail@email.com', password: "PleaseDoNotHackMe123!", rememberMeBool: false, rememberMeValue: "" });
        expect(response.status).toBe(401);
        
      });

      it("Should Deny Login for Incorrect Password", async () => {

        const response = await supertest(app)
        .post('/login/login')
        .send({ email: "someemail@email.com", password: "ImSoGoodAtHacking", rememberMeBool: false, rememberMeValue: "" });
        expect(response.status).toBe(401);
        
      });

  });

});

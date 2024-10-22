const supertest = require('supertest');
const mongoose = require('mongoose');
const startServer = require('./utils/createServerNoSession');
const model = require('./model/Test');
const bcrypt = require('bcrypt');
require('dotenv').config();

let app;

beforeAll(async () => {
  app = startServer();
  await mongoose.connect(process.env.MONGODB_DATABASE_URL);
});

afterAll(async () => {
  await mongoose.disconnect();
});


describe("--Login API Test--", () => {

  describe("Create Test User", () => {
    beforeEach(async () => {
      const password = 'PleaseDoNotHackMe123';
      const fakepwd = await bcrypt.hash(password, 10);
      const tester = new model({username: 'Bob McGee', password: fakepwd, email: 'someemail@email.com'});
      await tester.save();
    })

    afterEach(async () => {
      // Clean up the database after each test
      //await model.deleteMany({username: 'Bob McGee'});
    });
    

    describe("Check Test User Can Login", () => {
      
      it("Should Log In Successfully", async () => {

        const response = await supertest(app)
        .post('/login/login')
        .send({username: "Bob McGee", password: "PleaseDoNotHackMe123"});
        expect(response.status).toBe(200);
        

      });

      it("Should Decline Input For Missing Password", async () => {

        const response = await supertest(app)
        .post('/login/login')
        .send({username: 'Bob McGee'});
        expect(response.status).toBe(400);
        

      });

      it("Should Decline Input For Missing Username", async () => {

        const response = await supertest(app)
        .post('/login/login')
        .send({password: 'PleaseDoNotHackMe123'});
        expect(response.status).toBe(400);
        

      });



    });
  });

});

const supertest = require('supertest');
const mongoose = require('mongoose');
const startServer = require('../utils/createServerNoSession');
const User = require('../model/User');
const Organization = require('../model/Organization')
const bcrypt = require('bcrypt');
require('dotenv').config();


jest.mock('../model/User');
jest.mock('../model/Organization');
jest.mock('../controllers/transactionHandler');
jest.mock('../controllers/logger');

let app;
let agent;

beforeAll(async () => {
    app = startServer();
    await mongoose.connect(process.env.MONGODB_DATABASE_URL);
    agent = supertest.agent(app); // Use an agent to persist session between requests
    const password = 'PleaseDoNotHackMe123!';
    const fakepwd = await bcrypt.hash(password, 10);
    const testAdmin = new User({password: fakepwd, firstname: "Jest", lastname: "Admin", email: 'jestAdmin@email.com', roles: 'Admin', organization: '6744a177f2a8e8ed7b9aef98'});
    await testAdmin.save();
});

afterAll(async () => {
    await User.deleteOne({ email: 'jestAdmin@email.com' });
    await User.deleteOne({ email: 'jestUser@email.com' });
    await mongoose.disconnect();
});


describe("--registerController API Test--", () => {

    describe("Check handleNewOrganization", () => {
        

        it("Should Create a New Organization with New Admin User", async () => {

            const password = 'PleaseDoNotHackMe123!';
            const fakepwd = await bcrypt.hash(password, 10);

            const response = await supertest(app)
            .post('/register/newOrg')
            .send({ orgName: "Jest Test Org", orgEmail: "JestTestEmail@email.com", orgPhone: "(123) - 234 - 3456", orgAddress: "123 Street", orgCity: "City", orgState: "State", orgZip: "12345", password: fakepwd, userFirstname: "Jest", userLastname: "Test", userEmail: "jesttest@email.com" })                                                                       
            expect(response.status).toBe(201);
        })

    })

    describe("Check handleNewUser", () => {
      
      it("Should Successfully Create New User", async () => {

        const response = await supertest(app)
        .post('/register/newUser')
        .send({ password: "PleaseDoNotHackMe123!", userFirstname: "Bob", userLastname: "McGee", userEmail: 'someemail@email.com', phone: "(123) - 456 - 7890", rank: "Admiral of the Seas", role: "User" });
        expect(response.status).toBe(201);

      });

    });

    describe("Check handleAddNewOrgUser", () => {
  
        beforeEach(async () => {
                          
        });

        afterEach(async () => { 
            
        });

        it("Should Create a New Organization User Successfully", async () => {

            const loginResponse = await agent
            .post('/login/login')
            .send({ email: 'jestAdmin@email.com', password: "PleaseDoNotHackMe123!", rememberMeBool: false, rememberMeValue: "" });
            expect(loginResponse.status).toBe(200);
            

            const handleAddNewOrgUserResponse = await supertest(app)
            .post('/register/newOrgUser')
            .send({ userPassword: "Password123!", userFirstname: "Jest", userLastname: "User", userEmail: "jestUser@email.com" });
            expect(handleAddNewOrgUserResponse.status).toBe(201);
        })
        
    })

    describe("Check deleteOrganizationUser", () => {

        beforeEach(async () => {
            const password = 'PleaseDoNotHackMe123!';
            const fakepwd = await bcrypt.hash(password, 10);
            const testAdmin = new User({password: fakepwd, firstname: "Jest", lastname: "Admin", email: 'jestAdmin@email.com', roles: 'Admin', organization: '6744a177f2a8e8ed7b9aef98'});
            await testAdmin.save();
            const testUser = new User({password: fakepwd, firstname: "Jest", lastname: "User", email: 'jestUser@email.com', roles: 'User', organization: '6744a177f2a8e8ed7b9aef98'});
            await testUser.save();              
        });

        afterEach(async () => { 
            await User.deleteOne({email: 'jestAdmin@email.com'});
            await User.deleteOne({email: 'jestUser@email.com'});
        });

        it("Should Delete a User Successfully", async () => {

            const loginResponse = await supertest(app)
            .post('/login/login')
            .send({ email: 'jestAdmin@email.com', password: "PleaseDoNotHackMe123!", rememberMeBool: false, rememberMeValue: "" });
            

            const deleteOrganizationUserResponse = await supertest(app)
            .post('/register/delUser')
            .send('user-to-delete-id')
            expect(deleteOrganizationUserResponse.status).toBe(200);
        })
        
    })

});
const supertest = require('supertest');
const mongoose = require('mongoose');
const startServer = require('../utils/createServerNoSession');
const nodemailer = require('nodemailer');
require('dotenv').config();


let app;

beforeAll(async () => {
  app = startServer();
  await mongoose.connect(process.env.MONGODB_DATABASE_URL);
  
});

afterAll(async () => {
  await mongoose.disconnect();
});


describe("--Contact Form Email Test--", () => {

  describe("Create Email Transport", () => {
    
    beforeEach(async () => {
        // Creat nodemailer transport (connection to SMTP server)
            const transporter = nodemailer.createTransport({
                service: 'gmail', 
                auth: {
                    user: 'skeetercathcart@gmail.com', // REPLACE with email address that is being "charged" for the emails
                    pass: process.env.GMAIL_APP // REPLACE with app password corresponding to above email
                }
            });
        });
      
        afterEach(async () => {

        });

    describe("Send Emails", () => {

        it("Should Send an Email With All Needed Information", async () => {

            const response = await supertest(app)
            .post('/contact')
            .send({name: "Bob McGee", 
                   org: "Big Cop Corp Testers",
                   ext: "+1",
                   phone: "123-456-7890",
                   email: "BigCopCorpTesting@email.com",
                   productInterest: "Testing Emails"});
            expect(response.status).toBe(200);
        
          });

          it("Should Throw an Error for Missing Information", async () => {

            const response = await supertest(app)
            .post('/contact')
            .send({name: "Bob McGee", 
                   org: "Big Cop Corp Testers",
                   ext: "+1",
                   phone: "",
                   email: "BigCopCorpTesting@email.com",
                   productInterest: "Testing Emails"});
            expect(response.status).toBe(400);
        
          });

          it("Should Throw an Error for Missing Information", async () => {

            const response = await supertest(app)
            .post('/contact')
            .send({name: "Bob McGee", 
                   org: "Big Cop Corp Testers",
                   ext: "+1",
                   phone: "123-456-7890",
                   email: "",
                   productInterest: "Testing Emails"});
            expect(response.status).toBe(400);
        
          });

    });
  });

});

const supertest = require('supertest');
const startServer = require('./utils/createServerNoSession');
const mongoose = require('mongoose');
require('dotenv').config();

const app = startServer();

describe("--Landing Page--", () => {

  beforeEach(() => {
    mongoose.connect(process.env.MONGODB_DATABASE_URL).then(console.log('DB Connected'))
  })

  afterEach(() => {
      mongoose.connection.close()
  })


  describe("Get Page Route", () => {

    describe("Given the Page does not exist", () => {
      
      it("should return 404", async () => {

        await supertest(app).get('routes/api/pr');

      });
    });
  });

});

'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server.js');
const should = chai.should();

chai.use(chaiHttp);

describe('/GET posts', () => {
    it('it should GET all the posts', (done) => {
        chai.request(server)
            .get('/getposts')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});
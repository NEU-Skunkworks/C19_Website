var expect = require('chai').expect
const express = require('express')
const app = express()
it('Main page status', function (done) {
  app.get('http://localhost:3000/health', (req, res) => {
    expect(res.statusCode).to.equal(200)
  }).then(done())
})

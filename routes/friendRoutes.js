const express = require("express");
const router = express.Router();
const friends = require('../models/friends')

const friendController = require('../controllers/friendcontroller')


// TODO - #1: Add support to the 'filter' endpoint for a new query parameter 'letter' which filters friends by starting letter

// TODO - #2: Modify the 'info' route to only return the user-agent, content-type and accept header data

// TODO - #3: Modify the dynamic GET route to return a single friend object matching the dynamic 'id' request parameter

// TODO - #4: Complete the PUT route which will update data for an existing friend

// TODO - #5: Move all logic out into a controller with functions for finding, filtering, info, adding and updating


// default endpoint, gets all friends
router.get('/', (req, res) => {
    res.json(friends)
})

// filter endpoint, gets friends matching the gender from 'gender' query parameter ie. /friends/filter?gender=male
// 1. Add support to also filter by a starting 'letter' query parameter ie. /friends/filter?letter=R
router.get('/filter', (req, res) => {
    friendController.filterFriends(req, res)
});
// you can filter by gender AND letter by using http://localhost:3001/friends/filter?gender=male&letter=R


// 2. Get information about this request from the headers
router.get('/info', (req, res) => {
    friendController.headersInfo(req, res)
});


// 3. Dynamic request param endpoint - get the friend matching the specific ID ie. /friends/3
router.get('/:id', (req, res) => {
    friendController.dynamicParam(req, res)
});


// a POST request with data sent in the body of the request, representing a new friend to add to our list
router.post('/', (req, res) => {
    friendController.postRequest(req, res)
});


// 4. Complete this new route for a PUT request which will update data for an existing friend
router.put('/:id', (req, res) => {
    friendController.putRequest(req, res)
});

module.exports = router;
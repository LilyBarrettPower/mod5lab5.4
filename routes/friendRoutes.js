const express = require("express");
const router = express.Router();
const friends = require('../models/friends')


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
    console.log(req.query)
    let filterGender = req.query.gender;
    // extract the letter query parameter from the request (letter=R)
    let filterLetter = req.query.letter;
    let matchingFriends = [...friends];

    if (filterGender) {
        matchingFriends = matchingFriends.filter(friend => friend.gender == filterGender);
    }

    if (filterLetter) { //If filterLetter (the letter query parameter) is provided - matchingFriends array should only contain friends whose name starts with the filterLetter
        // Addition of toUpperCase() to make the filter case insensitive 
        matchingFriends = matchingFriends.filter(friend => friend.name.startsWith(filterLetter.toUpperCase()));
    }
    
    if (matchingFriends.length > 0) {
        // return valid data when the gender matches 
        res.status(200).json(matchingFriends)
    } else {
        // and an error response when there are no matches
        // add the filterLetter to the error message 
        res.status(404).json({ error: "No friends matching gender " + " " + filterGender + " " + "and letter" + " " + filterLetter });
    }  
})
// you can filter by gender AND letter by using http://localhost:3001/friends/filter?gender=male&letter=R


// 2. Get information about this request from the headers
router.get('/info', (req, res) => {
    console.log(req.headers)
    // Extract the specific headers from req.headers and assign them to variables 
    const userAgent = req.headers['user-agent'];
    const contentType = req.headers['content-type']; // this one doesn't exist?
    const accept = req.headers['accept'];

    // create a new object which has the extracted headers, using keys to display them better 
    const headersInfo = {
        'user-agent': userAgent,
        'content-type': contentType,
        'accept': accept
    };
 
    // Modify this response to just return info on the user-agent, content-type and accept headers
    // return the headersInfo variable in json format to show just the specified headers
    res.json(headersInfo);
});



// 3. Dynamic request param endpoint - get the friend matching the specific ID ie. /friends/3
router.get('/:id', (req, res) => {
    console.log(req.params)
    let friendId = req.params.id; // 'id' here will be a value matching anything after the / in the request path

    // Modify this function to find and return the friend matching the given ID, or a 404 if not found

    let friend = friends.find(friend => friend.id == friendId)
    // find the friend with the id matching the id from the query string, put this in the variable friend 
    // Modify this response with the matched friend, or a 404 if not found

    friend ? res.status(200).json({ result: friend}) // if everything is OK, display the friend with the ID selected
        : res.status(404).json({result: `Friend with ID ${friendId} not found`}) // if everything is not ok, display the error message 
})

// a POST request with data sent in the body of the request, representing a new friend to add to our list
router.post('/', (req, res) => {
    let newFriend = req.body; // FIRST add this line to index.js: app.use(express.json());
    console.log(newFriend) // 'body' will now be an object containing data sent via the request body

    // we can add some validation here to make sure the new friend object matches the right pattern
    if (!newFriend.name || !newFriend.gender) {
        res.status(500).json({error: 'Friend object must contain a name and gender'});
        return;
    }
    else if (!newFriend.id) {
        newFriend.id = friends.length + 1; // generate an ID if one is not present
    }

    // if the new friend is valid, add them to the list and return the successfully added object
    friends.push(newFriend)
    res.status(200).json(newFriend)
})

// 4. Complete this new route for a PUT request which will update data for an existing friend
router.put('/:id', (req, res) => {
    let friendId = req.params.id;
    let updatedFriend = req.body;

    // Replace the old friend data for friendId with the new data from updatedFriend
    // Find the friend to update based on the id supplied 
    let friendToUpdate = friends.find(friend => friend.id == friendId);

    // reusing the above code to ensure the updatedFriend matches the correct pattern
    if (!updatedFriend.name || !updatedFriend.gender) {
        res.status(500).json({error: 'Friend object must contain a name and gender'});
        return;
    }

    // if friendToUpdate is supplied, replace the name and gender of the friend to update with those of the updated Friend 
    if (friendToUpdate) {
        friendToUpdate.name = updatedFriend.name;
        friendToUpdate.gender = updatedFriend.gender;
        // Modify this response with the updated friend, or a 404 if not found
        // if all OK, return the message and the data of the updatedFriend
        res.status(200).json({ result: `Updated friend with ID ${friendId}`, data: updatedFriend });
    } else {
        // if all not OK return an error message 
        res.status(404).json({ result: `Friend with ID ${friendId} not found` });
    }
})

module.exports = router;
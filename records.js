const fs = require('fs');

function generateRandomId(){
  return Math.floor(Math.random() * 10000);
}

function save(data){
  return new Promise((resolve, reject) => {
    fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Gets all users
 * @param None
 */
function getUsers(){
  return new Promise((resolve, reject) => {
    fs.readFile('data.json', 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        const json = JSON.parse(data);
        resolve(json);
      }
    });
  });
}

/**
 * Gets a specific quote by ID
 * @param {number} id - Accepts the ID of the specified quote.
 */
async function getUser(id){
  const quotes = await getUsers();
  return quotes.users.find(record => record.id == id);
}
/**
 * Gets a random user 
 * @param None
 */
async function getRandomUser(){
  const users = await getUsers();
  const randNum = Math.floor(Math.random() * users.users.length);
  return users.users[randNum];
}

/**
 * Creates a new quote record 
 * @param {Object} newRecord - Object containing info for new quote: the quote text and author 
 */
async function createUser(newUser) {
  const users = await getUsers(); 
  
  newUser.id = generateRandomId(); 
  users.users.push(newUser);
  await save(users); 
  return newUser; 
}

/**
 * Updates a single record 
 * @param {Object} newQuote - An object containing the changes to quote: quote and author 
 */
async function updateUser(newUser){
  const users = await getUsers();
  let user = users.users.find(item => item.id == newUser.id);
  
  user.id = newUser.id;
  user.email = newUser.email;
  user.username = newUser.username;
 
  await save(users);
}

/**
 * Deletes a single record
 * @param {Object} user - Accepts record to be deleted. 
 */
async function deleteUser(user){
  const users = await getUsers();
  users.users = users.users.filter(item => item.id != user.id);
  await save(users);
}

module.exports = {
  updateUser,
  getRandomUser, 
  createUser, 
  getUsers, 
  deleteUser,
  getUser
}

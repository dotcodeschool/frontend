// Variables Exercise - Solution

// Declare a variable named 'greeting' using the 'const' keyword
const greeting = 'Hello, world!';

// Create a variable named 'myName' using 'let'
let myName = 'Jane Doe';

// Create a variable named 'age' using 'let'
let age = 30;

// Create a boolean variable named 'isLearning' and set it to true
const isLearning = true;

// Create an array named 'hobbies' with at least three of your hobbies
const hobbies = ['reading', 'coding', 'hiking'];

// Create an object named 'person' with properties for name, age, and isLearning
// Use the variables you created above for the values
const person = {
  name: myName,
  age: age,
  isLearning: isLearning,
  hobbies: hobbies
};

// Log a message to the console that uses the 'greeting' and 'myName' variables
console.log(`${greeting} My name is ${myName}.`);

// Log a message that includes your age
console.log(`I am ${age} years old.`);

// Log your hobbies
console.log(`My hobbies are: ${hobbies.join(', ')}`);

// Log the person object
console.log('Person object:', person);

// Try to reassign the 'greeting' variable and observe what happens
// This will cause an error because 'greeting' is a constant
// Uncomment the line below to see the error
// greeting = "Hi there!";

// However, we can modify the properties of objects even if they're declared with const
person.age = 31;
console.log('Updated person object:', person);

// We can also add new properties to objects
person.location = 'New York';
console.log('Person object with new property:', person);

// And we can modify arrays declared with const
hobbies.push('photography');
console.log('Updated hobbies:', hobbies);

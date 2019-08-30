const mongoose = require('mongoose'); 
// whatever file would be there in main property of package.json of mongoose will be imported here.

mongoose.connect('mongodb://localhost/playground') //playground is a Table(a collection in MongoDB) . Mongo creates a collection only when it has a document in it. Creates it if collection not present in DB.
// connect to the mongodb installed on the local machine . Diff connection string for PROD Build.
    .then(()=> console.log('Connected to Mongo DB...'))
    .catch(err => console.log('Could not connect to MongodB...',err));

// Mongoose specific Schema. Schema defines the structure of the document(rows)
const courseSchema = new mongoose.Schema({
    name : String,
    author : String,
    tags : [String],
    date : {type : Date, default:Date.now},
    isPublished : Boolean
}); // Since we are creating a Schema instance we use new.

// Now we need to create a document and save it in DB based on the course schema.

//First we create a class out of this schema and the documents would be objects of the class.
const Course = mongoose.model('Course',courseSchema); // Since it is a class and not instance so we dont use new.

async function createCourse(){
    const course = new Course({
        name : 'iOS Course',
        author : 'Piyush',
        tags : ['mobile','frontend'],
        isPublished : false
    }); // This is a row ie a Document. Each Row is a new instance.
    
    // Save the above document in a database.
    const result = await course.save(); // MongoDB Assigns a unique ID to the document in result.
    console.log(result);
}

async function getCourses(){
    /*
    eq equal
    ne not equal
    gt greater than 
    gte gteater than or equal to
    lt less than
    lte less than or equal to
    in
    nin not in
    */
    let pageNumber = 2
    let pageSize = 10
    const courses = await Course
   // .find({author:'Piyush',author:'Piyush'}) // filter docs based on these two parameters.
    //.find({price : {$gt:10,$lt:20}}) // $ to denote it is an operator
    //.find({price:{$in:[10,15,20]}})
    
    // .find()
    // .or([{author:'Piyush'},{isPublished : true}])

    // What if we want to have courses whose author name starts with Piyush? time to use RegEx.
    .find({author:/^P/}) // whose authorName starts with P
    //.find({auhtor:/Vaish$/i}) // ends with Vaish and case Insensitive
    //.find({author : /.*Piyush.*/i}) // Contains Piyush , .-one,*-many
    .skip((pageNumber-1)*pageSize) // Skips these number of Pages.
    .limit(pageSize)
    .sort({name : 1}) // 1 is ascebding, -1 is descending
    //.select({ name : 1 , tags: 1}); // shows only these two properties of the documents.
    .count() // count of documents
  console.log(courses);
}

getCourses();
//createCourse();

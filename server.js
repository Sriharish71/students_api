const express = require('express')
const mongoose = require('mongoose')

require('dotenv').config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error"));

const studentSchema = new mongoose.Schema({
    id:{
        type: String,
        default:  () => Date.now().toString()
    },
    name:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        required: true,
        min: 1
    },
    course:{
        type: String,
        required: true
    },
    year:{
        type: String,
        required: true
    },
    status:{
        type: String,
        default: "active"
    }

})
const Student = mongoose.model('Student', studentSchema);

app.post('/students',async (req, res)=>{
    
const {name, age, course, year } = req.body;

if (!name || !age || !course || !year){
    return res.status(400).json({error: "All fields are required"});
}
if (isNaN(age) || age <= 0){
    return res.status(400).json({error: "Age must be positive number."});
}

const student = new Student({name, age, course, year});
student.save()
.then((savedStudent) => res.status(201).json(savedStudent))
.catch(()=>res.status(500).json({error: "Failed to add student"}));   
});

app.get('/students', (req, res) => {
    Student.find()
    .then((students) => res.json(students))
    .catch(() => res.status(500).json({error:"Failed to fetch students"}))

})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
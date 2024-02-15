
import express from "express";
import mongoose from 'mongoose';
import morgan from "morgan";
import bcrypt from "bcrypt";
import cors from "cors";
import jwt from 'jsonwebtoken'
import bodyParser from "body-parser";
import User from './models/user.js';

// connect to express app
const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors()); // allows frontend to connect to backend
app.use(morgan('dev')); // logger
app.use(express.json()); // for data in req.body
app.use(express.urlencoded({extended: true})); // allow data in url string

const SECRET_KEY = 'super-secret-key'

// connect to mongoDB
const dbURI = "mongodb+srv://Rachida:Rafeeq2022@mongopractice.5awfehy.mongodb.net/inventorymanagement?retryWrites=true&w=majority"
mongoose
.connect(dbURI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server connected to port: ${PORT} and MongoDb`)
    })
})
.catch((error) => {
    console.log('Unable to connect to Server and/or MongoDB', error)
})


//Routes

// REGISTER
//POST REGISTER
app.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({ email, username, password: hashedPassword })
        await newUser.save()
        res.status(201).json({ message: 'User created successfully' })
    } catch (error) {
        res.status(500).json({ error: 'Error signing up' })
    }
})

//GET Registered Users
app.get('/register', async (req, res) => {
    try {
        const users = await User.find()
        res.status(201).json(users)
        
    } catch (error) {
        res.status(500).json({ error: 'Unable to get users' })
    }
})

//LOGIN

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials'})
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }
        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1hr' })
        res.json({ message: 'Login successful' })
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' })
    }
});

app.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;

    const updatedUser = await User.findByIdAndUpdate(id, body, { new: true });
    res.json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: 'User Not found!' });
  }
});

app.delete('/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

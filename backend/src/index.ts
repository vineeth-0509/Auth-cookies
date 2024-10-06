// import express from "express";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import jwt from "jsonwebtoken";
// import path from "path";

// const JWT_SECRET = "test123";

// const app = express();
// app.use(cookieParser());
// app.use(express.json());
// app.use(cors({
//     credentials: true,
//     origin: "http://localhost:5173"
// }));

// app.post("/signin", (req, res) => {
//     const email = req.body.email;
//     const password = req.body.password;
//     // do db validations, fetch id of user from db
//     const token = jwt.sign({
//         id: 1
//     }, JWT_SECRET);
//     res.cookie("token", token); //this will put the cookie in the set-cookie header this automatically reaches the cookie section.
//     res.send("Logged in!");
// });

// app.get("/user", (req, res) => {
//     const token = req.cookies.token;
//     console.log(token);
//     const decoded = jwt.verify(token, JWT_SECRET) as any;
//     // Get email of the user from the database
//     res.send({
//         userId: decoded.id
//     })
// });


// app.post("/logout", (req, res) => {
//     res.clearCookie("token"); // or res.cookie("token","")  setting an cookie to an empty string also works.
//     res.json({
//         message: "Logged out!"
//     })
// });


// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "../src/index.html"))
// })

// app.listen(3000);



import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import jwt from "jsonwebtoken";
import path from "path";

// Secret for signing the JWT
const JWT_SECRET = "test123";

const app = express();

// Middleware setup
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    credentials: true,  // here we need to have credentials and the origin else it will not send or set cookie-header. 
    // if the frontend and the backend are hosted on the same website then we dont require the above credentials to be written.
    origin: "http://localhost:5173"  // Replace this with your frontend URL
}));

// Signin Route - Generates JWT token and sets it in the cookie
app.post("/signin", (req, res) => {
    const { email, password } = req.body;

    // TODO: Add proper validation for email/password against your database
    
    // For demonstration, assuming user id is 1 after successful login
    const token = jwt.sign({
        id: 1 // Set the user ID dynamically from DB
    }, JWT_SECRET, { expiresIn: "1h" }); // Token expires in 1 hour

    // Send token as a cookie
    res.cookie("token", token, {
        httpOnly: true, // Accessible only by the server
        secure: false,  // Set to true in production (when using HTTPS)
        sameSite: "strict" // Ensures cross-site requests are not allowed
    });
    res.cookie("token", token);
    res.send("Logged in!");
});

// Protected Route - Fetches user info using the JWT token
app.get("/user", (req, res) => {
    
    const token = req.cookies.token;
    console.log(token);

    if (!token) {
        return res.status(401).json({ message: "Authentication token not found" });
    }

    try {
        // Verify the token and extract user ID
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        
        // TODO: Fetch the user from DB using the decoded id
        res.json({
            userId: decoded.id // Send back user ID
        });
    } catch (err) {
        const error = err as Error;
        console.error("Token verification failed:", error.message);
        res.status(401).json({ message: "Invalid or expired token" });
    }
});

// Logout Route - Clears the token from cookies
app.post("/logout", (req, res) => {
    // Clear the token cookie
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "strict"
    });

    res.json({
        message: "Logged out!"
    });
});

// Serve index.html file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../src/index.html"));
});

// Start the server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});

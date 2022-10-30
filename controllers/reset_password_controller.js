//ייבוא המודלים המתאימים אשר משמשים אותנו לטובת תהליך איפוס סיסמא
const Token = require("../models/token");
const DB = require('../utils/db');
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
//קונטרולר יופעל מצד הלקוח-בעת לחיצה על איפוס סיסמא-נשלח מייל איפוס סיסמא עם קישור לדף נחיתה.
router.post("/reset", async (req, res) => {
    try {
        let { email } = req.body; 

        let user = await new DB().FindByEmail("users", email);
        if (!user) {
            return res.status(400).send("User not found!");
        }
        let token = await new DB().FindByUserId("token", user._id.toString())

        if (!token) {
            token = new Token(user._id, crypto.randomBytes(32).toString("hex"))
            await new DB().Insert("token", token);
        }
        //לינק האיפוס מורכב משרשור של דף הנחיתה, יחד עם מספר זיהוי המשתמש ואסימון ייחודי
        //בדף הנחיתה נחלץ את הפרמרטים לטובת ביצוע איפוס סיסמא למשתמש מתאים
        const link = `${process.env.BASE_URL}/password-reset/?id=${user._id}&token=${token.token}`;
        await sendEmail(user.email, "Click on the link to reset your password", link);
        res.send("password reset link sent to your email account");
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
});
//קונטרולר המופעל בעת לחיצה על יצירת סיסמא חדשה בדף הנחיתה-משיכת הסיסמא ,ביצוע גיבוב 
//ושמירת הסיסמא המעודכנת בבסיס הנתונים,לאחר מכן מחיקת אסימון הזיהוי.
router.post("/:userId/:token", async (req, res) => {
    try {
        const user = await new DB().FindByID("users", req.params.userId);
        if (!user) return res.status(400).send("invalid link or expired");
        const token = await new DB().FindByUserId("token", user._id.toString())
        if (!token) return res.status(400).send("Invalid link or expired");
        encryptedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = encryptedPassword
        await new DB().UpdateDocById("users", user._id, user)
        await new DB().DeleteDocById("token", token._id.toString())
        res.send("password reset sucessfully.");
    } catch (error) {
        return res.status(400).send("Something went wrong during reset password");

    }
});

module.exports = router;
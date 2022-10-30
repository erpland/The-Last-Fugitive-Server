//שימוש בספריית JWT 
//אשר מאפשרת לנו שימוש באסימוני זיהוי.
//שכבת אותנטיקציה לטובת אימות קיימות של טוקן-זיהוי משתמש מסויים -לטובת הפעלת CONTROLLERS
const jwt = require("jsonwebtoken");
//שליפת משתני הסביבה לטובת שליפת מפתח הטוקן הראשוני-על פי שבלונת הטוקן נבצע השוואת HASH
const config = process.env;
//אימות אסימון זיהוי על ידי בדיקה האם נשלח כחלק מבקשת HTTP שבוצעה
const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    //ביצוע השוואת HASH
    //בין האסימון שנשלח לבין זה שקיים בבסיס הנתונים
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  //מעבר לפעולה הבאה-עברנו את שכבת אותנטיקציה ונפעיל את הפעולה הבאה.
  
  return next();
};

module.exports = verifyToken;
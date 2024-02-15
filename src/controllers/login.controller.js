const conn = require("../models/dbConnectoin");
const bcrypt = require("bcrypt");
const util = require("util");
const Joi = require("joi"); // Add this line

class loginController {
  static login = async (req, res) => {
    try {
      // Validate request using Joi
      const schema = Joi.object({
        national_id: Joi.string().required(),
        password: Joi.string().required(),
      });
  
      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ errors: [{ msg: error.message }] });
      }
  
      // Check if national_id exists
      const query = util.promisify(conn.query).bind(conn);
      const user = await query("SELECT * FROM user WHERE national_id = ?", [
        req.body.national_id,
      ]);
  
      if (user.length === 0) {
        return res.status(404).json({
          errors: [{ msg: "national_id not found!" }],
        });
      }
  
      // Check if the user is blocked
      if (user[0].blocked) {
        return res.status(403).json({
          errors: [{ msg: "User is blocked. Unable to login." }],
        });
      }
  
      // Compare hashed password
      const checkPassword = await bcrypt.compare(
        req.body.password,
        user[0].password
      );
  
      if (checkPassword) {
        // Do not send the password in the response
        delete user[0].password;
  
        // Include user data in the response
        return res.status(200).json({ message: "Successful login", user: user[0] });
      } else {
        return res.status(404).json({
          errors: [{ msg: "Password not correct!" }],
        });
      }
    } catch (err) {
      console.error('Error in login:', err);
      res.status(500).json({ errors: [{ msg: "Internal Server Error" }] });
    }
  }
  
  static async blockUser(req, res) {
    try {
      const { national_id} = req.params; // Assuming the user ID is passed as a parameter
  
      // Check if the user exists
      const query = util.promisify(conn.query).bind(conn);
      const user = await query("SELECT * FROM user WHERE national_id = ?", [national_id]);
  
      if (user.length === 0) {
        return res.status(404).json({
          errors: [{ msg: "User not found!" }],
        });
      }
  
      // Check if the user has admin role (role = 2)
      if (user[0].role === 2) {
        return res.status(403).json({
          errors: [{ msg: "Cannot block an admin user." }],
        });
      }
  
      // Update the blocked status in the database
      await query("UPDATE user SET blocked = true WHERE national_id = ?", [national_id]);
  
      res.status(200).json({
        message: "User has been blocked successfully.",
      });
    } catch (err) {
      console.error('Error blocking user:', err);
      res.status(500).json({ errors: [{ msg: "Internal Server Error" }] });
    }
  }
    
}

module.exports = loginController;

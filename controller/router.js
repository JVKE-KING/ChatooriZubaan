const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const router = express.Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

// Importing Mongoose models for user registration and contact form
const Contact = require("../model/contact_schema");
const user = require("../model/register_schema");
const Menu = require("../model/menu_schema");

// =============================== 🚀 ROUTE HANDLERS FOR VIEWS 🚀 ===============================

// Home Page Route
router.get("/", function (req, res) {
  res.render("index");
});

// About Page Route
router.get("/about", function (req, res) {
  res.render("about");
});

// Menu Page Route
router.get("/menu", async function (req, res) {
  try {
    const menuItemDisplay = await Menu.find({});
    res.render("menu", { menuItemDisplay: menuItemDisplay });
    console.log(menuItemDisplay);
  } catch (err) {
    console.log(err);
  }
});

// Blog Page Route
router.get("/blog", function (req, res) {
  res.render("blog");
});

// Contact Page Route
router.get("/contact", function (req, res) {
  res.render("contact");
});

// =============================== 🚀 DASHBOARD ROUTES 🚀 ===============================

// Dashboard Main Page Route
router.get("/dashboard", function (req, res) {
  if (req.session.user && req.cookies.user_sid) {
    res.render("dashboard/dashboard");
  } else {
    res.redirect("/");
  }
});

// Dashboard Menu Page Route
router.get("/dashboard_menu", async function (req, res) {
  try {
    const menuitem = await Menu.find({});
    res.render("dashboard/dashboard_menu", { menuitem: menuitem });
    console.log(menuitem);
  } catch (err) {
    console.log(err);
  }
});

// Dashboard Menu List Page Route
router.get("/dashboard_menu_list", async function (req, res) {
  try {
    const menuItem = await Menu.find({});
    res.render("dashboard/menu_list", { menuItem: menuItem });
    console.log(menuItem);
  } catch (err) {
    console.log(err);
  }
});

// Dashboard Product Details Page Route
router.get("/dashboard_product_details/:id", async function (req, res) {
  try {
    const productDetails = await Menu.findById(req.params.id);
    res.render("dashboard/product_details", { productDetails: productDetails });
    console.log(productDetails);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// Fetch and Display Registered Users on Dashboard
router.get("/dashboard/customer", async function (req, res) {
  try {
    const userdata = await user.find({});
    res.render("dashboard/customer", { userdata: userdata });
    console.log(userdata);
  } catch (err) {
    console.log(err);
  }
});

// Fetch and Display Contact Messages on Dashboard
router.get("/dashboard/customer_contact", async function (req, res) {
  try {
    const customerData = await Contact.find({});
    res.render("dashboard/customer_contact", { customerData: customerData });
    console.log(customerData);
  } catch (err) {
    console.log(err);
  }
});

// =============================== 🚀 MODEL ROUTES 🚀 ===============================

// Registration Schema Model Route
router.get("/register_schema", function (req, res) {
  res.render("modal/register_schema");
});

// Contact Schema Model Route
router.get("/contact_schema", function (req, res) {
  res.render("modal/contact_schema");
});

// Menu Schema Model Route
router.get("/menu_schema", function (req, res) {
  res.render("modal/menu_schema");
});

// =============================== 🚀 USER REGISTRATION ROUTE 🚀 ===============================

// User Registration (POST request)
router.post("/register", (req, res) => {
  const register = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };

  const regpost = new user(register);
  regpost
    .save()
    .then(() => res.json("Register Successfully..."))
    .catch((err) => res.status(400).json("error:" + err));
});

// =============================== 🚀 LOGIN REGISTRATION ROUTE 🚀 ===============================

// Login Registration (POST request)
router.post("/login", async (req, res) => {
  const Login = {
    email: req.body.email,
    password: req.body.password,
  };
  try {
    const loginUser = await user.findOne({ email: Login.email }).exec();
    if (!loginUser) {
      return res.redirect("/"); // Added return to stop execution
    }
    loginUser.comparePassword(Login.password, (error, match) => {
      if (!match) {
        return res.redirect("/"); // Added return to prevent multiple responses
      }
      req.session.user = loginUser;
      return res.redirect("/dashboard"); // Added return to ensure only one response is sent
    });
  } catch (err) {
    console.log(err);
  }
});

// =============================== 🚀 FORGOT PASSWORD ROUTE 🚀 ===============================

// GET - Forget Password Page
router.get("/forgetPassword", (req, res) => {
  res.render("forgetPassword", { error: null, message: null });
});

// POST - Handle Forget Password
router.post("/forgetPassword", async (req, res) => {
  try {
    const email = req.body.email;
    const existingUser = await user.findOne({ email });

    if (!existingUser) {
      return res.render("forgetPassword", {
        error: "Email not found",
        message: null,
      });
    }

    // Generate Reset Token
    const resetToken = crypto.randomBytes(20).toString("hex");
    existingUser.resetPasswordToken = resetToken;
    existingUser.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await existingUser.save();

    // Send Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "shubhambrown1@gmail.com",
        pass: "qsti axbt gzzj duqk",
      },
    });

    const mailOptions = {
      to: existingUser.email,
      from: "shubhambrown1@gmail.com",
      subject: "Password Reset",
      html: `<p>Hello ${user.name || "User"},</p>
            <p>Click the link below to reset your password:</p>
            <a href="http://localhost:8080/resetPassword/${resetToken}">Reset Password</a>`,
    };

    await transporter.sendMail(mailOptions);
    res.render("forgetPassword", {
      error: null,
      message: "Reset link sent to your email.",
    });
  } catch (error) {
    console.error("Forget Password Error:", error);
    res.render("forgetPassword", {
      error: "Something went wrong",
      message: null,
    });
  }
});

// GET - Reset Password Page
router.get("/resetPassword/:token", async (req, res) => {
  try {
    const foundUser = await user.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!foundUser) {
      return res.render("resetPassword", {
        error: "Invalid or expired token",
        message: null,
        token: null,
      });
    }

    res.render("resetPassword", {
      error: null,
      message: null,
      token: req.params.token,
    });
  } catch (error) {
    console.error(error);
    res.render("resetPassword", {
      error: "Something went wrong",
      message: null,
      token: null,
    });
  }
});

// POST - Handle Reset Password
router.post("/resetPassword/:token", async (req, res) => {
  try {
    const foundUser = await user.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!foundUser) {
      return res.render("resetPassword", {
        error: "Invalid or expired token",
        message: null,
        token: null,
      });
    }

    // Hash New Password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    foundUser.pass = hashedPassword;

    // Clear Token and Expiry
    await foundUser.updateOne(
      { email: foundUser.email },
      {
        $set: { pass: hashedPassword },
        $unset: { resetPasswordToken: "", resetPasswordExpires: "" },
      }
    );

    console.log("Password Updated Successfully");
    res.status(200).json({
      message: "Password reset successful! Please login.",
      showForgetPassword: true,
    });
  } catch (error) {
    console.error("Password Reset Error:", error);
    res.render("resetPassword", {
      error: "Something went wrong",
      message: null,
      token: null,
    });
  }
});
// =============================== 🚀 CONTACT FORM SUBMISSION 🚀 ===============================

// Contact Form Submission (POST request)
router.post("/contact", (req, res) => {
  const contactData = {
    name: req.body.name,
    email: req.body.email,
    number: req.body.number,
    message: req.body.message,
  };

  const contpost = new Contact(contactData);
  contpost
    .save()
    .then(() => res.json("Contact Successfully...."))
    .catch((err) => res.status(400).json("error" + err));
});

// File Upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./upload");
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/png", "image/webp"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let uploadfile = multer({ storage, fileFilter });

// Menu Form Submission (POST request)
router.post("/menuItem", uploadfile.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Image upload is required" });
  }

  const menuData = {
    dishName: req.body.dishName,
    category: req.body.category,
    price: req.body.price,
    offer: req.body.offer.trim() === "" ? "No Offer" : req.body.offer,
    availability: req.body.availability,
    ingredients: req.body.ingredients,
    description: req.body.description,
    image: req.file.filename,
    spicyLevel: req.body.spicyLevel,
    vegan: req.body.vegan === "on",
  };

  const menupost = new Menu(menuData);
  menupost
    .save()
    .then(() => res.json("Menu Uploaded Successfully...."))
    .catch((err) => res.status(400).json("error" + err));
});

// =============================== 🚀 DELETE ROUTES 🚀 ===============================

// Delete a Registered User by ID
router.get("/delete/:id", async (req, res) => {
  try {
    const deletedUser = await user.findByIdAndDelete(req.params.id);
    res.redirect("/dashboard/customer");
  } catch (err) {
    console.log(err);
  }
});

// Delete a Contact Message by ID
router.get("/delete2/:id", async (req, res) => {
  try {
    const customerData = await Contact.findByIdAndDelete(req.params.id);
    res.redirect("/dashboard/customer_contact");
  } catch (err) {
    console.log(err);
  }
});

// Delete Menu Item by ID
router.get("/delete3/:id", async (req, res) => {
  try {
    const menuItem = await Menu.findByIdAndDelete(req.params.id);
    res.redirect("/dashboard_menu_list");
  } catch (err) {
    console.log(err);
  }
});

// =============================== 🚀 EDIT ROUTES 🚀 ===============================

// Edit a Registered User by ID
router.get("/edit/:id", async (req, res) => {
  try {
    const editRegdata = await user.findById(req.params.id);
    res.render("dashboard/edit_register", { editRegdata: editRegdata });
  } catch (err) {
    console.log(err);
  }
});

router.post("/edit/:id", async (req, res) => {
  const updateData = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };

  try {
    const updateItem = await user.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!updateItem) {
      return res.status(404).json({ message: "Item Not Found" });
    }
    res.redirect("/dashboard/customer");
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Edit a Contact Message by ID
router.get("/edit2/:id", async (req, res) => {
  try {
    const editConctactdata = await Contact.findById(req.params.id);
    res.render("dashboard/edit_contact", {
      editConctactdata: editConctactdata,
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/edit2/:id", async (req, res) => {
  const updateContactData = {
    name: req.body.name,
    email: req.body.email,
    number: req.body.number,
  };

  try {
    const updateContactItem = await Contact.findByIdAndUpdate(
      req.params.id,
      updateContactData,
      { new: true }
    );
    if (!updateContactItem) {
      return res.status(404).json({ message: "Item Not Found" });
    }
    res.redirect("/dashboardcustomer_contact/");
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Edit a Menu Item by ID
router.get("/edit3/:id", async (req, res) => {
  try {
    const editMenuItem = await Menu.findById(req.params.id);
    res.render("dashboard/edit_menu", {
      editMenuItem: editMenuItem,
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/edit3/:id", async (req, res) => {
  const updateMenuItem = {
    dishName: req.body.dishName,
    category: req.body.category,
    price: req.body.price,
    offer: req.body.offer,
    image: req.body.image,
    availability: req.body.availability,
    ingredients: req.body.ingredients,
    description: req.body.description,
    spicyLevel: req.body.spicyLevel,
    vegan: req.body.vegan,
  };

  try {
    const updateMenuItem = await Menu.findByIdAndUpdate(
      req.params.id,
      updateMenuItem,
      { new: true }
    );
    if (!updateMenuItem) {
      return res.status(404).json({ message: "Item Not Found" });
    }
    res.redirect("/dashboard/menu_list");
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});
// Exporting the router for use in the main application
module.exports = router;

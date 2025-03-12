var express = require("express");
var router = express.Router();

require("../models/connection");
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");

const uid2 = require("uid2");
const bcrypt = require("bcrypt");

router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ["username", "password"])) {
    res.json({
      result: false,
      error: "Please fill in all the required fields",
    });
    return;
  }

  User.findOne({ username: req.body.username }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        username: req.body.username,
        password: hash,
        token: uid2(32),
      });
      newUser.save().then((newData) => {
        res.json({ result: true, newUser: newData });
      });
    } else {
      res.json({ result: false, error: "User already exists in database" });
    }
  });
});

router.post("/login", (req, res) => {
  if (!checkBody(req.body, ["username", "password"])) {
    res.json({
      result: false,
      error: "Please fill in all the required fields",
    });
    return;
  }

  User.findOne({ username: req.body.username }).then((data) => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, connectedUser: data });
    } else {
      res.json({ result: false, error: "Wrong username or password" });
    }
  });
});

router.get("/findUser/:username", (req, res) => {
  User.findOne({ username: req.params.username }).then((data) => {
    if (data) {
      res.json({ result: true, user: data.username });
    } else {
      res.json({ result: false, error: "Couldn't find user in database" });
    }
  });
});

// route pour changer le mot de passe
router.post("/changePassword", async (req, res) => {
  console.log(req.body);
  const { username, oldPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res
        .status(404)
        .json({ result: false, message: "Utilisateur non trouvé" });
    }
    // Vérification l'ancien mot de passe
    const isMatch = bcrypt.compareSync(req.body.oldPassword, user.password); // comparaison des mots de passe
    if (!isMatch) {
      return res
        .status(400)
        .json({ result: false, message: "Ancien mot de passe incorrect" });
    }
    // Mettre à jour le mot de passe
    const hash = bcrypt.hashSync(req.body.newPassword, 10);
    user.password = hash;
    await user.save();

    res.json({ result: true, message: "Mot de passe changé avec succès" });
  } catch (error) {
    res.status(500).json({ result: false, message: "Erreur serveur" });
  }
});

router.get("/findUserByID/:_id", (req, res) => {
  User.findOne({_id : req.params._id})
  .then(data => {
    if(data)
    {
      res.json({result : true, user : data.username});
    }
    else
    {
      res.json({result : false, error : "Couldn't find user in database"});
    }
  });
});

router.delete("/deleteAccount/:username", (req, res) => {
  User.findOne({ username: req.params.username }).then((data) => {
    if (data) {
      User.deleteOne({ username: data.username }).then((newData) => {
        res.json({ result: true, update: newData });
      });
    } else {
      res.json({ result: false, error: "Couldn't find user in database" });
    }
  });
});

module.exports = router;

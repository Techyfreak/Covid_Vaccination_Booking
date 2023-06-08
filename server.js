const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");
const path = require("path");
const db = require("./db"); // connecting db and server.js

app.use(express.json()); // to bring the data into format

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/register", (req, res) => {
  res.render("signup");
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  db.query(
    "insert into User(email,user_password) values (?,?)",
    [email, password],
    (error, results) => {
      if (!error) {
        // res.json(results);
        res.redirect("/login");
      } else {
        console.log(error);
      }
    }
  );
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM User WHERE email = ?", [email], (error, results) => {
    if (!error) {
      if (results[0].user_password == password) {
        res.redirect("/searchcentre");
        // localStorage.setItem("auth", "true");
      } else {
        res.redirect("/login");
      }
    }
  });
});

// admin login starts

app.get("/admin/register", (req, res) => {
  res.render("admin/signup");
});

app.post("/admin/register", (req, res) => {
  const { email, password } = req.body;
  db.query(
    "insert into adminLogin(email,password) values (?,?)",
    [email, password],
    (error, results) => {
      if (!error) {
        // res.json(results);
        res.redirect("/admin/login");
      } else {
        console.log(error);
        res.redirect("/admin/register")
      }
    }
  );
});

app.get("/admin/login", (req, res) => {
  res.render("admin/login");
});

app.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;
  db.query(
    "SELECT * FROM adminLogin WHERE email = ?",
    [email],
    async (error, results) => {
      if (!error) {
        if (results[0].password == password) {
          await res.redirect("/admin/allcentres");
        } else {
          res.redirect("/login");
        }
      } else {
        console.log(error);
      }
    }
  );
});

// admin login ends

// centre starts
app.get("/admin/allcentres", (req, res) => {
  db.query("SELECT * FROM Center", (error, results) => {
    if (!error) {
      res.render("admin/viewCentres", { centres: results });
    } else {
      console.log(error);
    }
  });
});

app.post("/addcentre", (req, res) => {
  const { centerName, centerAddress, centerCity, slotsFilled } = req.body;
  db.query(
    "INSERT INTO Center(centre_name, centre_address, centre_city, slots_filled) VALUES(?, ?, ?, ?)",
    [centerName, centerAddress, centerCity, slotsFilled],
    (error, results) => {
      if (!error) {
        res.redirect("/admin/allcentres");
      } else {
        console.log(error);
      }
    }
  );
});

app.get("/update/:id", (req, res) => {
  const id = req.params.id;
  db.query(
    "SELECT * FROM Center WHERE centre_id = ?",
    [id],
    (error, results) => {
      if (!error) {
        const cent = results[0];
        res.render("admin/updateCentre", { results: results });
      } else {
        console.log(error);
      }
    }
  );
  res.render("admin/updateCentre");
});

app.put("/updatecentre/:id", (req, res) => {
  const { name, address, city, slots_filled } = req.body;
  const id = req.params.id;
  db.query(
    "UPDATE Center SET centre_name = ?, centre_address = ?, centre_city = ?, slots_filled = ? WHERE centre_id = ?",
    [name, address, city, slots_filled, id],
    (error, results) => {
      if (!error) {
        res.json(results);
      } else [console.log(error)];
    }
  );
});

app.delete("/deletecentre/:id", (req, res) => {
  const id = req.params.id;
  db.query(
    "DELETE from Center WHERE centre_id = ?",
    [id],
    async (error, results) => {
      if (!error) {
        // await res.redirect("/admin/allcentres");
        console.log(results);
      } else {
        console.log(error);
      }
    }
  );
});
// centre ends

// dosage starts

app.get("/admin/dosages", (req, res) => {
  db.query("SELECT * FROM dosages", (error, results) => {
    if (!error) {
      res.render("admin/dosages", { dosages: results });
    } else {
      console.log(error);
    }
  });
});

app.post("/adddosagedetails", (req, res) => {
  const { centre_name, dosages, dosages_left } = req.body;
  db.query(
    "INSERT INTO dosages(centre_name, dosages, dosages_left) VALUES(?, ?, ?)",
    [centre_name, dosages, dosages_left],
    (error, results) => {
      if (!error) {
        // res.json(results);
        res.redirect("/admin/dosages");
      } else {
        console.log(error);
      }
    }
  );
});

app.put("/updatedosagedetails/:id", (req, res) => {
  const { centre_name, dosages, dosages_left } = req.body;
  const id = req.params.id;
  db.query(
    "UPDATE dosages SET centre_name = ?, dosages = ?, dosages_left = ? WHERE dosages_id = ?",
    [centre_name, dosages, dosages_left, id],
    (error, results) => {
      if (!error) {
        res.json(results);
      } else [console.log(error)];
    }
  );
});

app.delete("/deletedosagedetails/:id", (req, res) => {
  const id = req.params.id;
  db.query(
    "DELETE from dosages WHERE dosages_id  = ?",
    [id],
    (error, results) => {
      if (!error) {
        res.json(results);
      } else [console.log(error)];
    }
  );
});

// dosage ends
app.get("/searchcentre", (req, res) => {
  db.query("SELECT * FROM Center", (error, results) => {
    if (!error) {
      res.render("searchCentre", { centres: results });
    } else {
      console.log(error);
    }
  });
});

app.get("/searchcentre", (req, res) => {
  res.render("searchCentre");
});

app.get("/searchpage", (req, res) => {
  const data = req.query.value;
  // console.log(data);
  // console.log(JSON.parse(data));
  res.render("searchPage", { centres: JSON.parse(data) });
});

app.post("/searchcentre", (req, res) => {
  const { search } = req.body;
  db.query(
    "SELECT * FROM Center WHERE centre_name = ?",
    [search],
    (error, results) => {
      if (!error) {
        // res.redirect("searchpage", { centres: results });
        res.redirect("/searchpage/?value=" + JSON.stringify(results));
        // res.json(results)
        // console.log(results);
      }
    }
  );
});

app.listen(8080, () => {
  console.log("server is running 8080");
});

var express = require("express");
var router = express.Router();
var authentication_mdl = require("../middlewares/authentication");
var session_store;
/* GET penjualan page. */

router.get("/", authentication_mdl.is_login, function (req, res, next) {
  req.getConnection(function (err, connection) {
    var query = connection.query(
      "SELECT * FROM penjualan",
      function (err, rows) {
        if (err) var errornya = ("Error Selecting : %s ", err);
        req.flash("msg_error", errornya);
        res.render("penjualan/list", {
          title: "penjualan",
          penjualan: rows,
          session_store: req.session,
        });
      }
    );
    //console.log(query.sql);
  });
});

router.delete(
  "/delete/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.getConnection(function (err, connection) {
      var penjualan = {
        id: req.params.id,
      };

      var delete_sql = "delete from penjualan where ?";
      req.getConnection(function (err, connection) {
        var query = connection.query(
          delete_sql,
          penjualan,
          function (err, result) {
            if (err) {
              var errors_detail = ("Error Delete : %s ", err);
              req.flash("msg_error", errors_detail);
              res.redirect("/penjualan");
            } else {
              req.flash("msg_info", "Data Beras Berhasil di Hapus!");
              res.redirect("/penjualan");
            }
          }
        );
      });
    });
  }
);
router.get(
  "/edit/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.getConnection(function (err, connection) {
      var query = connection.query(
        "SELECT * FROM penjualan where id=" + req.params.id,
        function (err, rows) {
          if (err) {
            var errornya = ("Error Selecting : %s ", err);
            req.flash("msg_error", errors_detail);
            res.redirect("/penjualan");
          } else {
            if (rows.length <= 0) {
              req.flash("msg_error", "Data tidak bisa ditemukan!");
              res.redirect("/penjualan");
            } else {
              console.log(rows);
              res.render("penjualan/edit", {
                title: "Edit ",
                penjualan: rows[0],
                session_store: req.session,
              });
            }
          }
        }
      );
    });
  }
);
router.put(
  "/edit/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.assert("jenisberas", "Please fill the JenisBeras").notEmpty();
    var errors = req.validationErrors();
    if (!errors) {
      v_jenisberas = req.sanitize("jenisberas").escape().trim();
      v_harga = req.sanitize("harga").escape().trim();
      v_stok = req.sanitize("stok").escape().trim();

      var penjualan = {
        jenisberas: v_jenisberas,
        harga: v_harga,
        stok: v_stok,
      };

      var update_sql = "update penjualan SET ? where id = " + req.params.id;
      req.getConnection(function (err, connection) {
        var query = connection.query(
          update_sql,
          penjualan,
          function (err, result) {
            if (err) {
              var errors_detail = ("Error Update : %s ", err);
              req.flash("msg_error", errors_detail);
              res.render("penjualan/edit", {
                jenisberas: req.param("jenisberas"),
                harga: req.param("harga"),
                stok: req.param("stok"),
              });
            } else {
              req.flash("msg_info", "Data Berhasil di Ubah");
              res.redirect("/penjualan/edit/" + req.params.id);
            }
          }
        );
      });
    } else {
      console.log(errors);
      errors_detail = "<p>Sory there are error</p><ul>";
      for (i in errors) {
        error = errors[i];
        errors_detail += "<li>" + error.msg + "</li>";
      }
      errors_detail += "</ul>";
      req.flash("msg_error", errors_detail);
      res.redirect("/penjualan/edit/" + req.params.id);
    }
  }
);

router.post("/add", authentication_mdl.is_login, function (req, res, next) {
  req.assert("jenisberas", "Please fill the JenisBeras").notEmpty();
  var errors = req.validationErrors();
  if (!errors) {
    v_jenisberas = req.sanitize("jenisberas").escape();
    v_harga = req.sanitize("harga").escape();
    v_stok = req.sanitize("stok").escape();

    var penjualan = {
      jenisberas: v_jenisberas,
      harga: v_harga,
      stok: v_stok,
    };

    var insert_sql = "INSERT INTO penjualan SET ?";
    req.getConnection(function (err, connection) {
      var query = connection.query(
        insert_sql,
        penjualan,
        function (err, result) {
          if (err) {
            var errors_detail = ("Error Insert : %s ", err);
            req.flash("msg_error", errors_detail);
            res.render("penjualan/add-penjualan", {
              jenisberas: req.param("jenisberas"),
              harga: req.param("harga"),
              stok: req.param("stok"),
              session_store: req.session,
            });
          } else {
            req.flash("msg_info", "Data Beras Berhasil di Tambahkan!");
            res.redirect("/penjualan");
          }
        }
      );
    });
  } else {
    console.log(errors);
    errors_detail = "<p>Sory there are error</p><ul>";
    for (i in errors) {
      error = errors[i];
      errors_detail += "<li>" + error.msg + "</li>";
    }
    errors_detail += "</ul>";
    req.flash("msg_error", errors_detail);
    res.render("penjualan/add-penjualan", {
      jenisberas: req.param("jenisberas"),
      harga: req.param("harga"),
      session_store: req.session,
    });
  }
});

router.get("/add", authentication_mdl.is_login, function (req, res, next) {
  res.render("penjualan/add-penjualan", {
    title: "Tambah Data Beras",
    jenisberas: "",
    harga: "",
    stok: "",
    session_store: req.session,
  });
});

module.exports = router;

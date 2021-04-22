//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB" , {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const articleSchema = {
  title:String,
  content:String
};

const Article = mongoose.model("Article" , articleSchema);

app.route("/articles")
.get(function(req , res) {
  Article.find({} , function(err , foundArticles) {
  if(!err)
  {
      res.send(foundArticles);
  }
  else {
    res.send(err);
  }
  })
})

.post(function(req , res) {

const Newarticle = new Article(
  {
    title:req.body.title,
    content:req.body.content
  }
);

Newarticle.save(function (err) {
  if(!err)
  {
    res.send("Succesfully added a new Article");
  }else {
    res.send(err);
  }

});

})
.delete(function(req , res) {
  Article.deleteMany(function (err) {
    if(!err)
    {
      res.send("Succesfully deleted all articles");
    }
    else {
      res.send(err);
    }

  });

});
/////////////REQUEST SPECIFIC ARTICLE//////////////////


app.route("/articles/:Newarticle")

.get(function(req , res) {
Article.findOne({title : req.params.Newarticle} , function(err , NewfoundArticle) {
  if(NewfoundArticle)
  {
    res.send(NewfoundArticle);

  }
  else {
    res.send("No Such Article Found");
  }

})


})
.put(function(req , res) {

  Article.update({title : req.params.Newarticle},
     {title : req.body.title , content:req.body.content},
     {overwrite:true},
     function functionName(err) {
       if(!err)
       {
         res.send("Updated Succesfully")
       }

       });

})
.patch(function(req , res) {

  Article.update({title : req.params.Newarticle},
     {title : req.body.title , content:req.body.content},
     {$set:req.body},
     function functionName(err) {
       if(!err)
       {
         res.send("Updated Succesfully")
       }
       else {
         res.send(err)
       }

       });

})
.delete(function(req , res) {
  Article.deleteOne( {title: req.params.Newarticle} , function (err) {
    if(!err)
    {
      res.send("Succesfully deleted the article");
    }
    else {
      res.send(err);
    }

  });

});





app.listen(3000, function() {
  console.log("Server started on port 3000");
});

var express = require('express');
var OrientDB = require('orientjs');
var bodyParser = require('body-parser');
var PersonModal = require('./modal.js');
var app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false });
var server,results;
app.use(express.static('views'));
app.set('view engine','ejs');
app.get('/',function(req,res){

  res.sendFile(__dirname + '/public/index.html')
});

app.post('/postmethod',urlencodedParser, async function(req,res){
  Connect();
  var PersonName = req.body.name.trim();
  var noIc = req.body.noic.trim();
  var NoPhone = req.body.nophone.trim();

  results = await query(PersonName,noIc,NoPhone);
  res.render('edge-renderers');

});

app.get('/searching', function(req, res){
 res.send(results);
});


function Connect(){


   server = OrientDB({
     host:       'localhost',
     port:       2424,
     username:   'root', //username admin
     password:   '1234' //password
  });
}

async function query(PersonName,noIc,NoPhone){
return new Promise(function (resolve, reject) {
  var db = server.use('HumanRelations');
var result;
  var hitters = db.query("select name, out('SiblingNode').name AS Siblings, out('SiblingNode').phoneNo AS SPhoneNo,out('SiblingNode').identityNo AS SIC,"+
              "  in('ParentNode').name As Parents, in('ParentNode').phoneNo As PPhoneNo,in('ParentNode').identityNo As PIC,"+
              " out('neighbourNode').name AS Neighbour, out('neighbourNode').phoneNo AS NPhoneNo,out('neighbourNode').identityNo AS NIC"+
              " from Person where name = :name and phoneNo = :phoneNo and identityNo = :identityNo", {params: {  name: PersonName , phoneNo : NoPhone , identityNo : noIc }})
.all()
   .then(
      function(select){
        const graph =   PersonModal.newCreate();
         result = select[0];
      var count = select.length;
       graph.addPersonNode(PersonName,noIc,NoPhone);
      if (count >0){
        // parent_s
        for(var i =0 ; i<result.Parents.length;i++){
          graph.addparentNode(result.Parents[i],result.PIC[i],result.PPhoneNo[i]);
          graph.addEdge(PersonName,result.Parents[i],"parent");
        }
         // for siblings
         for( var i = 0;i<result.Siblings.length;i++){
           graph.addsiblingNode(result.Siblings[i],result.SIC[i],result.SPhoneNo[i]);
           graph.addEdge(PersonName,result.Siblings[i],"sibling");
         }
         // neighbour
         for(var i =0 ; i<result.Neighbour.length;i++){
           graph.addneighbourNode(result.Neighbour[i],result.NIC[i],result.NPhoneNo[i]);
           graph.addEdge(PersonName,result.Neighbour[i],"neighbour");
         }

      }
       resolve(result);
        server.close();

      }
   );

 });
}
app.listen(3000);
console.log(" listening to port 3000" );

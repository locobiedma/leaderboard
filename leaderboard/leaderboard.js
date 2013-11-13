// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

//El mayor solo se usa para insertar templetes

Players = new Meteor.Collection("players"); //esta linea es la que une todo

if (Meteor.isClient) { //si me estoy ejecutando en el cliente
  Template.leaderboard.players = function () {
    return Players.find({}, {sort: Session.get("SortBy")}); //quiero saber el valor de la variable sort_By
  };

  Template.leaderboard.selected_name = function () {
    var player = Players.findOne(Session.get("selected_player")); //busco en la base de datos
    return player && player.name;
  };

  Template.player.selected = function () {
    return Session.equals("selected_player", this._id) ? "selected" : '';
  };

  Template.leaderboard.events({
    'click input.inc': function () {
      Players.update(Session.get("selected_player"), {$inc: {score: 5}});
    }
  });
  
  Template.leaderboard.events({
    'click #eliminar': function () {
      Players.remove(Session.get("selected_player"));
    }
  });

  Template.player.events({
    'click': function () {
      Session.set("selected_player", this._id); //cambia la sesion al valor que tengo seleccionado
    }
  });  
  Template.cientifico.events({
    'click #boton': function () {//cuando se haga click sobre lo que tiene boton
     var value = $('#message').val();
     if(value != ''){
        Players.insert({name: value, score:0});
     }
    }
  });
  
  Template.cientifico.events({   //este es para el reset
    'click #reset': function () {//cuando se haga click sobre lo que tiene reset
        Players.find({}).forEach(function(cientifico) {
        Players.update(cientifico._id, {$set: { score: 0}});
  }
  )}
  });
  
  Template.leaderboard.events({
    'click #ord_alf': function () {
      Session.set("SortBy", {name: 1, score: -1}); 
    }
  });  
  
  Template.leaderboard.events({
    'click #ord_punt': function () {
      Session.set("SortBy", {score: -1,name: 1}); //cambia la sesion al valor que tengo seleccionado
    }
  });  
  
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Players.find().count() === 0) {  //si la base de datos esta vacia
      var names = ["Ada Lovelace",
                   "Grace Hopper",
                   "Marie Curie",
                   "Carl Friedrich Gauss",
                   "Nikola Tesla",
                   "Claude Shannon"];
      for (var i = 0; i < names.length; i++)
        Players.insert({name: names[i], score: Math.floor(Random.fraction()*10)*5}); //inserta cientificos
    }
  });
}

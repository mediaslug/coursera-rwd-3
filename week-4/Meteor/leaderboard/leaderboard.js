PlayersList = new Mongo.Collection('players');

if (Meteor.isClient) {
  //If you imagine that the publish function is transmitting data into the ether, then the subscribe function is what we use to “catch” that data.
  Meteor.subscribe("thePlayers");
  // By creating helper functions, we can execute code from within a template, thereby creating a dynamic interface.
  // the helpers keyword is a special keyword that allows us to define multiple helper functions inside a single block of code.

  Template.leaderboard.helpers({
        // the helpers are defined in JSON format with the name of hte helper as the key and an associated function as the value
        player:function() {
          /*  

          The players will still be primarily ranked by their scores, but once that sorting has occurred,
          the players will also be ranked by their names. This secondary sorting will occur in ascending
          (alphabetical) order.

          */

          // get the current user
          var currentUser = Meteor.userId();
          return PlayersList.find({createdBy:currentUser}, {sort: {score: -1, name:1}});
        },

        selectedClass:function() {
          var playerId = this._id;
          // retrieve the unique ID of the currently selected player:
          var selectedPlayer = Session.get('selectedPlayer')
          if (playerId == selectedPlayer) {
            return "selected";
          }
          
        },

        count:function() {
          var currentUser = Meteor.userId();

          return PlayersList.find({createdBy:currentUser}).count();
        },

        showSelectedPlayer: function() {
          // retrieve the unique ID of the currently selected player:
          var selectedPlayer = Session.get('selectedPlayer')
          // returns the data from a single document inside the “PlayersList” collection
          return PlayersList.findOne(selectedPlayer);
        }
    
  });

  // , the events part is special keyword that’s used to specify that, within the coming block of code, we want to specify one or more events

  Template.leaderboard.events({

    'click .player':function() { // event selectors alow us to attach events to specific html elements
      var playerId = this._id;
      Session.set('selectedPlayer', playerId);

        // var selectedPlayer = Session.get('selectedPlayer');
    }, 

    'click .increment': function() {
      // use the unique id of the selectedPlayer
      var selectedPlayer = Session.get('selectedPlayer');
      /*
        This is the Mongo update function and, between the brackets, we can define:
        1. What document (player) we want to modify.
        2. How we want to modify that document.
      */

      //  this looks like it would work, but it deletes the entire document: PlayersList.update(selectedPlayer, {score: 5});
      /*
          Here, we’re using this $set operator to modify the value of a field (or multiple fields) without
          deleting the original document. 
      */
     // PlayersList.update(selectedPlayer, {$set:{score: 5}}); // this uses the set operator to set the value. we want to increment the value, so we'll use $inc
      PlayersList.update(selectedPlayer, {$inc:{score: 5}}) 
    },
    'click .decrement':function() {
      // retrieve the unique ID of the currently selected player:
      var selectedPlayer = Session.get('selectedPlayer');
      PlayersList.update(selectedPlayer, {$inc:{score: -5}});
  
    }, 

    'click .remove':function() {
      var selectedPlayer = Session.get('selectedPlayer');
      var confirm = window.confirm("want to delete?");
      if (confirm) {
        PlayersList.remove(selectedPlayer);  
      }
      
    }


  });
  // When an event is triggered from within a Meteor application, we can access information about that event as it occurs. 
  // passing this “event” keyword through the brackets of the event’s function
  // whatever keyword is passed through the brackets of event’s function as the first parameter becomes a reference for that event.
  Template.addPlayerForm.events({
    'submit form':function(event) {
      //event.preventDefault();
      // this statement uses the event object to grab whatever HTML element has the name attribute set to “playerName”.
      var playerNameVar = event.target.playerName.value;
      var scoreVar = parseInt(event.target.playerScore.value);
      var currentUser = Meteor.userId();
      console.log(playerNameVar);
      PlayersList.insert({
        name: playerNameVar,
        score: scoreVar, 
        createdBy: currentUser
      });

      //return false; 
    }

  });
      



} // end is client

if (Meteor.isServer) {
   // PlayersList.insert({name:"warrick", score:0})
   // PlayersList.insert({name:"tom", score:0})
   // console.log(PlayersList.find().fetch());

   // imagine that the publish function is transmitting data into the ether
   Meteor.publish('thePlayers', function() {
    var currentUserId = this.userId
    return PlayersList.find({createdBy: currentUserId});
   });

  
}


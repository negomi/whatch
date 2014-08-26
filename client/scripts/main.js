if (Meteor.isClient) {

  Movies = new Meteor.Collection('movies');
  Meteor.subscribe('movies');

  Template.modal.info = function() {
    return Session.get('movieInfo');
  };

  Template.modal.events({
    'click #add-movie': function(event, template) {
      event.preventDefault();

      // add to DB
      Movies.insert(Session.get('movieInfo'), function(err, id) {
        if (err) console.log(err);
        Session.set('movieInfo', []);
        // close modal
      });
    }
  });
}

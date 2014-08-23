if (Meteor.isClient) {

  Movies = new Meteor.Collection('movies');
  Meteor.subscribe('movies');

  String.prototype.isEmpty = function() {
    return this.length === 0 || !this.trim();
  };

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

  Template.movies.movies = function() {
    return Movies.find({}).fetch().reverse();
  };
}

if (Meteor.isClient) {

  Template.modal.helpers({
    info: function () {
      return Session.get('movieInfo');
    },
    hasMovie: function() {
      var movie = Session.get('movieInfo');
      if (movie) {
        return Movies.findOne({owner: Meteor.userId(), imdbID: movie.imdbID });
      }
    }
  });

  Template.modal.events({
    // Save the current movie to the database.
    'click .add-movie': function(event, template) {
      event.preventDefault();
      var apiData = Session.get('movieInfo');

      var movie = _.extend(apiData, {
        owner: Meteor.userId(),
        added: Date.now(),
        dateReleased: new Date(apiData.Released),
        length: Number(apiData.Runtime.replace(' min', ''))
      });

      Movies.insert(movie, function(err, id) {
        if (err) console.log(err);
        modal.close();
      });
    },

    'click .close': function(event, template) {
      modal.close();
    }
  });
}

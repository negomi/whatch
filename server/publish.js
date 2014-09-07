if (Meteor.isServer) {

  Meteor.startup(function() {
    Movies = new Meteor.Collection('movies');

    Meteor.publish('movies', function() {
      return this.userId ? Movies.find({owner: this.userId}) : null;
    });

    Movies.allow({
      insert: function(userId, movie) {
        return (userId && movie.owner === userId);
      },
      remove: function(userId, movie) {
        return (userId && movie.owner === userId);
      }
    });
  });
}

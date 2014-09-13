if (Meteor.isClient) {

    Movies = new Meteor.Collection('movies');
    Meteor.subscribe('movies');
}

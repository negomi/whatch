if (Meteor.isClient) {

    Template.movies.movies = function() {
        return Movies.find({}).fetch().reverse();
    };

    Template.movies.events({
        'mouseenter .grid-item': function(event, template) {
            $(event.target.children[1]).slideDown('fast');
        },
        'mouseleave .grid-item': function(event, template) {
            $(event.target.children[1]).slideUp('fast');
        },
        'click .delete': function(event, template) {
            event.preventDefault();
            Movies.remove(this._id);
        }
    });
}

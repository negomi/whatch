if (Meteor.isClient) {

    Template.movies.movies = function() {
        return Movies.find({owner: Meteor.userId()}, {sort: {added: -1}});
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
            Movies.remove(this._id, function(err, id) {
                if (err) console.log(err);
            });
        }
    });
}

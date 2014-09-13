if (Meteor.isClient) {

    Template.logout.events({
        // Log the user out.
        'click .logout': function(event, template) {
            event.preventDefault();
            Meteor.logout();
        }
    });
}

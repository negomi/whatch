Template.logout.events({
    'click .logout': function(event, template) {
        event.preventDefault();
        Meteor.logout();
    }
});

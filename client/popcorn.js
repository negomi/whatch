if (Meteor.isClient) {

  String.prototype.isEmpty = function() {
    return this.length === 0 || !this.trim();
  };

  var keyAction = function(key) {
    if (key === 8 || (key >= 48 && key <= 90))
      return 'search';
    else if (key === 40)
      return 'downArrow';
    else if (key === 38)
      return 'upArrow';
  };

  Template.search.helpers({
    results: function() {
      return Session.get("searchResults");
    }

  });

  Template.search.events({
    'keyup #search-form': function(event, template) {
      if (keyAction(event.which) === 'search') {
        var searchTerm = template.find('#search-form').value;
        if (searchTerm.isEmpty()) {
          Session.set("searchResults", []);
        } else {
          // call to API
          $.ajax({
            url: 'http://www.omdbapi.com/?s=' + searchTerm,
            dataType: 'json',
            success: function(data, textStatus, jqXHR) {
              if ('undefined' !== typeof data.Search)
                Session.set('searchResults', data.Search);
            },
            error: function(jqXHR, textStatus, errorThrown) {
              console.error(errorThrown.message);
            }
          });
        }
      }
    },
    'keypress #search-form': function(event, template) {
      if (keyAction(event.which) === 'downArrow') {
        console.log(this.firstNode);
        console.log(this);
        // if li.nextchild
        // focus on next li down the list
      } else if (keyAction(event.which) === 'upArrow') {
        // if li.prevchild
        // focus on next li up the list
      }
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

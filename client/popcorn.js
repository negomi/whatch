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
    'click, keydown #results': function(event, template) {
      event.preventDefault();
      var key = event.which;

      if (key === 1 || pressed(key) === 'enter') {
        var imdbId = event.target.dataset.imdbid || event.target.parentNode.dataset.imdbid;
        fetchDetails(imdbId);
        Session.set('searchResults', []);
        $('#search-form').val('');
      }

      if (pressed(key) === 'down') {
        event.preventDefault();
        if (document.activeElement.nextElementSibling)
          document.activeElement.nextElementSibling.focus();
      }

      if (pressed(key) === 'up') {
        if (document.activeElement.previousElementSibling)
          document.activeElement.previousElementSibling.focus();
        else
          $('#search-form').focus();
      }
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });


  Template.movies.movies = function() {
    return Movies.find({}).fetch().reverse();
  };
}

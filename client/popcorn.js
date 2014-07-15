if (Meteor.isClient) {

  Movies = new Meteor.Collection('movies');
  Meteor.subscribe('movies');

  String.prototype.isEmpty = function() {
    return this.length === 0 || !this.trim();
  };

  var pressed = function(key) {
    if (key >= 48 && key <= 90)
      return 'alphNum';
    else if (key === 38)
      return 'up';
    else if (key === 40)
      return 'down';
    else if (key === 13)
      return 'enter';
    else if (key === 8)
      return 'delete';
  };

  var searchApi = function(title) {
    $.ajax({
      url: 'http://www.omdbapi.com/?s=' + title,
      dataType: 'json',
      success: function(data, textStatus, jqXHR) {
        if ('undefined' !== typeof data.Search)
          Session.set('searchResults', data.Search);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error(errorThrown.message);
      }
    });
  };

  var fetchDetails = function(imdbId) {
    // TODO if in DB, retrieve from there
    $.ajax({
      url: 'http://www.omdbapi.com/?i=' + imdbId,
      dataType: 'json',
      success: function(data, textStatus, jqXHR) {
        // show modal overlay with movie data
        Session.set('movieInfo', data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error(errorThrown.message);
      }
    });
  };

  Template.search.results = function() {
    return Session.get('searchResults');
  };

  Template.search.events({
    'keyup #search-form': function(event, template) {
      var key = event.which;
      if (pressed(key) === 'alphNum' || pressed(key) === 'delete') {
        var searchTerm = template.find('#search-form').value;
        if (searchTerm.isEmpty()) {
          Session.set('searchResults', []);
        } else {
          searchApi(searchTerm);
        }
      }
    },
    'keydown #search-form': function(event, template) {
      var key = event.which;
      if (pressed(key) === 'enter') {
        if (!_.isEqual(Session.get('searchResults'), [])) {
          // TODO bring up info of first result
          event.preventDefault();
          fetchDetails(template.lastNode.firstElementChild.dataset.imdbid);
          Session.set('searchResults', []);
        }
      }

      if (pressed(key) === 'down') {
        if (!_.isEqual(Session.get('searchResults'), []))
          template.lastNode.firstElementChild.focus();
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

  Template.modal.info = function() {
    return Session.get('movieInfo');
  };

  Template.modal.events({
    'click #add-movie': function(event, template) {
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

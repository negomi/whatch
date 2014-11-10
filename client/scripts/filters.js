if (Meteor.isClient) {

  // Return a sorted array of all types of a given property included
  // in the user's movie list, with any duplicate values removed.
  var listUniques = function(list, prop) {
    return _.chain(list)
      .map(function(item) { return item[prop]; })
      .map(function(itemStr) {
        return _.map(itemStr.split(','), function(el) { return el.trim(); });
      })
      .flatten()
      .uniq()
      .sortBy(function(name) { return name; })
      .value();
  };

  // Return an array of all the user's saved movies.
  var fetchMovies = function() {
    return Movies.find({owner: Meteor.userId()}).fetch();
  };

  // Uncheck all radio buttons.
  var resetSorting = function() {
    var radioButtons = $('.radio');
    _.each(radioButtons, function(e, i) { e.checked = false; });
  };

  // Uncheck all checkboxes.
  var resetFilters = function() {
    var checkboxes = $('.checkbox');
    _.each(checkboxes, function(e, i) { e.checked = false; });
  };

  Template.sidebar.helpers({
    genres: function() {
      return listUniques(fetchMovies(), 'Genre');
    },
    countries: function() {
      return listUniques(fetchMovies(), 'Country');
    },
    directors: function() {
      return listUniques(fetchMovies(), 'Director');
    },
    languages: function() {
      return listUniques(fetchMovies(), 'Language');
    }
  });

  Template.sidebar.events({
    'click .sidebar__filter': function(event, template) {
      event.preventDefault();
      var filter = $(event.target).data('filter');
      $('#' + filter).slideToggle('fast');
    },
    'click .radio': function(event, template) {
      resetSorting();
      $($('.sidebar__reset--sorting')[0]).show();
      event.target.checked = true;

      var sortType = event.target.parentNode.parentNode.id;
      var direction;

      if (event.target.value === 'asc') {
        direction = 1;
      } else if (event.target.value === 'desc') {
        direction = -1;
      }

      var sortOrder = {};
      sortOrder[sortType] = direction;
      Session.set('sortOrder', sortOrder);
    },

    'click .checkbox': function(event, template) {
      var filterType = event.target.parentNode.parentNode.id;
      var regex = Session.get(filterType + 'Filter') || '.*';

      if (event.target.checked) {
        $($('.sidebar__reset--filters')[0]).show();
        regex = '(?=.*\\b' + event.target.value + '\\b)' + regex;
      } else {
        regex = regex.replace('(?=.*\\b' + event.target.value + '\\b)', '');
      }

      Session.set(filterType + 'Filter', regex);

      // When a filter is cleared, check if all filters are cleared.
      // If so, hide the reset button.
      if (!event.target.checked) {
        var filters = ['genre', 'country', 'director', 'language'];
        var allUnchecked = _.all(filters, function(e, i) {
          return !Session.get(e + 'Filter') || Session.get(e + 'Filter') === '.*';
        });
        if (allUnchecked) {
          $($('.sidebar__reset--filters')[0]).hide();
        }
      }
    },

    'click .sidebar__reset--sorting': function(event, template) {
      event.preventDefault();
      resetSorting();

      // Clear sort order session variable.
      Session.set('sortOrder', '');

      // Slide up any open menus.
      var sortMenus = ['imdbRating', 'dateReleased', 'length'];
      _.each(sortMenus, function(e, i) { $('#' + e).slideUp('fast'); });

      // Hide the reset button.
      $($('.sidebar__reset--sorting')[0]).hide();
    },

    'click .sidebar__reset--filters': function(event, template) {
      event.preventDefault();
      resetFilters();

      var filters = ['genre', 'country', 'director', 'language'];
      _.each(filters, function(e, i) {
        // Clear filter session variable.
        Session.set(e + 'Filter', '');
        // Slide up any open menus.
        $('#' + e).slideUp('fast');
      });

      // Hide the reset button.
      $($('.sidebar__reset--filters')[0]).hide();
    }
  });
}

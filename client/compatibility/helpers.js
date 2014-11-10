// Check for an empty string.
String.prototype.isEmpty = function() {
  return this.length === 0 || !this.trim();
};

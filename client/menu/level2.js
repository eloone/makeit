Template['menu-level2'].home = function () {
  return Session.get('home');
};

Template['menu-level2'].new = function () {
  return Session.get('new');
};

Template['menu-level2'].all = function () {
  return Session.get('tag') == 'all';
};
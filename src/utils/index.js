const getSortOption = (filterString) => {
  switch (filterString) {
    case 'Latest':
      return '-postedDate';
    case 'Oldest':
      return 'postedDate';
    default:
      return 'postedDate';
  }
};

module.exports = {
  getSortOption,
};

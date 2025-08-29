// Returns a filter object and pagination options for Mongoose based on req.query
function buildFilterAndPagination(query) {
  const filter = { ...query };
  const pagination = {};

  // Remove known pagination and field params
  const offset = parseInt(filter.offset, 10);
  const limit = parseInt(filter.limit, 10);
  delete filter.offset;
  delete filter.limit;
  delete filter.fields;

  if (!isNaN(offset)) pagination.skip = offset;
  if (!isNaN(limit)) pagination.limit = limit;

  return { filter, pagination };
}

module.exports = { buildFilterAndPagination }; 
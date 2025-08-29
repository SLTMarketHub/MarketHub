// Generic serialization for TMF resources
function getBaseUrl(req) {
  // e.g., http://localhost:3000/tmf-api/partnershipManagement/v4
  return `${req.protocol}://${req.get('host')}${req.baseUrl}`;
}

function serializeResource(doc, type, req, fields) {
  // Convert Mongoose doc to plain object
  let obj = doc.toObject ? doc.toObject() : { ...doc };

  // Remove Mongoose internals
  delete obj._id;
  delete obj.__v;

  // Always add mandatory TMF fields
  obj['@type'] = type;
  obj['href'] = `${getBaseUrl(req)}/${obj.id}`;

  // If fields param is present, filter, but always include mandatory fields
  if (fields) {
    const fieldSet = new Set(fields.split(',').map(f => f.trim()));
    // Always include mandatory fields
    ['id', '@type', 'href'].forEach(f => fieldSet.add(f));
    // Only keep allowed fields
    obj = Object.fromEntries(Object.entries(obj).filter(([k]) => fieldSet.has(k)));
  }

  return obj;
}

module.exports = { serializeResource }; 
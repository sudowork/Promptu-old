/**
 * Helper method to find all children of a group
 * @param groupid the id for the root of the tree
 * @param allDescendents boolean that specifies whether to include only
 *  immediate children (false) or all descendents (true)
 * @param includeRoot boolean that specifies whether to include the root
 * @param cb callback function with signature cb(groups)
 */
exports.actOnChildren = function (groupid, allDescendents, includeRoot, cb) {
  var all = existsOrElse(allDescendents, false)
    , root = existsOrElse(includeRoot, false)
    , r
    , query;
  if (all) {
    // All descendents
    r = new RegExp(groupid + '(,|$)' );
  } else {
    // Only immediate children
    r = new RegExp(groupid + '$');
  }
  query = {$or: [{path: r}]}
  if (root) query.$or.push({_id: groupid});

  Models.Group.find(query, function (err, groups) {
    if (err) {
      console.log(err);
    } else {
      cb(groups);
    }
  });
}

/**
 * GET /group/:id
 * Returns a single group with owner
 * @param req req.params.id should be the ObjectId for the desired group
 */
exports.getGroup = function (req, res) {
  var params = req.params;
  // TODO: Check view permissions
  Models.Group.findOne({_id: params.id})
    .populate('owner', ['_id', 'email', 'name'])
    .exec( function (err, group) {
      if (err) { E.sendUnk(res, err); return; }
      if (!group) {
        E.send(res, 'NOT_FOUND_EXCEPTION', {group: params.id});
        return;
      }
      res.json(group);
    });
}

/**
 * GET /group/tree/:id
 * Returns a group + its descendents
 * @param req req.params.id should be the ObjectId for the root group
 */
exports.getGroupTree = function (req, res) {
  // TODO: actually convert this into a tree structure
  var root = req.params.id;
  var returnChildren = function(groups) {
    res.json(groups);
  };
  this.actOnChildren(root, true, true, returnChildren);
}

/**
 * POST /group/create
 * Creates a new group with a given parent or as an independent group
 * @param req req.body should have name and owner; optionally specify parent and members
 */
exports.createGroup = function (req, res) {
  var params = req.body;
  params = _(params).pick(
    'parent',
    'name',
    'owner',
    'members'
  );
  // TODO: Check authorization for admin access to parent node
  // TODO: Verify that group names with same parent don't conflict
  if (exists(params.parent)) {
    // Find parent in order to inherit path
    Models.Group.findOne({
      _id: params.parent
    }, function (err, data) {
      if (err) { E.sendUnk(res, err); return; }
      if (!data) {
        E.send(res, 'NOT_FOUND_EXCEPTION', {group: params.parent});
        return;
      }
      // Construct new path by appending parent to parent's path
      var newPath;
      if (exists(data.path) && data.path.length > 0) {
        newPath = data.path + ',' + data._id;
      } else {
        newPath = data._id;
      }
      // Extend group params with path
      var groupParams = _.extend({}, params, {path: newPath, updated: Date.now()})
        , group = new Models.Group(groupParams);
      group.save(function (err) {
        if (err) {
          E.send(res, 'VALIDATION_EXCEPTION', err.errors);
        } else {
          res.send(201);
        }
      });
    });
  } else {
    // If no parent specified, treat group as root and save independently
    group = new Models.Group(_.extend({}, params, {path: '', updated: Date.now()}));
    group.save(function (err) {
      if (err) {
        E.send(res, 'VALIDATION_EXCEPTION', err.errors);
      } else {
        res.send(201);
      }
    });
  }
}

exports.addMemberToGroup = function (req, res) {
  params = req.body;
  console.log(params);
  if (!exists(params.user) || !exists(params.group)) {
    E.send(res, 'VALIDATION_EXCEPTION', params);
    return false;
  }
  // Check current user modify permissions on group
  Models.User.findOne({
    _id: params.user
  }, function (err, user) {
    if (err) { E.sendUnk(res, err); return; }
    if (!user) { E.send(res, 'NOT_FOUND_EXCEPTION', {user: req.user}); return; }
      Models.Group.findOne({
        _id: params.group
      }, function (err, group) {
        if (err) { E.sendUnk(res, err); return; }
        if (!group) { E.send(res, 'NOT_FOUND_EXCEPTION', {group: req.group}); return; }
        // add member to group and add group to user
        user.groups.push(params.group);
        group.members.push({user: params.user, permissions: ['read']});
        user.save(function (err) {
          if (err) { E.sendUnk(res, err); return; }
        });
        group.save(function (err) {
          if (err) { E.sendUnk(res, err); return; }
        });
        res.send(201);
      });
  });
}

exports.deleteGroup = function (req, res) {
  var root = req.params.id;
  if (!exists(root)) {
    E.sendE(res, 'VALIDATION_EXCEPTION', 'Group to delete needs to be provided');
    return;
  }
  // TODO: make sure that user is owner
  // NOTE: THIS DELETES ENTIRE SUBTREE STARTING WITH GIVEN GROUP ID
  Models.Group.find({
    _id: root
  }, function (err, group) {
    if (err) { E.sendUnk(res, err); return; }

    var deleteGroupAndDescendents = function (groups) {
      if (groups.length === 0) {
        E.send(res, 'NOT_FOUND_EXCEPTION', {group: params.id});
        return;
      }

      // Delete group and all of it's descendents
      var errors = [];
      _(groups).each(function (group) {
        group.remove(function (err) {
          if (err) errors.push(err);
        });
        if (errors.length > 0) {
          E.sendUnk(res, errors);
        } else {
          res.send(204);
        }
      });
    }
    this.actOnChildren(root, true, true, deleteGroupAndDescendents);
  });
}

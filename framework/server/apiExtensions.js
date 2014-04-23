module.exports = function (api) {
	api.public = {};
	api.public.get = function (path, handler) { publicHandler('get', path, handler); }
	api.public.post = function (path, handler) { publicHandler('post', path, handler); };
	api.public.put = function (path, handler) { publicHandler('put', path, handler); };
	api.public.delete = function (path, handler) { publicHandler('delete', path, handler); };
	api.public.all = function (path, handler) { publicHandler('all', path, handler); };

	api.private = {};
	api.private.get = function(path, permission, handler) { privateHandler('get', path, permission, handler); }
	api.private.post = function(path, permission, handler) { privateHandler('post', path, permission, handler); }
	api.private.put = function(path, permission, handler) { privateHandler('put', path, permission, handler); }
	api.private.delete = function(path, permission, handler) { privateHandler('delete', path, permission, handler); }
	api.private.all = function(path, permission, handler) { privateHandler('all', path, permission, handler); }

	var publicHandler = function (method, path, handler) {
		api[method](path, function(req, res, next) {
			if (req.session.user && req.url == app.config.auth.loginPage) {
				res.redirect('/');
				return;
			};

			handler(req, res, next);
		});
	}

	var privateHandler = function (method, path, permission, handler) {
		if (typeof permission == 'function') {
			handler = permission;
			permission = null;
		};

		api[method](path, function (req, res, next) {
		
			/*
			if (req.headers.privateKey == 'asd') {
				req.user = {}
				handler(req, res, next);
				
				return;
			}*/
			
			//handler(req, res, next);
				
			//return;
				
			
			// Authenticated
			if (req.session.user) {
				req.user = req.session.user;

				if (permission) { //If permission required.
					if (req.user.permissions.indexOf(permission) == -1) {
						if (req.xhr) {
							res.json(403, { message: 'You don\'t have permission to perform this action.'});
						} else {
							res.redirect(app.config.auth.loginPage);
						}

						return;
					};
				};

				handler(req, res, next);
				return;
			};

			// Not Authenticated
			// If ajax.
			if (req.xhr) {
				res.json(403, { message: 'You don\'t have a session opened'});
				return;
			}

			res.redirect(app.config.auth.loginPage);
		});
	} 

}
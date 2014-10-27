var model = app.model,
    multiparty = require('multiparty'),
    fs = require('fs'),
    path = require('path'),
    validate = app.validation.validate;

module.exports = function (router) {
    router.get('/layouts', function (req, res, next) {
        model.Layout.find({ company: req.company._id, deleted: false }).populate('editor').exec(function (err, layouts) {
            if (err) {
                return next(Error.create('An error occurred trying get the Layouts.', { }, err));
            }
            res.json(layouts);
        });
    });

    router.get('/layouts/:id', function (req, res, next) {
        if (!validate.objectId(req.params.id)) {
            return res.status(400).end();
        }
        model.Layout.findOne({_id: req.params.id, deleted: false, company: req.company._id}).populate('editor').exec(function (err, layout) {
            if (err) {
                return next(Error.create('An error occurred trying get the Layouts.', { }, err));
            }
            if (!layout) {
                return res.status(404).end();
            }
            res.json(layout);
        });
    });

    router.post('/layouts', function (req, res, next) {

        if(!fs.exists('public/images/layouts')){
                fs.mkdir('public/images/layouts', function(error) {
                    console.log(error);
                });
        }
        
        var form = new multiparty.Form();
        var upload = {layout: ''};
        form.on('error', next);
        form.on('close', function () {
            var layout = new model.Layout(JSON.parse(upload.layout));
            layout.editor = req.user._id;
            layout.company = req.company._id;
            layout.image = upload.image;
            layout.save(function (err, layout) {
                if (err) {
                    return next(Error.create('An error occurred trying save the Layout.', { }, err));
                }
                res.status(201).end();
            });
        });

        // listen on part event for image file
        form.on('part', function (part) {
            if (part.name == 'layout') {
                part.on('data', function (buffer) {
                    upload.layout += buffer;
                });
            }
            if (part.name == 'file') {
                upload.image = path.join('images/layouts', req.company._id + "-" + part.filename);
                upload.fsfile = fs.createWriteStream(path.join('public', upload.image));
                part.pipe(upload.fsfile);
            }
        });
        form.parse(req);
    });

    router.put('/layouts/:id', function (req, res, next) {
                
        if(!fs.exists('public/images/layouts')){
                fs.mkdir('public/images/layouts', function(error) {
                    console.log(error);
                });
        }
        
        var form = new multiparty.Form();
        var upload = {layout: ''};
        form.on('error', next);
        form.on('close', function () {
            var layout = JSON.parse(upload.layout);
            delete layout._id;
            layout.editor = req.user._id;
            if (upload.image) {
                layout.image = upload.image;
            }
            model.Layout.findByIdAndUpdate(req.params.id, layout, function (err, layout) {
                if (err) {
                    return next(Error.create('An error occurred trying get the Layout.', { }, err));
                }
                res.status(200).end();
            });
        });

        // listen on part event for image file
        form.on('part', function (part) {
            if (part.name == 'layout') {
                part.on('data', function (buffer) {
                    upload.layout += buffer;
                });
            }
            if (part.name == 'file') {
                upload.image = path.join('images/layouts', req.company._id + "-" + part.filename);
                upload.fsfile = fs.createWriteStream(path.join('public', upload.image));
                part.pipe(upload.fsfile);
            }
        });
        form.parse(req);
    });

    router.delete('/layouts/:id', function (req, res, next) {
        model.Layout.findOne({_id: req.params.id, deleted: false, company: req.company._id}, function (err, layout) {
            if (err) {
                return next(Error.create('An error occurred trying get the Layout.', { }, err));
            }
            if (!layout) {
                return res.status(404).end();
            }
            layout.deleted = true;
            layout.save(function (err) {
                if (err) {
                    return next(Error.create('An error occurred trying delete the Layout.', { }, err));
                }
                res.status(200).end();
            });
        });
    });

    return router;
};
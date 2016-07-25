var mongoose = require('mongoose');
var resume = mongoose.model('resume');
var user = mongoose.model('user');

var path = require('path');

//Trying to chang to search resumes
exports.findAllResumes = function (req, res) {
    resume.find({
        //name: new RegExp(req.query.name, "i"),
        //resume_type: new RegExp(req.query.resume_type, "i"),
        isPublic: true
    }, function (err, resume) {
        if (err) {
            throw new Error(err);
        }
        res.send(resume);
    });
};

exports.addResume = function (req, res) {
    console.log(req.user + ' is trying to make a resume');
    console.log(req.query.id + ' this is the template I want to use');
    user.findOne({username: new RegExp(req.user, "i")}, '_id', function (err, foundUser) {
        if (err) {
            throw new Error(err);
        }
        if (foundUser == null) {
            res.render('createresume', {message: "For some reason, you don't exist..."})
        }

        var document = new resume(req.body);
        console.log(document);
        if (document.isPublic == undefined) {
            console.log('but ' + req.user + ' did not provide \'isPublic\'. This attr is required');
        }


        document.save(function (err, resume) {
            if (err) {
                throw new Error(err);
            }

            user.findByIdAndUpdate(foundUser._id, {$push: {resumes: resume._id}}, function (err) {
                if (err) {
                    return next(err);
                } else {

                  var exec = require('child_process').exec;
                  var cmd = 'sudo ./../../templates/laton text.tex input.sty helvetica.sty res.cls';
                  var Pages = [
                    'contact_info',
                    'education',
                    'Skills',
                    'Projects',
                    'work_experence'
                  ]
                  var ContactInfo = [
                    'full_name',
                    'email',
                    'phone_number',
                    'gitHub',
                    'linkedIn'
                  ]
                  var Education = [
                    'university',
                    'start_Month',
                    'end_Month',
                    'start_Year',
                    'end_Year',
                    'degree',
                    'city'
                  ]
                  var Skills = [
                    'programming_Languages',
                    'iDEs',
                    'technologies',
                    'databases'
                  ]
                  var Projects = [
                    'project_name',
                    'project_link',
                    'project_description',
                    'project_implementation',
                    'project_technologies'
                  ]
                  var WorkExperience = [
                    'job_title',
                    'employer',
                    'city',
                    'start_month',
                    'start_year',
                    'end_month',
                    'end_year',
                    'job_description',
                  ]
                  console.log(Object.keys(resume));
                  for (var x in Pages){
                    switch(Pages[x]){
                      case 'contact_info':
                        for (var y in ContactInfo){
                          console.log(ContactInfo[y] + ': ' + resume[Pages[x]][0][ContactInfo[y]]);
                        }
                      break;
                      case 'education':
                        for (var y in Education){
                          console.log(Education[y] + ': ' + resume[Pages[x]][0][Education[y]]);
                        }
                      break;
                      case 'Skills':
                        for (var y in Skills){
                          console.log(Skills[y] + ': ' + resume[Pages[x]][0][Skills[y]]);
                        }
                      break;
                      case 'Projects':
                        for (var y in Projects){
                          console.log(Projects[y] + ': ' + resume[Pages[x]][0][Projects[y]]);
                        }
                      break;
                      case 'work_experence':
                        for (var y in WorkExperience){
                          console.log(WorkExperience[y] + ': ' + resume[Pages[x]][0][WorkExperience[y]]);
                        }
                      break;
                    }
                  }
                  /*var fs = require('fs');
                  fs.writeFile("/../../templates/input_1.sty",
                    var comd = "\newcommand";
                  , function(err) {
                    if(err) {
                      return console.log(err);
                    }
                    console.log("The file was saved!");
                  });
                  exec(cmd, function(error, stdout, stderr) {
                    // command output is in stdout
                  });*/
                    res.json(resume);
                }
            });
        });
    });
};

exports.updateResume = function (req, res, next) {
    user.findByIdAndUpdate(req.params.id, req.body, function (err, user) {
        if (err) {
            return next(err);
        } else {
            res.json(user);
        }
    });
};

exports.findOneResume = function (req, res) {
    resume.findById(req.params.id, function (err, resume_s) {
        if (err) {
            throw new Error(err);
        }
        res.send(resume_s);
    });
};


exports.removeResume = function (req, res) {
    resume.findByIdAndRemove(req.params.id, function (err, resume) {
        if (err) {
            throw new Error(err);
        }
        res.send(resume);
    });
};

exports.getTemplate = function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../../templates/text.pdf'));
};

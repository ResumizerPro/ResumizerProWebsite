var mongoose = require('mongoose');
var resume = mongoose.model('resume');
var user = mongoose.model('user');

var path = require('path');

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
  'programming_languages',
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


                  var fs = require('fs');
                  var latex = '';
                  var cmmd = "\\newcommand";
                    for (var x in Pages){
                      switch(Pages[x]){
                        case 'contact_info':
                          for (var y in ContactInfo){
                            var name = '\\' + ContactInfo[y].split('_').join('');
                            latex += cmmd + "{" + name + "}" + "{"+ resume[Pages[x]][0][ContactInfo[y]] + "}\n" ;
                            console.log(ContactInfo[y] + ': ' + resume[Pages[x]][0][ContactInfo[y]]);
                          }
                          break;
                        case 'education':
                          for (var y in Education){
                            var name = '\\' + Education[y].split('_').join('').toUpperCase();
                            latex += cmmd + "{" + name + "E}" + "{"+ resume[Pages[x]][0][Education[y]] + "}\n" ;
                            console.log(Education[y] + ': ' + resume[Pages[x]][0][Education[y]]);
                          }
                          break;
                        case 'Skills':
                          for (var y in Skills){
                            var name = '\\' + Skills[y].split('_').join('');
                            latex += cmmd + "{" + name + "}" + "{"+ resume[Pages[x]][0][Skills[y]] + "}\n" ;
                            console.log(Skills[y] + ': ' + resume[Pages[x]][0][Skills[y]]);
                          }
                          break;
                        case 'Projects':
                          for (var y in Projects){
                            var name = '\\' + Projects[y].split('_').join('');
                            latex += cmmd + "{" + name + "}" + "{"+ resume[Pages[x]][0][Projects[y]] + "}\n" ;
                            console.log(Projects[y] + ': ' + resume[Pages[x]][0][Projects[y]]);
                          }
                          break;
                        case 'work_experence':
                          for (var y in WorkExperience){
                            var name = '\\' + WorkExperience[y].split('_').join('').toUpperCase();
                            latex += cmmd + "{" + name + "W}" + "{"+ resume[Pages[x]][0][WorkExperience[y]] + "}\n" ;
                            console.log(WorkExperience[y] + ': ' + resume[Pages[x]][0][WorkExperience[y]]);
                          }
                          break;
                        }
                  }
                fs.writeFile(__dirname + "/input_1.sty",latex , function(err) {
                    if(err) {
                      return console.log(err);
                    }
                    console.log("The file was saved!");
                  });
                  /*var fs = require('fs');
                  fs.writeFile("/../../templates/input_1.sty",
                    var comd = "\newcommand";
                  , function(err) {
                    if(err) {
                      return console.log(err);
                    }
                    console.log("The file was saved!");
                  });*/




                    res.redirect('/createresume?id=' + req.query.id);
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
    res.sendFile(path.resolve(__dirname + '/text.pdf'));
};

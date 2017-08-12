const User = require('../models/user'); // Import User Model Schema
const Project = require('../models/project'); // Import Project Model Schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../config/database'); // Import database configuration

module.exports = (router) => {

    /* ===============================================================
       CREATE NEW PROJECT
    =============================================================== */
    router.post('/newProject', (req, res) => {
        // Check if project title was provided
        if (!req.body.title) {
            res.json({ success: false, message: 'Project title is required.' }); // Return error message
        } else {
            // Check if project total savings was provided
            if (!req.body.totalSavings) {
                res.json({ success: false, message: 'Project Total Savings is required.' }); // Return error message
            } else {
                // Check if project monthly savings was provided
                if (!req.body.monthlySavings) {
                    res.json({ success: false, message: 'Project Monthly Savings is required.' }); // Return error message
                } else {
                    // Check if project's creator was provided
                    if (!req.body.createdBy) {
                        res.json({ success: false, message: 'Project creator is required.' }); // Return error
                    } else {
                        // Create the project object for insertion into database
                        const project = new Project({
                            title: req.body.title, // Title field
                            totalSavings: req.body.totalSavings, // totalSavings field
                            monthlySavings: req.body.monthlySavings, // monthlySavings field
                            createdBy: req.body.createdBy // CreatedBy field
                        });
                        // Save project into database
                        project.save((err) => {
                            // Check if error
                            if (err) {
                                // Check if error is a validation error
                                if (err.errors) {
                                    // Check if validation error is in the title field
                                    if (err.errors.title) {
                                        res.json({ success: false, message: err.errors.title.message }); // Return error message
                                    } else {
                                        // Check if validation error is in the totalSavings field
                                        if (err.errors.totalSavings) {
                                            res.json({ success: false, message: err.errors.totalSavings.message }); // Return error message
                                        } else {
                                            // Check if validation error is in the monthlySavings field
                                            if (err.errors.monthlySavings) {
                                                res.json({ success: false, message: err.errors.monthlySavings.message }); // Return error message
                                            }
                                            else {
                                                res.json({ success: false, message: err }); // Return general error message
                                            }   
                                        }
                                    }
                                } else {
                                    res.json({ success: false, message: err }); // Return general error message
                                }
                            } else {
                                res.json({ success: true, message: 'Project saved!' }); // Return success message
                            }
                        });
                    }
                }
            }
        }
    });

      /* ===============================================================
         GET ALL PROJECTS FOR CURRENT USER
      =============================================================== */
    router.get('/allProjects', (req, res) => {
        // Find the current user that is logged in
        User.findOne({ _id: req.decoded.userId }, (err, user) => {
            // Check if error was found
            if (err) {
                res.json({ success: false, message: err }); // Return error
            } else {
                // Check if username was found in database
                if (!user) {
                  res.json({ success: false, message: 'Unable to authenticate user' }); // Return error message
                } else {
                    // Search database for all projects belonging to current logged in user
                    Project.find({ createdBy: user.username}, (err, projects) => {
                    // Check if error was found or not
                    if (err) {
                        res.json({ success: false, message: err }); // Return error message
                        } else {
                            // Check if blogs were found in database
                            if (!projects) {
                                res.json({ success: false, message: 'No projects found.' }); // Return error of no blogs found
                            } else {
                                res.json({ success: true, projects: projects }); // Return success and blogs array
                            }
                        }
                    }).sort({ '_id': -1 }); // Sort projects from newest to oldest
                }
            }
        });
    });

      /* ===============================================================
         GET SINGLE PROJECT
      =============================================================== */
      router.get('/singleProject/:id', (req, res) => {
        // Check if id is present in parameters
        if (!req.params.id) {
          res.json({ success: false, message: 'No project ID was provided.' }); // Return error message
        } else {
          // Check if the blog id is found in database
          Project.findOne({ _id: req.params.id }, (err, project) => {
            // Check if the id is a valid ID
            if (err) {
              res.json({ success: false, message: 'Not a valid project id' }); // Return error message
            } else {
              // Check if project was found by id
              if (!project) {
                res.json({ success: false, message: 'Project not found.' }); // Return error message
              } else {
                // Find the current user that is logged in
                User.findOne({ _id: req.decoded.userId }, (err, user) => {
                  // Check if error was found
                  if (err) {
                    res.json({ success: false, message: err }); // Return error
                  } else {
                    // Check if username was found in database
                    if (!user) {
                      res.json({ success: false, message: 'Unable to authenticate user' }); // Return error message
                    } else {
                      // Check if the user who requested single projct is the one who created it
                      if (user.username !== project.createdBy) {
                        res.json({ success: false, message: 'You are not authorized to edit this project.' }); // Return authentication reror
                      } else {
                        res.json({ success: true, project: project }); // Return success
                      }
                    }
                  }
                });
              }
            }
          });
        }
      });

      /* ===============================================================
         UPDATE TOTAL SAVINGS
      =============================================================== */
      router.put('/updateTotalSavings', (req, res) => {
        // Check if id was provided
        if (!req.body._id) {
          res.json({ success: false, message: 'No project id provided' }); // Return error message
        } else {
          // Check if id exists in database
          Project.findOne({ _id: req.body._id }, (err, project) => {
            // Check if id is a valid ID
            if (err) {
              res.json({ success: false, message: 'Not a valid project id' }); // Return error message
            } else {
              // Check if id was found in the database
              if (!project) {
                res.json({ success: false, message: 'Project id was not found.' }); // Return error message
              } else {
                // Check who user is that is requesting project update
                User.findOne({ _id: req.decoded.userId }, (err, user) => {
                  // Check if error was found
                  if (err) {
                    res.json({ success: false, message: err }); // Return error message
                  } else {
                    // Check if user was found in the database
                    if (!user) {
                      res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
                    } else {
                      // Check if user logged in the the one requesting to update blog post
                      if (user.username !== project.createdBy) {
                        res.json({ success: false, message: 'You are not authorized to edit this project.' }); // Return error message
                      } else {
                        project.totalSavings = req.body.totalSavings; // Save latest totalSavings
                        project.targetDuration = req.body.targetDuration;
                        project.save((err) => {
                          if (err) {
                            if (err.errors) {
                              res.json({ success: false, message: 'Please ensure form is filled out properly' });
                            } else {
                              res.json({ success: false, message: err }); // Return error message
                            }
                          } else {
                            res.json({ success: true, message: 'Project Updated!' }); // Return success message
                          }
                        });
                      }
                    }
                  }
                });
              }
            }
          });
        }
      });



     /* ===============================================================
         UPDATE MONTHLY SAVINGS
      =============================================================== */
      router.put('/updateMonthlySavings', (req, res) => {
        // Check if id was provided
        if (!req.body._id) {
          res.json({ success: false, message: 'No project id provided' }); // Return error message
        } else {
          // Check if id exists in database
          Project.findOne({ _id: req.body._id }, (err, project) => {
            // Check if id is a valid ID
            if (err) {
              res.json({ success: false, message: 'Not a valid project id' }); // Return error message
            } else {
              // Check if id was found in the database
              if (!project) {
                res.json({ success: false, message: 'Project id was not found.' }); // Return error message
              } else {
                // Check who user is that is requesting project update
                User.findOne({ _id: req.decoded.userId }, (err, user) => {
                  // Check if error was found
                  if (err) {
                    res.json({ success: false, message: err }); // Return error message
                  } else {
                    // Check if user was found in the database
                    if (!user) {
                      res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
                    } else {
                      // Check if user logged in the the one requesting to update blog post
                      if (user.username !== project.createdBy) {
                        res.json({ success: false, message: 'You are not authorized to edit this project.' }); // Return error message
                      } else {
                        project.monthlySavings = req.body.monthlySavings; // Save latest monthlySavings
                        project.targetDuration = req.body.targetDuration;
                        project.save((err) => {
                          if (err) {
                            if (err.errors) {
                              res.json({ success: false, message: 'Please ensure form is filled out properly' });
                            } else {
                              res.json({ success: false, message: err }); // Return error message
                            }
                          } else {
                            res.json({ success: true, message: 'Project Updated!' }); // Return success message
                          }
                        });
                      }
                    }
                  }
                });
              }
            }
          });
        }
      });/* ===============================================================
         UPDATE TOTAL COSTS
      =============================================================== */
      router.put('/updateTotalCost', (req, res) => {
        // Check if id was provided
        if (!req.body._id) {
          res.json({ success: false, message: 'No project id provided' }); // Return error message
        } else {
          // Check if id exists in database
          Project.findOne({ _id: req.body._id }, (err, project) => {
            // Check if id is a valid ID
            if (err) {
              res.json({ success: false, message: 'Not a valid project id' }); // Return error message
            } else {
              // Check if id was found in the database
              if (!project) {
                res.json({ success: false, message: 'Project id was not found.' }); // Return error message
              } else {
                // Check who user is that is requesting project update
                User.findOne({ _id: req.decoded.userId }, (err, user) => {
                  // Check if error was found
                  if (err) {
                    res.json({ success: false, message: err }); // Return error message
                  } else {
                    // Check if user was found in the database
                    if (!user) {
                      res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
                    } else {
                      // Check if user logged in the the one requesting to update blog post
                      if (user.username !== project.createdBy) {
                        res.json({ success: false, message: 'You are not authorized to edit this project.' }); // Return error message
                      } else {
                        project.totalCost = req.body.totalCost; // Save latest totalSavings
                        project.save((err) => {
                          if (err) {
                            if (err.errors) {
                              res.json({ success: false, message: 'Please ensure form is filled out properly' });
                            } else {
                              res.json({ success: false, message: err }); // Return error message
                            }
                          } else {
                            res.json({ success: true, message: 'Project Updated!' }); // Return success message
                          }
                        });
                      }
                    }
                  }
                });
              }
            }
          });
        }
      });



    /* ===============================================================
         LINE ITEMS FOR PROJECT
      =============================================================== */
     router.post('/lineItem', (req, res)=>{
        // Check if line item was provided in request body
        if (!req.body.listItem) {
            res.json({success: false, message: 'No list item provided'}); // Return error message
        } else {
            // Check if cost of line item was provided in request body
            if (!req.body.cost) {
                res.json({ success: false, message: 'No cost for line item provided.'}); // Return error message
            } else {
                // Check if id was provided in request body
                if (!req.body.id) {
                    res.json({ success: false, message: 'No id was provided.'}); // Return error message
                }
                else {
                    // Use id to search for project in database
                    Project.findOne({ _id: req.body.id }, (err, project)=>{
                        // Check if error was found
                        if (err) {
                            res.json({success: false, message: 'Invalid project id'}); // Return error message
                        }
                        else {
                            // Check if id matched the id of any project in the database
                            if (!project) {
                                res.json({success: false, message: 'Project not found.'}); // Return error message
                            }
                            else {
                                // Grab data of user that is logged in
                                User.findOne({ _id: req.decoded.userId }, (err, user) => {
                                    // Check if error was found
                                    if (err) {
                                        res.json({success: false, message: 'Something went wrong'}); // Return error message
                                    }
                                    else {
                                        // Check if user was found in database
                                        if (!user) {
                                            res.json({success: false, message: 'User not found.'});
                                        }
                                        else {
                                            // Add the new item to the project items' array
                                            project.items.push({
                                                listItem: req.body.listItem, // List Item field
                                                cost: req.body.cost // Cost field
                                            });
                                            // Save project
                                            project.save((err) => {
                                                if (err){
                                                    //res.json({success: false, message: 'Something went wrong.'}); // Return error message
                                                    res.json({success: false, message: err.message});
                                                }
                                                else {
                                                    res.json({success: true, message: 'Item saved!'}); // Return success message
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }
     });
    
      
      /* ===============================================================
         DELETE PROJECT
      =============================================================== */
      router.delete('/deleteProject/:id', (req, res) => {
        // Check if ID was provided in parameters
        if (!req.params.id) {
          res.json({ success: false, message: 'No id provided' }); // Return error message
        } else {
          // Check if id is found in database
          Project.findOne({ _id: req.params.id }, (err, project) => {
            // Check if error was found
            if (err) {
              res.json({ success: false, message: 'Invalid id' }); // Return error message
            } else {
              // Check if project was found in database
              if (!project) {
                res.json({ success: false, messasge: 'Project was not found' }); // Return error message
              } else {
                // Get info on user who is attempting to delete project
                User.findOne({ _id: req.decoded.userId }, (err, user) => {
                  // Check if error was found
                  if (err) {
                    res.json({ success: false, message: err }); // Return error message
                  } else {
                    // Check if user's id was found in database
                    if (!user) {
                      res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
                    } else {
                      // Check if user attempting to delete project is the same user who originally posted the blog
                      if (user.username !== project.createdBy) {
                        res.json({ success: false, message: 'You are not authorized to delete this project' }); // Return error message
                      } else {
                        // Remove the project from database
                        project.remove((err) => {
                          if (err) {
                            res.json({ success: false, message: err }); // Return error message
                          } else {
                            res.json({ success: true, message: 'Project deleted!' }); // Return success message
                          }
                        });
                      }
                    }
                  }
                });
              }
            }
          });
        }
      });

    //   /* ===============================================================
    //      LIKE BLOG POST
    //   =============================================================== */
    //   router.put('/likeBlog', (req, res) => {
    //     // Check if id was passed provided in request body
    //     if (!req.body.id) {
    //       res.json({ success: false, message: 'No id was provided.' }); // Return error message
    //     } else {
    //       // Search the database with id
    //       Blog.findOne({ _id: req.body.id }, (err, blog) => {
    //         // Check if error was encountered
    //         if (err) {
    //           res.json({ success: false, message: 'Invalid blog id' }); // Return error message
    //         } else {
    //           // Check if id matched the id of a blog post in the database
    //           if (!blog) {
    //             res.json({ success: false, message: 'That blog was not found.' }); // Return error message
    //           } else {
    //             // Get data from user that is signed in
    //             User.findOne({ _id: req.decoded.userId }, (err, user) => {
    //               // Check if error was found
    //               if (err) {
    //                 res.json({ success: false, message: 'Something went wrong.' }); // Return error message
    //               } else {
    //                 // Check if id of user in session was found in the database
    //                 if (!user) {
    //                   res.json({ success: false, message: 'Could not authenticate user.' }); // Return error message
    //                 } else {
    //                   // Check if user who liked post is the same user that originally created the blog post
    //                   if (user.username === blog.createdBy) {
    //                     res.json({ success: false, messagse: 'Cannot like your own post.' }); // Return error message
    //                   } else {
    //                     // Check if the user who liked the post has already liked the blog post before
    //                     if (blog.likedBy.includes(user.username)) {
    //                       res.json({ success: false, message: 'You already liked this post.' }); // Return error message
    //                     } else {
    //                       // Check if user who liked post has previously disliked a post
    //                       if (blog.dislikedBy.includes(user.username)) {
    //                         blog.dislikes--; // Reduce the total number of dislikes
    //                         const arrayIndex = blog.dislikedBy.indexOf(user.username); // Get the index of the username in the array for removal
    //                         blog.dislikedBy.splice(arrayIndex, 1); // Remove user from array
    //                         blog.likes++; // Increment likes
    //                         blog.likedBy.push(user.username); // Add username to the array of likedBy array
    //                         // Save blog post data
    //                         blog.save((err) => {
    //                           // Check if error was found
    //                           if (err) {
    //                             res.json({ success: false, message: 'Something went wrong.' }); // Return error message
    //                           } else {
    //                             res.json({ success: true, message: 'Blog liked!' }); // Return success message
    //                           }
    //                         });
    //                       } else {
    //                         blog.likes++; // Incriment likes
    //                         blog.likedBy.push(user.username); // Add liker's username into array of likedBy
    //                         // Save blog post
    //                         blog.save((err) => {
    //                           if (err) {
    //                             res.json({ success: false, message: 'Something went wrong.' }); // Return error message
    //                           } else {
    //                             res.json({ success: true, message: 'Blog liked!' }); // Return success message
    //                           }
    //                         });
    //                       }
    //                     }
    //                   }
    //                 }
    //               }
    //             });
    //           }
    //         }
    //       });
    //     }
    //   });

    //   /* ===============================================================
    //      DISLIKE BLOG POST
    //   =============================================================== */
    //   router.put('/dislikeBlog', (req, res) => {
    //     // Check if id was provided inside the request body
    //     if (!req.body.id) {
    //       res.json({ success: false, message: 'No id was provided.' }); // Return error message
    //     } else {
    //       // Search database for blog post using the id
    //       Blog.findOne({ _id: req.body.id }, (err, blog) => {
    //         // Check if error was found
    //         if (err) {
    //           res.json({ success: false, message: 'Invalid blog id' }); // Return error message
    //         } else {
    //           // Check if blog post with the id was found in the database
    //           if (!blog) {
    //             res.json({ success: false, message: 'That blog was not found.' }); // Return error message
    //           } else {
    //             // Get data of user who is logged in
    //             User.findOne({ _id: req.decoded.userId }, (err, user) => {
    //               // Check if error was found
    //               if (err) {
    //                 res.json({ success: false, message: 'Something went wrong.' }); // Return error message
    //               } else {
    //                 // Check if user was found in the database
    //                 if (!user) {
    //                   res.json({ success: false, message: 'Could not authenticate user.' }); // Return error message
    //                 } else {
    //                   // Check if user who disliekd post is the same person who originated the blog post
    //                   if (user.username === blog.createdBy) {
    //                     res.json({ success: false, messagse: 'Cannot dislike your own post.' }); // Return error message
    //                   } else {
    //                     // Check if user who disliked post has already disliked it before
    //                     if (blog.dislikedBy.includes(user.username)) {
    //                       res.json({ success: false, message: 'You already disliked this post.' }); // Return error message
    //                     } else {
    //                       // Check if user has previous disliked this post
    //                       if (blog.likedBy.includes(user.username)) {
    //                         blog.likes--; // Decrease likes by one
    //                         const arrayIndex = blog.likedBy.indexOf(user.username); // Check where username is inside of the array
    //                         blog.likedBy.splice(arrayIndex, 1); // Remove username from index
    //                         blog.dislikes++; // Increase dislikeds by one
    //                         blog.dislikedBy.push(user.username); // Add username to list of dislikers
    //                         // Save blog data
    //                         blog.save((err) => {
    //                           // Check if error was found
    //                           if (err) {
    //                             res.json({ success: false, message: 'Something went wrong.' }); // Return error message
    //                           } else {
    //                             res.json({ success: true, message: 'Blog disliked!' }); // Return success message
    //                           }
    //                         });
    //                       } else {
    //                         blog.dislikes++; // Increase likes by one
    //                         blog.dislikedBy.push(user.username); // Add username to list of likers
    //                         // Save blog data
    //                         blog.save((err) => {
    //                           // Check if error was found
    //                           if (err) {
    //                             res.json({ success: false, message: 'Something went wrong.' }); // Return error message
    //                           } else {
    //                             res.json({ success: true, message: 'Blog disliked!' }); // Return success message
    //                           }
    //                         });
    //                       }
    //                     }
    //                   }
    //                 }
    //               }
    //             });
    //           }
    //         }
    //       });
    //     }
    //   });

    //   /* ===============================================================
    //      COMMENT ON BLOG POST
    //   =============================================================== */
    //   router.post('/comment', (req, res) => {
    //     // Check if comment was provided in request body
    //     if (!req.body.comment) {
    //       res.json({ success: false, message: 'No comment provided' }); // Return error message
    //     } else {
    //       // Check if id was provided in request body
    //       if (!req.body.id) {
    //         res.json({ success: false, message: 'No id was provided' }); // Return error message
    //       } else {
    //         // Use id to search for blog post in database
    //         Blog.findOne({ _id: req.body.id }, (err, blog) => {
    //           // Check if error was found
    //           if (err) {
    //             res.json({ success: false, message: 'Invalid blog id' }); // Return error message
    //           } else {
    //             // Check if id matched the id of any blog post in the database
    //             if (!blog) {
    //               res.json({ success: false, message: 'Blog not found.' }); // Return error message
    //             } else {
    //               // Grab data of user that is logged in
    //               User.findOne({ _id: req.decoded.userId }, (err, user) => {
    //                 // Check if error was found
    //                 if (err) {
    //                   res.json({ success: false, message: 'Something went wrong' }); // Return error message
    //                 } else {
    //                   // Check if user was found in the database
    //                   if (!user) {
    //                     res.json({ success: false, message: 'User not found.' }); // Return error message
    //                   } else {
    //                     // Add the new comment to the blog post's array
    //                     blog.comments.push({
    //                       comment: req.body.comment, // Comment field
    //                       commentator: user.username // Person who commented
    //                     });
    //                     // Save blog post
    //                     blog.save((err) => {
    //                       // Check if error was found
    //                       if (err) {
    //                         res.json({ success: false, message: 'Something went wrong.' }); // Return error message
    //                       } else {
    //                         res.json({ success: true, message: 'Comment saved' }); // Return success message
    //                       }
    //                     });
    //                   }
    //                 }
    //               });
    //             }
    //           }
    //         });
    //       }
    //     }
    //   });

    return router;
};
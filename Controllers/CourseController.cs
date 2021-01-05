using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MvcProject.Models;
using MvcProject.Models.Entity;

namespace MvcProject.Controllers
{
    public class CourseController : Controller
    {     
        public IActionResult Index()
        {
            var firstCourse = new Course
            {
                Id = 1, Author = "Mattia", Name = "Matematica", Duration = 120
            };

            var secondCourse = new Course
            {
                Id = 2, Author = "Mattia", Name = "Geografia", Duration = 120
            };

            List<CourseViewModel> model = new List<CourseViewModel>();
            model.Add(CourseViewModel.FromEntity(firstCourse));
            model.Add(CourseViewModel.FromEntity(secondCourse));
            ViewData["Title"] = "Guarda tutti i corsi";
            return View(model);
        }      
    }
}

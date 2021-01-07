using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using MvcProject.Models.Services;
using MvcProject.Models.Services.Interfaces;

namespace MvcProject.Controllers
{
    public class CourseController : Controller
    {
        private readonly ICourseService _courseService;

        public CourseController(ICourseService courseService)
        {
            _courseService = courseService;
        }

        public IActionResult Index()
        {        
            ViewData["Title"] = "Guarda tutti i corsi";
            List<CourseViewModel> model = _courseService.GetAllCourses();
            
            return View(model);
        }      
    }
}

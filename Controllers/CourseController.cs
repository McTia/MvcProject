using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using MvcProject.Models;
using MvcProject.Models.Services;
using MvcProject.Models.Services.Interfaces;
using MvcProject.Models.ViewModels;

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
            var model = _courseService.GetAllCourses(0);
            return View(model);
        }

        public IActionResult Courses(TableInput option)
        {
            var offset = option.start;
            var alldata = _courseService.GetAllCourses(offset);
            var count = alldata.Count;

            List<Object[]> result = alldata.CourseList.Select(x =>
            {
                return new Object[] { x.Author, x.Name, x.Duration, x.Id };
            }).ToList();

            return Json(new { draw = option.draw, data = result, recordsTotal = count, recordsFiltered = count });
        }

        [HttpPost]
        public IActionResult CourseAjax(CRUD_ACTION m, CourseViewModel model)
        {

            if (m != CRUD_ACTION.delete && !ModelState.IsValid)
            {
                string[] errors = ModelState.Values.SelectMany(v => v.Errors).Select(v => v.ErrorMessage).ToArray();
                return Json(new { errors = errors });
            }


            JsonResult result = Json("OK");
            switch (m)
            {
                case CRUD_ACTION.create:
                    var insResult = _courseService.AddCourse(model);
                    if (insResult == 0) // set it to 0
                        return Json(new { errors = new string[] { "Inserimento non riuscito.." } });
                    break;

                case CRUD_ACTION.update:
                    var upResult = _courseService.UpdateCourse(model);
                    if (upResult == 1) // set it to 0
                        return Json(new { errors = new string[] { "Aggiornamento non riuscito.." } });
                    break;
                case CRUD_ACTION.delete:
                    var delResult = _courseService.RemoveCourse(model);
                    if (delResult == 0)
                        return Json(new { errors = new string[] { "Eliminazione non riuscita.." } });
                    break;
                default:
                    return Json(new { errors = new string[] { "Operazione non permessa" } });
            }
            return result;
        }
    }
}
